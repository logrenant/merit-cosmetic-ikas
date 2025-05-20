// src/utils/orderStore.ts
import { makeAutoObservable } from "mobx";

class OrderStore {
  orderNumber: string | null = null;
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  phoneNumber: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setOrderNumber(orderNumber: string) {
    this.orderNumber = orderNumber;
  }
  setFirstName(firstName: string) {
    this.firstName = firstName;
  }
  setLastName(lastName: string) {
    this.lastName = lastName;
  }
  setEmail(email: string) {
    this.email = email;
  }
  setPhoneNumber(phoneNumber: string) {
    this.phoneNumber = phoneNumber;
  }
  clearAll() {
    this.orderNumber = null;
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.phoneNumber = "";
  }
}

export const orderStore = new OrderStore();
