import { useEffect } from 'react';
import { useStore } from '@ikas/storefront';
import AppStateStore from '../store/app-state-store';
import { purchasedProductsStore } from '../store/purchased-products-store';

const usePurchasedProductsLoader = () => {
  const store = useStore();
  const appStateStore = AppStateStore.getInstance();

  useEffect(() => {
    console.log('🚀 usePurchasedProductsLoader hook çalıştırıldı');
    
    // Her mount, refresh, login durumunda çalışacak
    const checkAndLoadPurchasedProducts = async () => {
      try {
        console.log('⏳ Customer store kontrol ediliyor...');
        console.log('📍 Store durumu:', {
          storeExists: !!store,
          customerStoreExists: !!store?.customerStore,
          waitUntilInitializedExists: !!store?.customerStore?.waitUntilInitialized,
          isFirstLoad: appStateStore.isFirstLoad
        });
        
        // Customer store'un tamamen yüklenmesini bekle
        if (store?.customerStore?.waitUntilInitialized) {
          console.log('⏳ Customer store initialization bekleniyor...');
          await store.customerStore.waitUntilInitialized();
          console.log('✅ Customer store initialization tamamlandı');
        } else {
          console.log('⚠️ waitUntilInitialized fonksiyonu bulunamadı');
        }
        
        // İlk yükleme tamamlandığını işaretle
        if (appStateStore.isFirstLoad) {
          console.log('🎯 İlk yükleme tamamlandı, durumu güncelleniyor...');
          appStateStore.setIsFirstLoad(false);
        }
        
        console.log('🔍 Hook durum kontrolü:', {
          hasCustomer: !!store?.customerStore?.customer,
          customerInfo: store?.customerStore?.customer ? 'Mevcut' : 'Yok',
          customerFirstName: store?.customerStore?.customer?.firstName || 'N/A',
          customerEmail: store?.customerStore?.customer?.email || 'N/A',
          isLoggedIn: !!store?.customerStore?.customer
        });
        
        // Kullanıcı login durumunda sipariş verilerini yükle
        if (store?.customerStore?.customer) {
          console.log('🔄 Kullanıcı login durumda, sipariş verileri yükleniyor...');
          console.log('👤 Customer bilgileri:', {
            id: store.customerStore.customer.id,
            email: store.customerStore.customer.email,
            firstName: store.customerStore.customer.firstName,
            lastName: store.customerStore.customer.lastName
          });
          
          try {
            // Store temizle ve yeniden yükle
            purchasedProductsStore.clear();
            console.log('🧹 Store temizlendi, yeni veriler yüklenecek...');
            
            console.log('📞 loadUserPurchasedProducts çağrılıyor...');
            await appStateStore.loadUserPurchasedProducts(store.customerStore);
            console.log('✅ loadUserPurchasedProducts tamamlandı');
            
            console.log('📋 Store yükleme işlemi sonucu:', {
              isLoaded: purchasedProductsStore.isLoaded,
              productCount: purchasedProductsStore.purchasedCount,
              allProductIds: Array.from(purchasedProductsStore.purchasedProductIds)
            });
          } catch (error) {
            console.error('❌ Satın alınan ürünler yüklenirken hata:', error);
          }
        } else {
          // Kullanıcı logout olmuşsa store'u temizle
          console.log('🚪 Kullanıcı login değil, store temizleniyor...');
          purchasedProductsStore.clear();
        }
      } catch (error) {
        console.error('❌ Customer store initialization hatası:', error);
      }
    };

    // Her component mount'unda ve customer değişikliğinde çalışır
    checkAndLoadPurchasedProducts();
  }, [store?.customerStore?.customer]);

  return null;
};

export default usePurchasedProductsLoader;
