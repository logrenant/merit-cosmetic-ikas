import { useState, useEffect } from "react";
import UIStore from "../store/ui-store";
import { formatCurrency } from "@ikas/storefront";
import axios from "axios";
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
    if (
      localStorage.getItem("currency") &&
      typeof localStorage.getItem("currency") !== "string" &&
      typeof window !== "undefined"
    ) {
      const data = JSON.parse(localStorage.getItem("currency") as string);
      setCurrencies(data);
    }
  }, [uiStore.currency]);
  const formatPrice = (price: number, formattedPrice: string) => {
    const currency = uiStore.currency;
    if (
      currencies &&
      currency &&
      data.find((e) => e.name === currency) &&
      currency !== "USD"
    ) {
      const item = data.find((e) => e.name === currency)!;
      const currencyRate = currencies[currency as keyof typeof currencies];
      const convertedPrice = price * currencyRate;

      return formatCurrency(convertedPrice, item?.name, item?.currencySymbol);
    } else {
      return formattedPrice;
    }
  };

  return {
    formatPrice,
  };
}
