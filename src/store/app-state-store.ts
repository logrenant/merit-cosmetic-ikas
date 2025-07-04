import { makeAutoObservable } from "mobx";

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
}

export default AppStateStore;
