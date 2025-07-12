import { makeAutoObservable } from "mobx";
import { purchasedProductsStore } from "./purchased-products-store";

class AppStateStore {
  private static _instance: AppStateStore;
  
  // Uygulamanın ilk kez mi yüklendiğini izler
  isFirstLoad: boolean = true;
  
  // Kullanıcının manuel olarak değiştirdiği dil
  userSelectedLocale: string | null = null;

  constructor() {
    makeAutoObservable(this);
    
    // Client tarafında localStorage'dan durumu yükle
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new AppStateStore();
    }
    return this._instance;
  }
  
  private loadFromStorage() {
    try {
      // İlk yükleme durumunu localStorage'dan kontrol et
      const storedFirstLoad = localStorage.getItem('app_first_load');
      if (storedFirstLoad === 'false') {
        this.isFirstLoad = false;
      }
      
      // Kullanıcının seçtiği dili localStorage'dan kontrol et
      const userLocale = localStorage.getItem('user_selected_locale');
      if (userLocale) {
        this.userSelectedLocale = userLocale;
      }
    } catch (error) {
      console.error('AppStateStore: LocalStorage yükleme hatası:', error);
    }
  }

  // İlk yükleme durumunu güncelle
  setIsFirstLoad(value: boolean) {
    this.isFirstLoad = value;
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_first_load', String(value));
    }
  }
  
  // Kullanıcının seçtiği dili kaydet
  setUserSelectedLocale(locale: string) {
    this.userSelectedLocale = locale;
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_selected_locale', locale);
    }
  }

  // Kullanıcının dil seçimini sıfırla
  resetUserSelectedLocale() {
    this.userSelectedLocale = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_selected_locale');
    }
  }

  // Login sonrası kullanıcının sipariş verilerini çek ve satın aldığı ürünleri kaydet
  // Sadece order line item'larda productId varsa review açılır, iade veya başka bir filtre uygulanmaz
  async loadUserPurchasedProducts(customerStore: any) {
    console.log('🔥 loadUserPurchasedProducts fonksiyonu başladı');
    console.log('📊 App State:', {
      isFirstLoad: this.isFirstLoad,
      userSelectedLocale: this.userSelectedLocale
    });
    console.log('📊 CustomerStore parametresi:', {
      exists: !!customerStore,
      type: typeof customerStore,
      getOrdersExists: !!customerStore?.getOrders,
      customerExists: !!customerStore?.customer,
      customerId: customerStore?.customer?.id
    });
    
    try {
      if (!customerStore) {
        console.log('❌ CustomerStore parametresi yok!');
        return;
      }
      
      if (!customerStore.customer) {
        console.log('❌ Customer bilgisi yok!');
        return;
      }
      
      console.log('📞 customerStore.getOrders() çağrılıyor...');
      const orders = await customerStore.getOrders();
      console.log('📦 Müşteri Siparişleri RAW:', orders);
      console.log('📦 Orders type:', typeof orders);
      console.log('📦 Orders structure:', Object.keys(orders || {}));
      
      // Tüm siparişlerden ürün ID'lerini çıkar
      const purchasedProductIds = new Set<string>();
      
      if (orders && Array.isArray(orders) && orders.length > 0) {
        console.log(`📋 Toplam ${orders.length} sipariş bulundu`);
        
        orders.forEach((order: any, orderIndex: number) => {
          console.log(`\n🛒 Order #${orderIndex} ANALİZ:`);
          console.log(`   📋 Order ID: ${order.id}`);
          console.log(`   📋 Order Number: ${order.orderNumber}`);
          
          // orderLineItems'ı kontrol et (Proxy Array olabilir)
          if (order.orderLineItems) {
            // Proxy Array'i normal array'e dönüştür
            const lineItems = Array.from(order.orderLineItems);
            console.log(`   ✅ OrderLineItems bulundu: ${lineItems.length} adet`);
            
            lineItems.forEach((item: any, itemIndex: number) => {
              // variant.productId'yi al
              const productId = item.variant?.productId;
              
              if (productId) {
                console.log(`🔍 Order #${orderIndex} - LineItem #${itemIndex} - Product ID: ${productId}`);
                purchasedProductIds.add(productId);
              } else {
                console.log(`❌ Order #${orderIndex} - LineItem #${itemIndex} - Product ID bulunamadı!`);
                console.log(`   📊 Item yapısı:`, item);
                console.log(`   📊 Variant yapısı:`, item.variant);
              }
            });
          } else {
            console.log(`   ⚠️ Order #${orderIndex} - orderLineItems bulunamadı!`);
            console.log(`   📊 Order keys:`, Object.keys(order));
          }
        });
      } else {
        console.log('❌ Orders dizisi boş veya bulunamadı!');
        console.log('📊 Orders yapısı:', orders);
        console.log('📊 Orders type:', typeof orders);
        console.log('📊 Orders isArray:', Array.isArray(orders));
        if (orders) {
          console.log('📊 Orders keys:', Object.keys(orders));
        }
      }
      
      // Global store'a kaydet
      purchasedProductsStore.setPurchasedProductIds(Array.from(purchasedProductIds));
      
      console.log(`✅ Satın alınan ${purchasedProductIds.size} benzersiz ürün store'a kaydedildi:`);
      console.log('🔗 Ürün ID\'leri:', Array.from(purchasedProductIds));
      
    } catch (error) {
      console.error('❌ Kullanıcı sipariş verileri yüklenirken hata:', error);
    }
  }
}

export default AppStateStore;
