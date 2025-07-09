import { makeAutoObservable } from "mobx";

class LanguageStore {
  private static _instance: LanguageStore;
  
  currentLang: "en" | "ar" = "en";
  firstLoadDone: boolean = false;

  constructor() {
    makeAutoObservable(this);
    
    // Load from localStorage on client side
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new LanguageStore();
    }
    return this._instance;
  }

  private loadFromStorage() {
    try {
      const savedFirstLoad = localStorage.getItem('lang_first_load_done');
      const savedLang = localStorage.getItem('current_lang');
      
      if (savedFirstLoad === 'true') {
        this.firstLoadDone = true;
      }
      
      if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
        this.currentLang = savedLang as "en" | "ar";
      }
    } catch (error) {
      console.error('LanguageStore: LocalStorage loading error:', error);
    }
  }

  setLang(lang: "en" | "ar") {
    this.currentLang = lang;
    if (typeof window !== 'undefined') {
      localStorage.setItem('current_lang', lang);
    }
  }

  setFirstLoadDone(done: boolean) {
    this.firstLoadDone = done;
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang_first_load_done', String(done));
    }
  }
}

export default LanguageStore;
