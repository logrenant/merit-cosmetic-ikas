import { useEffect, useState, useCallback, useMemo } from 'react';
import { IkasProduct } from '@ikas/storefront';

interface LocationInfo {
  country?: string;
  isLoading: boolean;
  error?: string;
}

// Cache key for sessionStorage
const LOCATION_CACHE_KEY = '307c9b90-40e0-11f0-b52a-77b24fe75cdd';

export const useUserLocation = () => {
  const [locationInfo, setLocationInfo] = useState<LocationInfo>(() => {
    // Initialize with cached value if available (only on client side)
    if (typeof window !== 'undefined') {
      const cachedCountry = sessionStorage.getItem(LOCATION_CACHE_KEY);
      if (cachedCountry) {
        return {
          country: cachedCountry,
          isLoading: false
        };
      }
    }
    return { isLoading: true };
  });
  
  useEffect(() => {
    // Skip if we already have data from sessionStorage
    if (!locationInfo.isLoading && locationInfo.country) {
      return;
    }
    
    const checkLocation = async () => {
      try {
        if (typeof window === 'undefined') {
          setLocationInfo({ isLoading: false, country: undefined });
          return;
        }
        
        console.log('🌍 Starting location check...');
        
        // İlk olarak http://ip-api.com/json deneyelim
        try {
          const response = await fetch('http://ip-api.com/json');
          const data = await response.json();

          console.log('🌍 ip-api.com API Response:', data);
          
          if (data.country_code) {
            sessionStorage.setItem(LOCATION_CACHE_KEY, data.country_code);
            setLocationInfo({
              country: data.country_code,
              isLoading: false,
            });
            return;
          }
        } catch (error) {
          console.warn('🌍 geolocation-db.com failed, trying alternative:', error);
        }
        
        // Alternatif API deneyelim
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          
          console.log('🌍 ipapi.co API Response:', data);
          
          if (data.country_code) {
            sessionStorage.setItem(LOCATION_CACHE_KEY, data.country_code);
            setLocationInfo({
              country: data.country_code,
              isLoading: false,
            });
            return;
          }
        } catch (error) {
          console.warn('🌍 ipapi.co failed, trying another alternative:', error);
        }
        
        // Son alternatif
        try {
          const response = await fetch('https://api.country.is/');
          const data = await response.json();
          
          console.log('🌍 country.is API Response:', data);
          
          if (data.country) {
            sessionStorage.setItem(LOCATION_CACHE_KEY, data.country);
            setLocationInfo({
              country: data.country,
              isLoading: false,
            });
            return;
          }
        } catch (error) {
          console.warn('🌍 country.is failed:', error);
        }
        
        console.warn('🌍 All location APIs failed');
        
        // Development ortamında default olarak TR olarak ayarla
        if (process.env.NODE_ENV === 'development') {
          console.log('🌍 Development mode: Setting default country to TR');
          sessionStorage.setItem(LOCATION_CACHE_KEY, 'TR');
          setLocationInfo({
            country: 'TR',
            isLoading: false,
          });
          return;
        }
        
        setLocationInfo({
          isLoading: false,
          error: 'Could not detect location - all APIs failed',
        });
        
      } catch (error) {
        console.error('🌍 Error detecting location:', error);
        setLocationInfo({
          isLoading: false,
          error: 'Could not detect location',
        });
      }
    };
    
    checkLocation();
  }, [locationInfo.isLoading, locationInfo.country]);
  
  const isTurkishIP = useMemo(() => {
    return !locationInfo.isLoading && locationInfo.country === 'TR';
  }, [locationInfo.isLoading, locationInfo.country]);
  
  // Optimized helper function to filter products based on user's location
  const filterProductsByLocation = useCallback((products: IkasProduct[]) => {
    if (!products || !Array.isArray(products)) return [];
    if (!isTurkishIP) return products;
    
    // Filter out products that are not available for purchase for Turkish IPs
    // Add additional safety checks to ensure product state is valid
    return products.filter(product => {
      if (!product) return false;
      // Check if the product has proper state and is available for purchase
      return product.isAddToCartEnabled === true && product.hasStock !== false;
    });
  }, [isTurkishIP]);
  
  const adjustProductCount = useCallback((products: IkasProduct[], totalCount: number) => {
    if (!products || !totalCount) return totalCount || 0;
    if (!isTurkishIP) return totalCount;
    
    if (products.length === totalCount) {
      return products.filter(product => product.isAddToCartEnabled).length;
    } else {
      const availablePercentage = products.filter(product => product.isAddToCartEnabled).length / products.length;
      return Math.round(totalCount * availablePercentage);
    }
  }, [isTurkishIP]);
  
  // Utility function to check if specific product should be shown
  const shouldShowProduct = useCallback((product: IkasProduct) => {
    if (!product) return false;
    if (!isTurkishIP) return true;
    
    return product.isAddToCartEnabled;
  }, [isTurkishIP]);
  
  // Function to automatically fetch next batch if filtered products are insufficient
  const getNextBatchIfNeeded = useCallback(async (
    currentProducts: IkasProduct[], 
    productsManager: any, // The products store/manager
    minDesiredCount: number = 20
  ): Promise<IkasProduct[]> => {
    if (!isTurkishIP || !productsManager || !currentProducts) {
      return currentProducts;
    }

    const availableProducts = currentProducts.filter(product => product.isAddToCartEnabled);
    
    // If we have enough available products or no more pages, return current products
    if (availableProducts.length >= minDesiredCount || !productsManager.hasNext) {
      return currentProducts;
    }

    // Calculate how many more products we need
    const neededCount = minDesiredCount - availableProducts.length;
    
    try {
      // Fetch next batch
      await productsManager.getNext();
      
      // Recursively check if we need more products
      return getNextBatchIfNeeded(productsManager.data, productsManager, minDesiredCount);
    } catch (error) {
      console.error('Error fetching next batch of products:', error);
      return currentProducts;
    }
  }, [isTurkishIP]);

  return { 
    ...locationInfo, 
    isTurkishIP,
    filterProductsByLocation,
    adjustProductCount,
    shouldShowProduct,
    getNextBatchIfNeeded
  };
};
