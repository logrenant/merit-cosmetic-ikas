import { makeAutoObservable, action } from "mobx";

export default class UIStore {
  private static _instance: UIStore;
  searchKeyword = "";
  direction = "ltr";
  currency = "USD";
  maxQuantityPerCartProductErrorModal = {
    visible: false,
    productName: "",
  };

  constructor() {
    makeAutoObservable(this, {
      setCurrency: action,
      setDirection: action,
    });
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new UIStore();
    }
    return this._instance;
  }

  // Yeni para birimi ayarlama methodu
  setCurrency = (newCurrency: string) => {
    this.currency = newCurrency;
  };

  // Dil yönü ayarlama methodu
  setDirection = (newDirection: "ltr" | "rtl") => {
    this.direction = newDirection;
  };
}