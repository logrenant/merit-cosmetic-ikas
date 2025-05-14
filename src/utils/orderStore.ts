import { makeAutoObservable } from "mobx";

class OrderStore {
  orderNumber: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setOrderNumber(number: string) {
    this.orderNumber = number;
  }
}

export const orderStore = new OrderStore();
