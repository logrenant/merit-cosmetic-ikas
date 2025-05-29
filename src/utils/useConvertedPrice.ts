import { formatCurrency } from "@ikas/storefront";
import UIStore from "../store/ui-store";

interface Currency {
  name: string;
  currencySymbol: string;
}

const currencyData: Currency[] = [
  { name: "USD", currencySymbol: "$" },
  { name: "EUR", currencySymbol: "€" },
  { name: "GBP", currencySymbol: "£" },
  { name: "AED", currencySymbol: "د.إ" },
  { name: "SAR", currencySymbol: "ر.س" },
  { name: "KWD", currencySymbol: "د.ك" },
  { name: "BHD", currencySymbol: "د.ب" },
  { name: "OMR", currencySymbol: "ر.ع" },
  { name: "QAR", currencySymbol: "ر.ق" },
  { name: "TRY", currencySymbol: "₺" },
  { name: "CAD", currencySymbol: "$" },
];

export default function useConvertedPrice() {
  const uiStore = UIStore.getInstance();

  const convertPrice = (price: number): number => {
    try {
      const rates = uiStore.rates;
      if (!rates || uiStore.currency === "USD") return price;

      const rate = rates[uiStore.currency];
      return rate ? Number((price * rate).toFixed(2)) : price;
    } catch (error) {
      console.error("Price conversion error:", error);
      return price;
    }
  };

  const formatConvertedPrice = (price: number): string => {
    try {
      const targetCurrency = currencyData.find(c => c.name === uiStore.currency) || {
        name: "USD",
        currencySymbol: "$"
      };

      const convertedPrice = convertPrice(price);
      // Binlik ayırıcı ve ondalık formatı için
      const formattedPrice = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(convertedPrice);

      return `${formattedPrice} ${targetCurrency.currencySymbol}`;
    } catch (error) {
      console.error("Price formatting error:", error);
      // Hata durumunda da aynı formatı koruyoruz
      const targetCurrency = currencyData.find(c => c.name === uiStore.currency) || {
        name: "USD",
        currencySymbol: "$"
      };
      return `${price.toFixed(2)} ${targetCurrency.currencySymbol}`;
    }
  };

  return {
    formatPrice: formatConvertedPrice,
    convertPrice,
  };
}