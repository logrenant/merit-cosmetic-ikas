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

class BackInStockStore {
  productName: string = "";
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
    const saved = safeLocalStorage.getItem("backInStockData");
    if (!saved) {
      this.isInitialized = true;
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      runInAction(() => {
        this.productName = parsed.productName ?? "";
        this.firstName   = parsed.firstName   ?? "";
        this.lastName    = parsed.lastName    ?? "";
        this.email       = parsed.email       ?? "";
        this.phoneNumber = parsed.phoneNumber ?? "";
        this.message     = parsed.message     ?? "";
        this.isInitialized = true;
      });
    } catch (e) {
      console.error("BackInStockStore yükleme hatası:", e);
      this.isInitialized = true;
    }
  }

  private saveToLocalStorage() {
    if (!isClient) return;

    const data = {
      productName: this.productName,
      firstName:   this.firstName,
      lastName:    this.lastName,
      email:       this.email,
      phoneNumber: this.phoneNumber,
      message:     this.message,
    };
    
    safeLocalStorage.setItem("backInStockData", JSON.stringify(data));
  }

  setProductName(productName: string) {
    runInAction(() => {
      this.productName = productName;
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
      this.productName = "";
      this.firstName   = "";
      this.lastName    = "";
      this.email       = "";
      this.phoneNumber = "";
      this.message     = "";
    });

    safeLocalStorage.removeItem("backInStockData");
  }
}

let storeInstance: BackInStockStore | null = null;

const createBackInStockStore = (): BackInStockStore => {
  if (isClient && storeInstance) {
    return storeInstance;
  }
  
  const newStore = new BackInStockStore();
  
  if (isClient) {
    storeInstance = newStore;
  }
  
  return newStore;
};

export const backInStockStore = createBackInStockStore();
