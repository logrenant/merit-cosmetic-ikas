import axios from "axios";
import { useState, useEffect } from "react";
import { formatCurrency } from "@ikas/storefront";

import UIStore from "../store/ui-store";

export default function useConvertedPrice() {
  const data = [
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
  const uiStore = UIStore.getInstance();
  const [currencies, setCurrencies] = useState<{
    AED: number;
    BHD: number;
    CAD: number;
    EUR: number;
    GBP: number;
    KWD: number;
    OMR: number;
    QAR: number;
    SAR: number;
    TRY: number;
  }>();

useEffect(() => {
  const fetchCurrencies = async () => {
    const response = await axios.get(
      "https://api.exchangerate.host/live?access_key=1a7f131e80a984e61b57d34a56d1de09"
    );
    localStorage.setItem("currency", JSON.stringify(response.data.quotes));
    setCurrencies(response.data.quotes);
  };

  if (typeof window !== "undefined") {
    const storedData = localStorage.getItem("currency");
    if (storedData) {
      try {
        setCurrencies(JSON.parse(storedData));
      } catch (error) {
        fetchCurrencies();
      }
    } else {
      fetchCurrencies();
    }
  }
}, [uiStore.currency]);

  
const formatPrice = (price: number, formattedPrice: string) => {
  if (!currencies || uiStore.currency === "USD") return formattedPrice;
  
  const rate = currencies[`USD${uiStore.currency}` as keyof typeof currencies];
  if (!rate) return formattedPrice;

  const convertedPrice = price * rate;
  const currencyInfo = data.find((e) => e.name === uiStore.currency);
  
  return currencyInfo 
    ? formatCurrency(convertedPrice, currencyInfo.name, currencyInfo.currencySymbol)
    : formattedPrice;
};

  return {
    formatPrice,
  };
}
