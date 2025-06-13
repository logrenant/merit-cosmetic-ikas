import { makeAutoObservable, runInAction } from "mobx";

const isClient = typeof window !== 'undefined';

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isClient) return null;
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('LocalStorage getItem error:', e);
      return null;
    }
  },
  
  setItem: (key: string, value: string): boolean => {
    if (!isClient) return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.error('LocalStorage setItem error:', e);
      return false;
    }
  },
  
  removeItem: (key: string): boolean => {
    if (!isClient) return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('LocalStorage removeItem error:', e);
      return false;
    }
  }
};

class OrderStore {
  orderNumber: string = "";
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  phoneNumber: string = "";
  message: string = "";
  isInitialized: boolean = false;

  constructor() {
    makeAutoObservable(this, {
      isInitialized: false 
    });

    if (isClient) {
      if (document.readyState === 'complete') {
        this.loadFromLocalStorage();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.loadFromLocalStorage();
        });
      }
    }
  }

  private loadFromLocalStorage() {
    const saved = safeLocalStorage.getItem("orderContactData");
    if (!saved) {
      this.isInitialized = true;
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      runInAction(() => {
        this.orderNumber = parsed.orderNumber ?? "";
        this.firstName   = parsed.firstName   ?? "";
        this.lastName    = parsed.lastName    ?? "";
        this.email       = parsed.email       ?? "";
        this.phoneNumber = parsed.phoneNumber ?? "";
        this.message     = parsed.message     ?? "";
        this.isInitialized = true;
      });
    } catch (e) {
      console.error("OrderStore yükleme hatası:", e);
      this.isInitialized = true;
    }
  }

  private saveToLocalStorage() {
    if (!isClient) return;

    const data = {
      orderNumber: this.orderNumber,
      firstName:   this.firstName,
      lastName:    this.lastName,
      email:       this.email,
      phoneNumber: this.phoneNumber,
      message:     this.message,
    };
    
    safeLocalStorage.setItem("orderContactData", JSON.stringify(data));
  }

  setOrderNumber(orderNumber: string) {
    runInAction(() => {
      this.orderNumber = orderNumber;
      this.saveToLocalStorage();
    });
  }

  setFirstName(firstName: string) {
    runInAction(() => {
      this.firstName = firstName;
      this.saveToLocalStorage();
    });
  }

  setLastName(lastName: string) {
    runInAction(() => {
      this.lastName = lastName;
      this.saveToLocalStorage();
    });
  }

  setEmail(email: string) {
    runInAction(() => {
      this.email = email;
      this.saveToLocalStorage();
    });
  }

  setPhoneNumber(phoneNumber: string) {
    runInAction(() => {
      this.phoneNumber = phoneNumber;
      this.saveToLocalStorage();
    });
  }

  setMessage(message: string) {
    runInAction(() => {
      this.message = message;
      this.saveToLocalStorage();
    });
  }

  clearAll() {
    runInAction(() => {
      this.orderNumber = "";
      this.firstName   = "";
      this.lastName    = "";
      this.email       = "";
      this.phoneNumber = "";
      this.message     = "";
    });

    safeLocalStorage.removeItem("orderContactData");
  }
}

let storeInstance: OrderStore | null = null;

const createOrderStore = (): OrderStore => {
  if (isClient && storeInstance) {
    return storeInstance;
  }
  
  const newStore = new OrderStore();
  
  if (isClient) {
    storeInstance = newStore;
  }
  
  return newStore;
};

export const orderStore = createOrderStore();
