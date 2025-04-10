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
import { maxQuantityPerCartHandler } from "../../utils/useAddToCart";
import { useDirection } from "../../utils/useDirection";
import { CartProps } from "../__generated__/types";
import Simpleslider from "../composites/simpleslider";
import Productcard from "../composites/productcard";
import { toast } from "react-hot-toast";
import { listCountry, listShippingSettings } from "../../utils/shippingDatas";
import Pricedisplay from "../composites/pricedisplay";

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
  useEffect(() => {
    setQuantity(product.quantity);
  }, [product.quantity]);
  return (
    <div className="grid relative group gap-3 py-5 grid-cols-[20px_100px_1fr] md:grid-cols-[20px_100px_1fr_304px] w-full">
      <button
        onClick={() => {
          store.cartStore.removeItem(product);
        }}
        className="items-center flex justify-center"
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
      <Link href={product.variant.href || ""}>
        <a className="p-2 rounded-sm overflow-hidden aspect-293/372 max-w-[100px] w-full border border-[color:var(--gray-one)]">
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
      <div>
        <Link href={product.variant.href || ""}>
          <a className="flex flex-col lg:text-xl text-[color:var(--black-two)]">
            {product.variant.name}
          </a>
        </Link>
        <span className="text-sm text-[color:var(--color-three)]">
          {product.variant.variantValues
            ?.map((e) => e.variantValueName)
            .join(", ")}
        </span>
      </div>
      <div className="grid-cols-2 md:grid-cols-[82px_210px] md:col-span-1 col-span-3 md:items-start items-center grid gap-3">
        <div className="flex md:justify-end items-start">
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
              className="flex disabled:opacity-40 disabled:animate-pulse items-center justify-center w-6 h-6 rounded-full border border-[color:var(--gray-two)]"
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
            <div className="flex items-center justify-center w-6 h-6">
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
              className="flex disabled:opacity-40 disabled:animate-pulse items-center justify-center w-6 h-6 rounded-full border border-[color:var(--gray-two)]"
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
        <div className="flex items-end flex-col text-[color:var(--black-two)]">
          {!!product.discountPrice && (
            <span className="text-lg w-min whitespace-nowrap leading-none opacity-80 relative">
              <span className="absolute rotate-6 w-full opacity-70 h-[2px] bg-[color:var(--color-three)] left-0 top-1/2 transform -translate-y-1/2" />
              <Pricedisplay
                amount={product.overridenPriceWithQuantity}
                currencyCode={product.currencyCode || "USD"}
                currencySymbol={product.currencySymbol || "$"}
                center={false}
                left={false}
              />
            </span>
          )}
          <span className="text-xl leading-none text-[color:var(--color-four)] font-medium">
            <Pricedisplay
              amount={product.finalPriceWithQuantity}
              currencyCode={product.currencyCode || "USD"}
              currencySymbol={product.currencySymbol || "$"}
              center={false}
              left={false}
            />
          </span>
        </div>
      </div>
    </div>
  );
};


const Cart = observer(({ relatedProducts }: CartProps) => {
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
  const [currentShippingCost, setCurrentShippingCost] = useState<number>(0);
  const [openSelectCountry, setOpenSelectCountry] = useState(false);
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

  const { t } = useTranslation();

  const [code, setCode] = useState<string>(
    store.cartStore.cart?.couponCode || ""
  );
  useEffect(() => {
    if (store.cartStore.cart?.couponCode) {
      setCode(store.cartStore.cart?.couponCode);
    }
  }, [store.cartStore.cart]);
  const [codePending, setCodePending] = useState<boolean>(false);
  const [pending, setPending] = useState(false);
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
        <div className="grid lg:grid-cols-[calc(100%-432px)_400px] gap-8">
          {store?.cartStore?.cart?.itemCount &&
            store?.cartStore?.cart?.itemCount > 0 ? (
            <div className="grid h-min divide-y divide-[color:var(--gray-one)] grid-cols-1">
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
                    <div className="flex items-center justify-between w-full">
                      <button
                        onClick={() => {
                          setOpenSelectCountry(!openSelectCountry);
                        }}
                        className="text-[color:var(--black-two)] gap-1 flex text-lg items-center font-light"
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
                      <span className="text-[color:var(--black-two)] text-lg font-light">

                        {/* Shipping Cost */}
                        {currentShippingCost === 0 ? (
                          t("freeShipping")
                        ) : (
                          <Pricedisplay
                            amount={currentShippingCost}
                            currencyCode={store.cartStore.cart.currencyCode || "USD"}
                            currencySymbol={store.cartStore.cart.currencySymbol || "$"}
                            center={false}
                            left
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
                    <span className="text-[color:var(--black-two)] text-lg font-light">
                      {t("orderDetail.tax")}
                    </span>
                    <span className="text-[color:var(--black-two)] text-lg font-light">
                      {/* Tax */}
                      <Pricedisplay
                        amount={store.cartStore.cart.totalTax}
                        currencyCode={store.cartStore.cart.currencyCode || "USD"}
                        currencySymbol={store.cartStore.cart.currencySymbol || "$"}
                        center={false}
                        left
                      />
                    </span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[color:var(--black-two)] text-lg font-light">
                      {t("orderDetail.subtotal")}
                    </span>
                    <span className="text-[color:var(--black-two)] text-lg font-light">
                      {/* Subtotal */}
                      <Pricedisplay
                        amount={store.cartStore.cart.totalPrice}
                        currencyCode={store.cartStore.cart.currencyCode || "USD"}
                        currencySymbol={store.cartStore.cart.currencySymbol || "$"}
                        center={false}
                        left
                      />
                    </span>
                  </div>

                  {/* Discount */}
                  {!!store.cartStore.cart?.couponCode && (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[color:var(--black-two)] text-lg font-light">
                        {t("discountTotal")}
                      </span>
                      <span className="text-[color:var(--black-two)] text-lg font-light">
                        <Pricedisplay
                          amount={store.cartStore.cart.totalPrice - store.cartStore.cart.totalFinalPrice}
                          currencyCode={store.cartStore.cart.currencyCode || "USD"}
                          currencySymbol={store.cartStore.cart.currencySymbol || "$"}
                          center={false}
                          left
                        />
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[color:var(--black-two)] text-lg font-normal">
                      {t("total")}
                    </span>
                    <span className="text-[color:var(--black-two)] text-lg font-normal">

                      {/* Total Cost */}
                      {currentShippingCost ? (
                        <>
                          <Pricedisplay
                            amount={store.cartStore.cart.totalFinalPrice + currentShippingCost}
                            currencyCode={store.cartStore.cart.currencyCode || "USD"}
                            currencySymbol={store.cartStore.cart.currencySymbol || "$"}
                            center={false}
                            left
                          />
                        </>
                      ) : (
                        <Pricedisplay
                          amount={store.cartStore.cart.totalFinalPrice}
                          currencyCode={store.cartStore.cart.currencyCode || "USD"}
                          currencySymbol={store.cartStore.cart.currencySymbol || "$"}
                          center={false}
                          left
                        />
                      )}
                    </span>
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
