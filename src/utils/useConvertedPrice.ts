import { formatCurrency } from "@ikas/storefront";
import UIStore from "../store/ui-store";

// Tüm para birimi verilerini merkezi bir yerde tutalım
const currencyData = [
  {
    name: "USD",
    currencySymbol: "$",
  },
  {
    name: "EUR",
    currencySymbol: "€",
  },
  {
    name: "GBP",
    currencySymbol: "£",
  },
  {
    name: "AED",
    currencySymbol: "د.إ",
  },
  {
    name: "SAR",
    currencySymbol: "ر.س",
  },
  {
    name: "KWD",
    currencySymbol: "د.ك",
  },
  {
    name: "BHD",
    currencySymbol: "د.ب",
  },
  {
    name: "OMR",
    currencySymbol: "ر.ع",
  },
  {
    name: "QAR",
    currencySymbol: "ر.ق",
  },
  {
    name: "TRY",
    currencySymbol: "₺",
  },
  {
    name: "CAD",
    currencySymbol: "$",
  },
];

export default function useConvertedPrice() {
  const uiStore = UIStore.getInstance();

  const convertPrice = (price: number) => {
    try {
      // Store'dan güncel döviz kurlarını al
      const rates = uiStore.rates;
      
      // Eğer USD seçiliyse veya kur yoksa orijinal fiyatı dön
      if (!rates || uiStore.currency === "USD") return price;

      // Mevcut para biriminin kurunu bul
      const rate = rates[uiStore.currency];
      if (!rate) return price;

      // Dönüşümü yap ve yuvarla
      return parseFloat((price * rate).toFixed(2));
    } catch (error) {
      console.error("Price conversion error:", error);
      return price;
    }
  };

  const formatConvertedPrice = (price: number) => {
    try {
      // Para birimi verilerini bul
      const targetCurrency = currencyData.find(
        (c) => c.name === uiStore.currency
      );

      // Fallback olarak USD kullan
      if (!targetCurrency) {
        return formatCurrency(price, "USD", "$");
      }

      // Dönüştürülmüş fiyatı al
      const convertedPrice = convertPrice(price);

      // Formatlanmış string'i döndür
      return formatCurrency(
        convertedPrice,
        targetCurrency.name,
        targetCurrency.currencySymbol
      );
    } catch (error) {
      console.error("Price formatting error:", error);
      return formatCurrency(price, "USD", "$");
    }
  };

  return {
    formatPrice: formatConvertedPrice,
    convertPrice,
  };
}