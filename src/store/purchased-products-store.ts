import { makeAutoObservable } from "mobx";

class PurchasedProductsStore {
  purchasedProductIds: Set<string> = new Set();
  isLoaded: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setPurchasedProductIds(productIds: string[]) {
    this.purchasedProductIds = new Set(productIds);
    this.isLoaded = true;
  }

  addPurchasedProductId(productId: string) {
    this.purchasedProductIds.add(productId);
  }

  hasPurchased(productId: string): boolean {
    return this.purchasedProductIds.has(productId);
  }

  clear() {
    this.purchasedProductIds.clear();
    this.isLoaded = false;
  }

  get purchasedCount(): number {
    return this.purchasedProductIds.size;
  }
}

export const purchasedProductsStore = new PurchasedProductsStore();
