import { useEffect, useState, useCallback, useMemo } from 'react';
import { IkasProduct } from '@ikas/storefront';

interface LocationInfo {
  country?: string;
  isLoading: boolean;
  error?: string;
}

// Cache key for sessionStorage
const LOCATION_CACHE_KEY = 'user_location_country';

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
        
        const response = await fetch('https://geolocation-db.com/json/');
        const data = await response.json();
        
        // Cache the result in sessionStorage
        if (data.country_code) {
          sessionStorage.setItem(LOCATION_CACHE_KEY, data.country_code);
        }
        
        setLocationInfo({
          country: data.country_code,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error detecting location:', error);
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
    if (!products) return [];
    if (!isTurkishIP) return products;
    
    // Filter out products that are not available for purchase for Turkish IPs
    return products.filter(product => product.isAddToCartEnabled);
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
  
  return { 
    ...locationInfo, 
    isTurkishIP,
    filterProductsByLocation,
    adjustProductCount,
    shouldShowProduct
  };
};
