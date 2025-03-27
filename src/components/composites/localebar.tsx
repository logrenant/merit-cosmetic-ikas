import axios from "axios";
import { observer } from "mobx-react-lite";
import { useStore } from "@ikas/storefront";
import { useOnClickOutside } from "usehooks-ts";
import { useState, useEffect, useRef } from "react";
import { IkasStorefrontConfig } from "@ikas/storefront-config";

import UsFlag from "../svg/UsFlag";
import EuFlag from "../svg/EuFlag";
import UkFlag from "../svg/UkFlag";
import TrFlag from "../svg/TrFlag";
import AedFlag from "../svg/AedFlag";
import SarFlag from "../svg/SarFlag";
import KwdFlag from "../svg/KwdFlag";
import BhdFlag from "../svg/BhdFlag";
import OmrFlag from "../svg/OmrFlag";
import QarFlag from "../svg/QarFlag";
import CadFlag from "../svg/CadFlag";
import UIStore from "../../store/ui-store";

const datas = [
  {
    name: "USD",
    currencySymbol: "$",
    flag: (
      <UsFlag />
    ),
  },
  {
    name: "EUR",
    currencySymbol: "€",
    flag: (
      <EuFlag />
    ),
  },
  {
    name: "GBP",
    currencySymbol: "£",
    flag: (
      <UkFlag />
    ),
  },
  {
    name: "AED",
    currencySymbol: "د.إ",
    flag: (
      <AedFlag />
    ),
  },
  {
    name: "SAR",
    currencySymbol: "ر.س",
    flag: (
      <SarFlag />
    ),
  },
  {
    name: "KWD",
    currencySymbol: "د.ك",
    flag: (
      <KwdFlag />
    ),
  },
  {
    name: "BHD",
    currencySymbol: "د.ب",
    flag: (
      <BhdFlag />
    ),
  },
  {
    name: "OMR",
    currencySymbol: "ر.ع",
    flag: (
      <OmrFlag />
    ),
  },
  {
    name: "QAR",
    currencySymbol: "ر.ق",
    flag: (
      <QarFlag />
    ),
  },
  {
    name: "TRY",
    currencySymbol: "₺",
    flag: (
      <TrFlag />
    ),
  },
  {
    name: "CAD",
    currencySymbol: "$",
    flag: (
      <CadFlag />
    ),
  },
];
const LocalBar = () => {
  const languageRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState({
    currencySymbol: "$",
    name: "USD",
  });
  const store = useStore();
  const uiStore = UIStore.getInstance();
  useOnClickOutside(languageRef, () => {
    setLanguageOpen(false);
  });
  useOnClickOutside(currencyRef, () => {
    setCurrencyOpen(false);
  });
  const [selectedLocale, setSelectedLocale] = useState<string>();
  useEffect(() => {
    if (store.router?.locale) {
      setSelectedLocale(store.router?.locale);
    }
  }, [store.router]);
  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await axios.get(
          "https://api.exchangerate.host/live?access_key=1a7f131e80a984e61b57d34a56d1de09"
        );
        console.log(response.data.quotes);

        localStorage.setItem("currency", JSON.stringify(response.data.rates));
        const currencyLocal = localStorage.getItem("selectedcurrency");
        if (currencyLocal) {
          uiStore.currency = JSON?.parse(currencyLocal).name;
          setCurrency(JSON?.parse(currencyLocal));
        }
      } catch (err) {
        setLoading(false);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrency();
  }, []);
  const langOptions = IkasStorefrontConfig.getRoutings();
  return (
    <div className="w-full py-1.5 text-center text-[13px] text-[color:var(--black-two)] flex items-center justify-center bg-[color:var(--gray-bg)]">
      <div className="layout w-full flex justify-end">
        <div ref={languageRef} className="relative">
          <button
            onClick={() => {
              setLanguageOpen(!languageOpen);
            }}
            className="flex gap-1 items-center"
          >
            {selectedLocale !== "ar" && (
              <span className="flex gap-1 items-center justify-center">
                <UkFlag />
                English
              </span>
            )}
            {selectedLocale === "ar" && (
              <span className="flex gap-1 items-center justify-center">
                <SarFlag />
                Arabic
              </span>
            )}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
          {languageOpen && (
            <div className="absolute z-50 right-0 top-[22px] rounded-sm overflow-hidden bg-[color:var(--bg-color)] shadow-navbar">
              <div className="flex flex-col divide-y divide-[color:var(--gray-one)]">
                {langOptions.map((localeOption) => (
                  <button
                    key={localeOption.id}
                    onClick={() => {
                      window.location.replace(
                        window.location.origin +
                        (localeOption.locale === "ar" ? "/ar" : "") +
                        (store.router ? store.router.asPath : "")
                      );
                      setLanguageOpen(false);
                    }}
                    className="text-left gap-1.5 flex items-center px-3 whitespace-nowrap py-1.5 w-full"
                  >
                    {localeOption.locale === "ar" && (
                      <SarFlag />
                    )}

                    {localeOption.locale !== "ar" && (
                      <UkFlag />
                    )}

                    {localeOption.locale === "ar" && "Arabic"}
                    {localeOption.locale !== "ar" && "English"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div ref={currencyRef} className="relative rtl:mr-3 ltr:ml-3">
          <button
            disabled={loading || error}
            onClick={() => {
              setCurrencyOpen(!currencyOpen);
            }}
            className="flex gap-1 items-center disabled:cursor-default disabled:animate-pulse"
          >
            <span className="flex items-center gap-1">
              {datas.find((e) => e.name === currency.name)?.flag}
              <span>
                {currency.name} {currency.currencySymbol}
              </span>
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
          {currencyOpen && (
            <div className="absolute z-50 rtl:left-0 ltr:right-0 top-[22px] rounded-sm overflow-hidden bg-[color:var(--bg-color)] shadow-navbar">
              <div className="flex flex-col divide-y divide-[color:var(--gray-one)]">
                {datas.map((e) => (
                  <button
                    onClick={() => {
                      setCurrency({
                        name: e.name,
                        currencySymbol: e.currencySymbol,
                      });
                      uiStore.currency = e.name;
                      localStorage.setItem(
                        "selectedcurrency",
                        JSON.stringify(e)
                      );
                      setCurrencyOpen(false);
                    }}
                    key={e.name}
                    className="px-4 flex items-center gap-1 whitespace-nowrap py-1.5 w-full"
                  >
                    {e.flag}
                    <span>
                      {e.name} {e.currencySymbol}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(LocalBar);
