import {
  IkasBaseStore,
  IkasOrderLineItem,
  Image,
  Link,
  useStore,
  useTranslation,
} from "@ikas/storefront";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { useDirection } from "../../utils/useDirection";
import { CartProps } from "../__generated__/types";
import Simpleslider from "../composites/simpleslider";
import Productcard from "../composites/productcard";
import { toast } from "react-hot-toast";
import { listCountry, listShippingSettings } from "../../utils/shippingDatas";
import Pricedisplay from "../composites/pricedisplay";
import Item from "./item";

const Items = observer(() => {
  const store = useStore();
  return (
    <div className="grid h-min divide-y divide-[color:var(--gray-one)] grid-cols-1">
      {store.cartStore.cart?.items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  );
});


const Cart = observer(({ relatedProducts }: CartProps) => {
  const store = useStore();
  const { t } = useTranslation();
  const { direction } = useDirection();

  const [code, setCode] = useState<string>(
    store.cartStore.cart?.couponCode || ""
  );
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
  const [currentShippingCost, setCurrentShippingCost] = useState<number>(0);
  const [openSelectCountry, setOpenSelectCountry] = useState(false);
  const [codePending, setCodePending] = useState<boolean>(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!currentCountry && !localStorage.getItem("iso2")) {
      setCurrentCountry(filteredlistCountry[0].iso2);
    } else if (!currentCountry && localStorage.getItem("iso2")) {
      setCurrentCountry(JSON.parse(localStorage.getItem("iso2") as string));
    }
  }, []);
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
    }
  }, [freeShippingRule, store.cartStore.cart]);

  useEffect(() => {
    if (store.cartStore.cart?.couponCode) {
      setCode(store.cartStore.cart?.couponCode);
    }
  }, [store.cartStore.cart]);

  return (
    <>
      <div dir={direction} className="w-full my-10 layout flex flex-col h-full">
        {store?.cartStore?.cart?.itemCount &&
          store?.cartStore?.cart?.itemCount > 0 && (
            <h1 className="mb-8 leading-none font-light text-[color:var(--black-two)] text-xl lg:text-2xl">
              <span>{t("bag")}</span>
              <span className="ml-1.5">
                ({store?.cartStore?.cart?.itemCount || 0} {t("product")})
              </span>
            </h1>
          )}
        <div className="grid xl:grid-cols-[calc(100%-432px)_400px] gap-8">
          {store?.cartStore?.cart?.itemCount &&
            store?.cartStore?.cart?.itemCount > 0 ? (
            <Items />
          ) : (
            <div className="text-center lg:col-span-2 px-5 flex flex-col justify-center h-full items-center py-20">
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
              <Link href="/">
                <a className="mt-2 px-4 py-2 bg-[color:var(--color-one)] text-white rounded-sm">
                  {t("bagEmptyButton")}
                </a>
              </Link>
            </div>
          )}
          {store?.cartStore?.cart?.itemCount &&
            store?.cartStore?.cart?.itemCount > 0 && (
              <div className="border border-[color:var(--gray-five)] h-min p-5 rounded-sm sticky top-8 left-0">
                <h2 className="text-lg font-normal border-b border-[color:var(--gray-five)] text-[color:var(--black-two)] pb-3 mb-4">
                  {t("cartTotals")}
                </h2>
                <div className="flex gap-y-2 flex-col items-center justify-center">
                  <div className="flex flex-col w-full">
                    <div className="flex items-center w-full text-lg">
                      <button
                        onClick={() => {
                          setOpenSelectCountry(!openSelectCountry);
                        }}
                        className="text-[color:var(--black-two)] gap-1 flex text-lg items-center font-light cursor-pointer min-w-[60%] max-w-[60%]"
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

                      {/* Shipping Cost */}
                      {currentShippingCost === 0 ? (
                        t("freeShipping")
                      ) : (
                        <Pricedisplay
                          amount={currentShippingCost}
                          currencyCode={store.cartStore.cart.currencyCode || "USD"}
                          currencySymbol={store.cartStore.cart.currencySymbol || "$"}
                          center={false}
                          isTable={true}
                          containerClassName="text-[color:var(--black-two)] font-light"
                        />
                      )}
                    </div>
                    {openSelectCountry && (
                      <div className="mt-1 mb-2">
                        <select
                          value={currentCountry}
                          className="w-full text-sm border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative font-light border rounded-sm px-2.5 cursor-pointer"
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

                  <div className="flex items-center w-full text-lg">
                    <span className="text-[color:var(--black-two)] font-light min-w-[60%] max-w-[60%]">
                      {t("orderDetail.tax")}
                    </span>
                    {/* Tax */}
                    <Pricedisplay
                      amount={store.cartStore.cart.totalTax}
                      currencyCode={store.cartStore.cart.currencyCode || "USD"}
                      currencySymbol={store.cartStore.cart.currencySymbol || "$"}
                      center={false}
                      isTable={true}
                      containerClassName="text-[color:var(--black-two)] font-light"
                    />
                  </div>
                  <div className="flex items-center w-full text-lg">
                    <div className="text-[color:var(--black-two)] font-light min-w-[60%] max-w-[60%]">
                      {t("orderDetail.subtotal")}
                    </div>
                    {/* Subtotal */}
                    <Pricedisplay
                      center={false}
                      isTable={true}
                      containerClassName="text-[color:var(--black-two)] font-light"
                      amount={store.cartStore.cart.totalPrice}
                      currencyCode={
                        store.cartStore.cart.currencyCode || "USD"
                      }
                      currencySymbol={
                        store.cartStore.cart.currencySymbol || "$"
                      }
                    />
                  </div>

                  {/* Discount */}
                  {!!store.cartStore.cart?.couponCode && (
                    <div className="flex items-center w-full text-lg">
                      <span className="text-[color:var(--black-two)] font-light min-w-[60%] max-w-[60%]">
                        {t("discountTotal")}
                      </span>
                      <Pricedisplay
                        amount={store.cartStore.cart.totalPrice - store.cartStore.cart.totalFinalPrice}
                        currencyCode={store.cartStore.cart.currencyCode || "USD"}
                        currencySymbol={store.cartStore.cart.currencySymbol || "$"}
                        center={false}
                        isTable={true}
                        containerClassName="text-[color:var(--black-two)] font-light"
                      />

                    </div>
                  )}
                  <div className="flex items-center w-full text-lg">
                    <div className="text-[color:var(--black-two)] font-light min-w-[60%] max-w-[60%]">
                      {t("total")}
                    </div>

                    {/* Total Cost */}
                    {currentShippingCost ? (
                      <>
                        <Pricedisplay
                          amount={store.cartStore.cart.totalFinalPrice + currentShippingCost}
                          currencyCode={store.cartStore.cart.currencyCode || "USD"}
                          currencySymbol={store.cartStore.cart.currencySymbol || "$"}
                          center={false}
                          isTable={true}
                          containerClassName="text-[color:var(--black-two)] font-light"
                        />
                      </>
                    ) : (
                      <Pricedisplay
                        amount={store.cartStore.cart.totalFinalPrice}
                        currencyCode={store.cartStore.cart.currencyCode || "USD"}
                        currencySymbol={store.cartStore.cart.currencySymbol || "$"}
                        center={false}
                        isTable={true}
                        containerClassName="text-[color:var(--black-two)] font-light"
                      />
                    )}
                  </div>
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
                          setCodePending(false);
                          setCode("");
                        }}
                        className="w-min disabled:opacity-60 flex items-center justify-center px-4 h-[38px] text-base bg-[color:var(--color-three)] text-white rounded-sm cursor-pointer"
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
                        className="w-min disabled:opacity-60 flex items-center justify-center px-4 h-[38px] text-base bg-[color:var(--color-three)] text-white rounded-sm cursor-pointer"
                      >
                        {t("save")}
                      </button>
                    )}
                  </div>

                  {store?.cartStore?.checkoutUrl && (
                    <Link href="/">
                      <a className="flex mt-1 items-center justify-center w-full px-4 py-2 bg-[color:var(--color-three)] text-white rounded-sm">
                        {t("continueShopping")}
                      </a>
                    </Link>
                  )}
                  {store?.cartStore?.checkoutUrl && (
                    <Link href={store?.cartStore?.checkoutUrl}>
                      <a className="flex items-center justify-center w-full px-4 py-2 bg-[color:var(--color-one)] text-white rounded-sm">
                        {t("checkout")}
                      </a>
                    </Link>
                  )}
                </div>
              </div>
            )}
        </div>


        <div className="text-xl font-medium my-14 text-center tracking-widest">
          {t("productDetail.relatedProducts")}
        </div>
        <div dir="ltr" className="w-full">
          <Simpleslider
            keenOptions={{
              initial: 0,
              slides: {
                perView: 2,
                spacing: 4,
              },
              breakpoints: {
                "(min-width: 768px)": {
                  slides: { perView: 3, spacing: 8 },
                },
                "(min-width: 1024px)": {
                  slides: {
                    perView: 5,
                    spacing: 8,
                  },
                },
              },
            }}
            items={relatedProducts.data?.map((product) => (
              <div key={product.id} className="keen-slider__slide">
                <Productcard product={product} />
              </div>
            ))}
          />
        </div>
      </div>
    </>
  );
});

export default Cart;
