import React, { useState, useEffect } from "react";
import {
  IkasBaseStore,
  IkasOrderLineItem,
  Image,
  Link,
  formatCurrency,
  useStore,
  useTranslation,
} from "@ikas/storefront";
import { observer } from "mobx-react-lite";
import { Transition } from "@headlessui/react";
import { useOnClickOutside } from "usehooks-ts";
import { maxQuantityPerCartHandler } from "../../utils/useAddToCart";
import { useDirection } from "../../utils/useDirection";
import { toast } from "react-hot-toast";
import { listCountry, listShippingSettings } from "../../utils/shippingDatas";
import Pricedisplay from "./pricedisplay";
import useConvertedPrice from "../../utils/useConvertedPrice";
const BagItem: React.FC<{
  product: IkasOrderLineItem;
  pending: boolean;
  store: IkasBaseStore;
  handleQuantityChange: (
    value: number,
    item: IkasOrderLineItem
  ) => Promise<boolean>;
}> = ({ product, store, pending, handleQuantityChange }) => {
  const [quantity, setQuantity] = useState(product.quantity);
  return (
    <div className="grid relative group gap-3 py-5 grid-cols-[90px_1fr] w-full">
      <Link href={product.variant.href || ""}>
        <a className="p-2 rounded-sm overflow-hidden aspect-293/372 max-w-[90px] w-full border border-[color:var(--gray-two)]">
          <div className="relative h-full w-full">
            <Image
              alt={product.variant.mainImage?.altText || ""}
              useBlur
              image={product.variant.mainImage!}
              layout="fill"
              objectFit="contain"
            />
          </div>
        </a>
      </Link>
      <div className="flex rtl:pl-6 ltr:pr-6 relative flex-col">
        <button
          onClick={() => {
            store.cartStore.removeItem(product);
          }}
          className="items-center absolute rtl:left-0 ltr:right-0 top-0  flex justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="mb-2">
          <Link href={product.variant.href || ""}>
            <a className="flex flex-col line-clamp-2 text-[color:var(--black-two)]">
              {product.variant.name}
            </a>
          </Link>
          <span className="text-sm text-[color:var(--color-three)]">
            {product.variant.variantValues
              ?.map((e) => e.variantValueName)
              .join(", ")}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 items-end justify-between mt-auto text-[color:var(--black-two)]">
          <div className="flex items-start justify-center flex-col">
            {!!product.discountPrice && (
              <span className="text-sm w-min whitespace-nowrap leading-none opacity-80 relative">
                <span className="absolute rotate-6 w-full opacity-70 h-[2px] bg-[color:var(--color-three)] left-0 top-1/2 transform -translate-y-1/2" />
                <Pricedisplay
                  center={false}
                  amount={product.overridenPriceWithQuantity}
                  currencyCode={product.currencyCode || "USD"}
                  currencySymbol={product.currencySymbol || "$"}
                />
              </span>
            )}
            <span className="text-base leading-none text-[color:var(--color-four)] font-medium">
              <Pricedisplay
                center={false}
                amount={product.finalPriceWithQuantity}
                currencyCode={product.currencyCode || "USD"}
                currencySymbol={product.currencySymbol || "$"}
              />
            </span>
          </div>
          <div className="flex items-center">
            <button
              onClick={async () => {
                if (quantity - 1 > 0) {
                  const canSet = await handleQuantityChange(
                    quantity - 1,
                    product
                  );
                  if (canSet) {
                    setQuantity(quantity - 1);
                  }
                }
              }}
              disabled={quantity - 1 === 0 || pending}
              className="flex disabled:opacity-40 disabled:animate-pulse items-center justify-center w-5 h-5 rounded-sm border border-[color:var(--gray-two)]"
            >
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
                  d="M20 12H4"
                />
              </svg>
            </button>
            <div className="flex items-center justify-center w-6 h-min leading-none">
              <span>{quantity}</span>
            </div>
            <button
              disabled={pending}
              onClick={async () => {
                const canSet = await handleQuantityChange(
                  quantity + 1,
                  product
                );
                if (canSet) {
                  setQuantity(quantity + 1);
                }
              }}
              className="flex disabled:opacity-40 disabled:animate-pulse items-center justify-center w-5 h-5 rounded-sm border border-[color:var(--gray-two)]"
            >
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const BagButton: React.FC<{ className?: string }> = ({ className }) => {
  const store = useStore();
  const shippingRulesCountryIds: string[] = [];
  listShippingSettings.map((e) =>
    e.shippingZones.map((e) => shippingRulesCountryIds.push(e.countryId))
  );
  const removeDuplicates = (arr: string[]) => {
    return arr.filter((e, i) => arr.indexOf(e) === i);
  };
  const filteredlistCountry = listCountry.filter((e) =>
    removeDuplicates(shippingRulesCountryIds).includes(e.id)
  );
  const [currentCountry, setCurrentCountry] = useState<string>();
  const [freeShippingRule, setFreeShippingRule] =
    useState<typeof listShippingSettings[0]["zoneRate"]>();
  const [remaining, setRemaining] = useState<number>();
  const [currentShippingCost, setCurrentShippingCost] = useState<number>(0);
  const [openSelectCountry, setOpenSelectCountry] = useState(false);
  useEffect(() => {
    if (!currentCountry && !localStorage.getItem("iso2")) {
      setCurrentCountry(filteredlistCountry[0].iso2);
    } else if (!currentCountry && localStorage.getItem("iso2")) {
      setCurrentCountry(JSON.parse(localStorage.getItem("iso2") as string));
    }
  }, [filteredlistCountry]);
  useEffect(() => {
    setFreeShippingRule(
      listShippingSettings.find((e) =>
        e.shippingZones.some(
          (e) =>
            e.countryId ===
            filteredlistCountry.find((el) => el.iso2 === currentCountry)?.id
        )
      )?.zoneRate
    );
  }, [currentCountry]);
  useEffect(() => {
    if (freeShippingRule && store.cartStore.cart) {
      const currentShippingRule = freeShippingRule.find((e) => {
        if (e.condition.maxAmount) {
          if (
            e.condition.maxAmount >= store.cartStore.cart!.totalFinalPrice &&
            e.condition.minAmount <= store.cartStore.cart!.totalFinalPrice
          ) {
            return true;
          }
        } else if (
          e.condition.minAmount <= store.cartStore.cart!.totalFinalPrice
        ) {
          return true;
        }
        return false;
      });
      setCurrentShippingCost(currentShippingRule?.price || 0);
      const remainingObject = freeShippingRule.find((e) => e.price === 0);

      setRemaining(
        remainingObject!.condition.minAmount -
        store.cartStore.cart!.totalFinalPrice
      );
    }
  }, [freeShippingRule, store.cartStore.cart]);

  const [openBag, setOpenBag] = useState(false);
  const [code, setCode] = useState<string>(
    store.cartStore.cart?.couponCode || ""
  );
  useEffect(() => {
    if (store.cartStore.cart?.couponCode) {
      setCode(store.cartStore.cart?.couponCode);
    }
  }, [store.cartStore.cart]);
  const [codePending, setCodePending] = useState<boolean>(false);
  const { t } = useTranslation();
  const childRef = React.useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);
  useOnClickOutside(childRef, () => {
    setOpenBag(false);
    document.body.classList.remove("overflow-hidden");
  });
  const handleQuantityChange = async (
    value: number,
    item: IkasOrderLineItem
  ) => {
    setPending(true);
    const result = await store.cartStore.changeItemQuantity(item, value);
    setPending(false);
    if (result.response?.graphQLErrors) {
      maxQuantityPerCartHandler({
        productName: item.variant.name,
        errors: result.response?.graphQLErrors,
        message: t("maxQuantityPerCartError"),
      });
      return false;
    }
    return true;
  };
  const { direction } = useDirection();
  const { formatPrice } = useConvertedPrice();
  return (
    <>
      <div
        dir={direction}
        onClick={() => {
          setOpenBag(true);
          document.body.classList.add("overflow-hidden");
        }}
        className={`flex h-full items-center justify-center relative ${className || ""
          }`}
      >
        <button className="flex pb-[5px] relative items-center justify-center cursor-pointer">
          <svg
            width="22"
            height="24"
            viewBox="0 0 22 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.2449 10.3077V5.23077C15.2449 4.1087 14.7992 3.03259 14.0058 2.23916C13.2124 1.44574 12.1362 1 11.0142 1C9.89211 1 8.816 1.44574 8.02257 2.23916C7.22915 3.03259 6.78341 4.1087 6.78341 5.23077V10.3077M19.5953 8.05918L21.0202 21.5976C21.0992 22.3479 20.5125 23 19.7578 23H2.27059C2.09257 23.0002 1.9165 22.9629 1.75381 22.8906C1.59113 22.8183 1.44548 22.7126 1.32631 22.5804C1.20714 22.4481 1.11713 22.2923 1.06212 22.123C1.00711 21.9537 0.988329 21.7747 1.007 21.5976L2.43305 8.05918C2.46595 7.7473 2.61314 7.45864 2.84626 7.24885C3.07937 7.03907 3.3819 6.92302 3.69551 6.92308H18.3328C18.9827 6.92308 19.5276 7.41385 19.5953 8.05918ZM7.20649 10.3077C7.20649 10.4199 7.16191 10.5275 7.08257 10.6069C7.00323 10.6862 6.89562 10.7308 6.78341 10.7308C6.6712 10.7308 6.56359 10.6862 6.48425 10.6069C6.40491 10.5275 6.36033 10.4199 6.36033 10.3077C6.36033 10.1955 6.40491 10.0879 6.48425 10.0085C6.56359 9.92919 6.6712 9.88462 6.78341 9.88462C6.89562 9.88462 7.00323 9.92919 7.08257 10.0085C7.16191 10.0879 7.20649 10.1955 7.20649 10.3077V10.3077ZM15.668 10.3077C15.668 10.4199 15.6235 10.5275 15.5441 10.6069C15.4648 10.6862 15.3572 10.7308 15.2449 10.7308C15.1327 10.7308 15.0251 10.6862 14.9458 10.6069C14.8664 10.5275 14.8219 10.4199 14.8219 10.3077C14.8219 10.1955 14.8664 10.0879 14.9458 10.0085C15.0251 9.92919 15.1327 9.88462 15.2449 9.88462C15.3572 9.88462 15.4648 9.92919 15.5441 10.0085C15.6235 10.0879 15.668 10.1955 15.668 10.3077V10.3077Z"
              stroke="#212121"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="absolute -bottom-[3px] leading-none -right-2 bg-[color:var(--color-one)] text-white text-[9px] rounded-full w-[17px] h-[17px] flex items-center justify-center">
            {store?.cartStore?.cart?.itemCount || 0}
          </span>
        </button>
      </div>
      <Transition
        className="fixed bg-black/50 overflow-hidden z-99 inset-0"
        as="div"
        show={openBag}
      >
        <Transition.Child
          enter="transition-transform duration-200"
          enterFrom="rtl:translate-x-[-100%] ltr:translate-x-[100%]"
          enterTo="translate-x-[0px]"
          leave="transition-transform duration-200"
          leaveFrom="translate-x-[0px]"
          ref={childRef}
          leaveTo="rtl:translate-x-[-100%] ltr:translate-x-[100%]"
          as="div"
          className="w-full flex flex-col shadow-navbar max-w-md rtl:left-0 ltr:right-0 absolute overflow-y-auto bg-[color:var(--bg-color)] h-full"
        >
          <div className="z-20 border-b border-[color:var(--gray-two)] px-3 sm:px-5 py-4 sticky top-0 left-0 bg-[color:var(--bg-color)]">
            <div className="flex justify-between items-center">
              <Link href="/">
                <a className="flex leading-none pt-[2px] font-light text-[color:var(--black-two)] text-lg items-center justify-start">
                  <span>{t("bag")}</span>
                </a>
              </Link>
              <button
                onClick={(e) => {
                  setOpenBag(false);
                  document.body.classList.remove("overflow-hidden");
                }}
                className="flex items-center cursor-pointer justify-center -mr-[3px] w-6 h-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          {store?.cartStore?.cart?.itemCount &&
            store?.cartStore?.cart?.itemCount > 0 &&
            remaining !== undefined && (
              <div className="sticky pb-4 shadow-lg shadow-black/5 top-[57px] bg-white z-20 left-0">
                <div className="flex flex-col px-3 sm:px-5 items-center justify-center w-full">
                  <span className="flex w-full items-center justify-center text-center pt-4 pb-2 text-[color:var(--black-two)] text-lg font-light">
                    {remaining < 0
                      ? t("reachedFreeShipping")
                      : t("forFreeShipping", {
                        amount: formatPrice(remaining)
                      })}
                  </span>
                  <div className="w-full h-1.5 rounded-sm overflow-hidden bg-gray-200">
                    <div
                      style={{
                        width: `${(store.cartStore.cart?.totalPrice! /
                          (remaining + store.cartStore.cart?.totalPrice!)) *
                          100
                          }%`,
                      }}
                      className="h-1.5 rounded-sm overflow-hidden bg-[color:var(--color-one)]"
                    />
                  </div>
                </div>
              </div>
            )}
          {store?.cartStore?.cart?.itemCount &&
            store?.cartStore?.cart?.itemCount > 0 ? (
            <div className="grid divide-y px-3 sm:px-5 divide-[color:var(--gray-two)] grid-cols-1">
              {store.cartStore.cart?.items.map((product) => (
                <BagItem
                  store={store}
                  product={product}
                  key={product.id}
                  pending={pending}
                  handleQuantityChange={handleQuantityChange}
                />
              ))}
            </div>
          ) : (
            <div className="text-center px-3 sm:px-5 flex flex-col justify-center h-full items-center pb-20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-32 mb-2 h-32"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>

              <span className="text-lg font-light text-[color:var(--black-two)]">
                {t("bagEmpty")}
              </span>
              <button
                onClick={() => {
                  setOpenBag(false);
                }}
                className="mt-2 px-4 py-2 bg-[color:var(--color-one)] text-white rounded-sm cursor-pointer"
              >
                {t("bagEmptyButton")}
              </button>
            </div>
          )}

          {store?.cartStore?.cart?.itemCount &&
            store?.cartStore?.cart?.itemCount > 0 && (
              <div className="bg-[color:var(--gray-four)] p-5 mt-auto border-t border-[color:var(--gray-five)] sticky bottom-0 left-0">
                <div className="flex flex-col items-center justify-center">
                  <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between w-full">
                      <button
                        onClick={() => {
                          setOpenSelectCountry(!openSelectCountry);
                        }}
                        className="text-[color:var(--black-two)] gap-1 flex items-center font-light"
                      >
                        {t("orderDetail.shipping")}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.4}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                        <span className="text-sm opacity-60">
                          ({currentCountry})
                        </span>
                      </button>
                      <span className="text-[color:var(--black-two)] font-light">
                        {currentShippingCost === 0 ? (
                          t("freeShipping")
                        ) : (
                          <Pricedisplay
                            amount={currentShippingCost}
                            center={false}
                            left
                            currencyCode={
                              store.cartStore.cart.currencyCode || "USD"
                            }
                            currencySymbol={
                              store.cartStore.cart.currencySymbol || "$"
                            }
                          />
                        )}
                      </span>
                    </div>
                    {openSelectCountry && (
                      <div className="mt-1 mb-2">
                        <select
                          value={currentCountry}
                          className="w-full text-sm border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative font-light border rounded-sm px-2.5"
                          onChange={(e) => {
                            localStorage.setItem(
                              "iso2",
                              JSON.stringify(e.target.value)
                            );
                            setCurrentCountry(e.target.value);
                          }}
                        >
                          {filteredlistCountry.map((country) => (
                            <option value={country.iso2} key={country.iso2}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[color:var(--black-two)] font-light">
                      {t("orderDetail.subtotal")}
                    </span>
                    <span className="text-[color:var(--black-two)] font-light">
                      <Pricedisplay
                        center={false}
                        left
                        amount={store.cartStore.cart.totalPrice}
                        currencyCode={
                          store.cartStore.cart.currencyCode || "USD"
                        }
                        currencySymbol={
                          store.cartStore.cart.currencySymbol || "$"
                        }
                      />
                    </span>
                  </div>
                  <div className="flex font-normal items-center justify-between w-full">
                    <span className="text-[color:var(--black-two)]">
                      {t("total")}
                    </span>
                    <span className="text-[color:var(--black-two)]">
                      {currentShippingCost ? (
                        <Pricedisplay
                          left
                          center={false}
                          amount={
                            store.cartStore.cart.totalFinalPrice +
                            currentShippingCost
                          }
                          currencyCode={
                            store.cartStore.cart.currencyCode || "USD"
                          }
                          currencySymbol={
                            store.cartStore.cart.currencySymbol || "$"
                          }
                        />
                      ) : (
                        <Pricedisplay
                          left
                          center={false}
                          amount={store.cartStore.cart.totalFinalPrice}
                          currencyCode={
                            store.cartStore.cart.currencyCode || "USD"
                          }
                          currencySymbol={
                            store.cartStore.cart.currencySymbol || "$"
                          }
                        />
                      )}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setOpenBag(false);
                      document.body.classList.remove("overflow-hidden");
                    }}
                    className="mt-2 flex items-center justify-center w-full px-4 py-2 bg-[color:var(--color-three)] text-white rounded-sm"
                  >
                    {t("continueShopping")}
                  </button>
                  <div className="flex mt-2 gap-1.5 items-center w-full">
                    <input
                      placeholder={t("couponCode")}
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                      }}
                      type="text"
                      className={`w-full border-[color:var(--input-color)] focus:border-[color:var(--input-color)] focus:ring-transparent bg-[color:var(--tx-bg)] text-base font-light h-[38px] border-[1px] rounded-sm px-2.5`}
                    />
                    {/* {store.localeOptions.map((e) => e.countryName)} */}
                    {!!store.cartStore.cart?.couponCode ? (
                      <button
                        onClick={async () => {
                          setCodePending(true);
                          const res = await store.cartStore.removeCouponCode();
                          if (
                            res?.response?.errors?.length &&
                            res?.response?.errors?.length > 0
                          ) {
                            toast.error(t("errorActionMessage"));
                          } else {
                            toast.success(t("successActionMessage"));
                          }
                          setCode("");
                          setCodePending(false);
                        }}
                        className="w-min disabled:opacity-60 flex items-center justify-center px-4 h-[38px] text-base bg-[color:var(--color-three)] text-white rounded-sm"
                      >
                        {t("remove")}
                      </button>
                    ) : (
                      <button
                        disabled={
                          (code.length < 1 ? true : false) ||
                          codePending ||
                          !!store.cartStore.cart?.couponCode
                        }
                        onClick={async () => {
                          setCodePending(true);
                          const res = await store.cartStore.saveCouponCode(
                            code
                          );
                          if (
                            res?.response?.errors?.length &&
                            res?.response?.errors?.length > 0
                          ) {
                            toast.error(t("couponCodeInvalid"));
                          } else {
                            toast.success(t("couponCodeApplied"));
                          }
                          setCodePending(false);
                        }}
                        className="w-min disabled:opacity-60 flex items-center justify-center px-4 h-[38px] text-base bg-[color:var(--color-three)] text-white rounded-sm"
                      >
                        {t("save")}
                      </button>
                    )}
                  </div>
                  <Link href="/cart">
                    <a
                      onClick={() => {
                        setOpenBag(false);
                        document.body.classList.remove("overflow-hidden");
                      }}
                      className="mt-2 flex items-center justify-center w-full px-4 py-2 bg-[color:var(--color-one)] text-white rounded-sm"
                    >
                      {t("checkout")}
                    </a>
                  </Link>
                </div>
              </div>
            )}
        </Transition.Child>
      </Transition>
    </>
  );
};

export default observer(BagButton);
