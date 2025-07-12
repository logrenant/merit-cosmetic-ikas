import * as React from "react";
import { AppProps } from "next/app";
import { IkasStorefrontConfig } from "@ikas/storefront-config";
import { Router } from "next/router";
import NProgress from "nprogress";
import Config from "config.json";

import "src/styles/global.css";
import { Toaster } from "react-hot-toast";
import UIStore from "../store/ui-store";
import { useStore } from "@ikas/storefront";
import usePurchasedProductsLoader from "../utils/usePurchasedProductsLoader";

import TawkProvider from "../components/TawkProvider";
import ChatButton from "../components/ChatButton";
import { FilterProvider } from "../components/composites/FilterContext";

IkasStorefrontConfig.init({
  ...Config,
  apiUrl: process.env.NEXT_PUBLIC_GQL_URL,
  cdnUrl: process.env.NEXT_PUBLIC_CDN_URL,
});

const IkasThemeApp: React.FC<AppProps> = (props) => {
  const { Component, pageProps } = props;
  const store = useStore();
  const uiStore = UIStore.getInstance();

  // Login durumunu izle ve satın alınan ürünleri yükle
  usePurchasedProductsLoader();

  React.useEffect(() => {
    if (store.router) {
      if (store.router.locale === "ar") {
        uiStore.direction = "rtl";
      } else {
        uiStore.direction = "ltr";
      }
    } else {
      uiStore.direction = "ltr";
    }
  }, [store?.router?.locale]);
  React.useEffect(() => {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    Router.events.on("routeChangeStart", handleRouteStart);
    Router.events.on("routeChangeComplete", handleRouteDone);
    Router.events.on("routeChangeError", handleRouteDone);

    return () => {
      // Make sure to remove the event handler on unmount!
      Router.events.off("routeChangeStart", handleRouteStart);
      Router.events.off("routeChangeComplete", handleRouteDone);
      Router.events.off("routeChangeError", handleRouteDone);
    };
  }, []);
  return (
    <FilterProvider>
      <TawkProvider />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontSize: "18px",
          },
          duration: 3500,
        }}
      />
      <Component {...pageProps} />
      <ChatButton />
    </FilterProvider>
  );
};

export default IkasThemeApp;
