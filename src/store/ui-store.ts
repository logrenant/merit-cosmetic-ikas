import { makeAutoObservable, action } from "mobx";

export default class UIStore {
  private static _instance: UIStore;
  searchKeyword = "";
  direction: "ltr" | "rtl" = "ltr";
  currency = "USD";
  rates: Record<string, number> = {};
  maxQuantityPerCartProductErrorModal = {
    visible: false,
    productName: "",
  };

  constructor() {
    makeAutoObservable(this, {
      setCurrency: action,
      setDirection: action,
      setRates: action,
    });
    
    // Sadece istemci tarafında çalışacak şekilde düzenleme
    if (typeof window !== "undefined") {
      this.loadFromLocalStorage();
    }
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new UIStore();
    }
    return this._instance;
  }

  private loadFromLocalStorage() {
    try {
      const savedCurrency = localStorage.getItem("selectedcurrency");
      if (savedCurrency) {
        const parsed = JSON.parse(savedCurrency);
        this.currency = parsed.name;
      }
      
      const savedRates = localStorage.getItem("currencyRates");
      if (savedRates) {
        this.rates = JSON.parse(savedRates);
      }
    } catch (error) {
      console.error("LocalStorage yükleme hatası:", error);
    }
  }

  setCurrency = (newCurrency: string) => {
    this.currency = newCurrency;
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedcurrency", JSON.stringify({
        name: newCurrency,
        currencySymbol: this.getCurrencySymbol(newCurrency)
      }));
    }
  };

  setRates = (rates: Record<string, number>) => {
    this.rates = rates;
    if (typeof window !== "undefined") {
      localStorage.setItem("currencyRates", JSON.stringify(rates));
    }
  };

  setDirection = (newDirection: "ltr" | "rtl") => {
    this.direction = newDirection;
  };

  private getCurrencySymbol(currency: string) {
    const currencies = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      AED: "د.إ",
      SAR: "ر.س",
      KWD: "د.ك",
      BHD: "د.ب",
      OMR: "ر.ع",
      QAR: "ر.ق",
      TRY: "₺",
      CAD: "$"
    };
    return currencies[currency as keyof typeof currencies] || "$";
  }
}