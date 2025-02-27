import { makeAutoObservable } from "mobx";

export default class UIStore {
  private static _instance: UIStore;
  searchKeyword = "";
  direction = "ltr";
  currency = "USD";
  maxQuantityPerCartProductErrorModal: {
    visible: boolean;
    productName: string;
  } = {
    visible: false,
    productName: "",
  };

  private constructor() {
    makeAutoObservable(this);
  }

  static getInstance() {
    if (this._instance) return this._instance;
    this._instance = new UIStore();
    return this._instance;
  }
}
