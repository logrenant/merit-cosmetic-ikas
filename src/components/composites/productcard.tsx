import React, { useMemo } from "react";
import {
  IkasProduct,
  Image,
  Link,
  useStore,
  useTranslation,
} from "@ikas/storefront";
import { observer } from "mobx-react-lite";
import { useAddToCart } from "../../utils/useAddToCart";
import useFavorite from "../../utils/useFavorite";
import { useDirection } from "../../utils/useDirection";
import Pricedisplay from "./pricedisplay";
import Envelope from "../svg/Envelope";

const ProductCard: React.FC<{
  product: IkasProduct;
  onToggle?: (isProductFavorite: boolean) => void;
  soldOutButtonText?: string;
}> = ({ product, onToggle, soldOutButtonText }) => {
  const store = useStore();

  // Safety check for product availability
  const isProductAvailable = useMemo(() => {
    if (!product) return false;
    return product.isAddToCartEnabled === true;
  }, [product?.isAddToCartEnabled]);

  const mainImages = product?.attributes?.find(
    (e) => e.productAttribute?.name === "Ana Resim"
  )?.images;
  const showImage =
    mainImages && mainImages.length > 0
      ? mainImages[0]
      : product?.selectedVariant?.mainImage?.image!;
  const { addToCart, loading } = useAddToCart();
  const { isProductFavorite, pending, toggleFavorite } = useFavorite({
    productId: product.id,
  });
  const { direction } = useDirection();
  const { t } = useTranslation();

  return (
    <div
      dir={direction}
      className="PROD-CARD-TEST flex relative border border-transparent p-1 hover:border-[color:var(--color-three)] w-full flex-col"
    >
      <button
        disabled={pending}
        onClick={(e) => {
          toggleFavorite(e);
          if (onToggle) {
            onToggle(isProductFavorite);
          }
        }}
        className="flex disabled:opacity-60 disabled:animate-pulse items-center justify-center w-7 h-7 absolute right-1 top-1 z-20 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-7 h-7 stroke-[color:var(--color-three)] ${isProductFavorite ? "fill-[color:var(--color-three)]" : ""
            }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>
      <Link href={product.href}>
        <a className="relative aspect-293/372 w-full">
          {showImage && (
            <Image
              alt={showImage.altText || ""}
              useBlur
              image={showImage}
              layout="fill"
              objectFit="cover"
            />
          )}
          {product.hasVariant && (
            <div className="flex items-center justify-center absolute right-0 -bottom-2 z-20">
              <span className="bg-[color:var(--color-four)] -mr-0.5 w-[10px] h-[10px] rounded-full flex" />
              <span className="bg-[color:var(--color-one)] -mr-0.5 w-[10px] h-[10px] rounded-full flex" />
              <span className="bg-[color:var(--color-three)] w-[10px] h-[10px] rounded-full flex" />
            </div>
          )}
        </a>
      </Link>
      <div className="mt-3 items-center flex flex-col text-[color:var(--black-two)]">
        <Link href={product.href}>
          <a className="flex flex-col items-center">
            <h3
              className={`text-lg ${!product.selectedVariant.price.hasDiscount
                ? "line-clamp-3 h-[84px]"
                : "h-[56px] line-clamp-2 "
                } text-center cursor-pointer`}
            >
              {product.name}
            </h3>

            {!!product.selectedVariant.price.hasDiscount && (
              <span className="text-sm min-h-[28px] flex items-end opacity-80 mt-2.5 relative">
                <span className="absolute rotate-3 w-full opacity-70 h-[2px] bg-[color:var(--color-three)] left-0 top-[16px] transform" />
                <Pricedisplay
                  amount={product.selectedVariant.price.sellPrice}
                  center={true}
                  currencyCode={product.selectedVariant.price.currency || "USD"}
                  currencySymbol={
                    product.selectedVariant.price.currencySymbol || "$"
                  }
                />
              </span>
            )}

            <span
              className={`text-lg md:text-xl font-medium ${!product.selectedVariant.price.hasDiscount ? "mt-2.5" : ""
                }`}
            >
              <Pricedisplay
                amount={product.selectedVariant.price.finalPrice}
                center={true}
                currencyCode={product.selectedVariant.price.currency || "USD"}
                currencySymbol={
                  product.selectedVariant.price.currencySymbol || "$"
                }
              />
            </span>
          </a>
        </Link>
        <button
          onClick={() => {
            if (product.hasVariant) {
              store.router?.push(product.href);
            } else {
              addToCart(product, 1);
            }
          }}
          className="mt-2.5 hover:opacity-80 transition duration-300 tracking-wide w-full bg-[color:var(--color-three)] text-sm md:text-base font-medium text-white rounded-sm py-2.5 px-5 cursor-pointer"
        >
          <div className="flex items-center justify-center gap-2">
            {!isProductAvailable && <Envelope />}
            <span>{isProductAvailable ? t("addToBasket") : (soldOutButtonText)}</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default observer(ProductCard);
