import {
  IkasCustomerReviewList,
  IkasImage,
  IkasProduct,
  Image,
  Link,
  formatDate,
  useStore,
  useTranslation,
} from "@ikas/storefront";
import React from "react";
import { useUserLocation } from 'src/utils/useUserLocation';
import { observer } from "mobx-react-lite";
import { useState, useEffect, useRef, useCallback } from "react";
import { Rating } from "react-simple-star-rating";

import useFavorite from "src/utils/useFavorite";
import Imagemodal from "../composites/imagemodal";
import { Variants } from "../composites/variants";
import ProductCard from "../composites/productcard";
import Simpleslider from "../composites/simpleslider";
import Pricedisplay from "../composites/pricedisplay";
import CommentModal from "../composites/commentModal";
import { useDirection } from "../../utils/useDirection";
import { useAddToCart } from "../../utils/useAddToCart";
import { ProductdetailProps } from "../__generated__/types";
import ContentProtector from "../composites/ContentProtector";
import useProductReviews from "src/utils/useProductReviews";
import Reviews from "./reviews";
import Envelope from "../svg/Envelope";
import { purchasedProductsStore } from "../../store/purchased-products-store";
import orders from "../composites/orders";

const Accordion = observer(
  ({ title, children }: { title: string; children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="border-b border-[color:var(--gray-six)]">
        <div
          onClick={() => setOpen(!open)}
          className="flex bg-[color:var(--gray-four)] p-4 items-center justify-between cursor-pointer"
        >
          <div className="text-[14px] uppercase font-medium">{title}</div>
          <div className="text-[color:var(--color-three)]">
            {!open ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"
                />
              </svg>
            )}
          </div>
        </div>
        {open && <div className="p-4">{children}</div>}
      </div>
    );
  }
);

const ProductDetail = ({
  product,
  similar,
  lastvisited,
  paymentText,
  returnText,
  boxdata,
  requiredInput,
  loginRequired,
  successMessage,
  errorMessage,
  soldOutButton,
  commentRules
}: ProductdetailProps) => {
  const [quantity, setQuantity] = useState(1);
  const mainImages =
    product?.attributes?.find((e) => e.productAttribute?.name === "Ana Resim")
      ?.images || [];
  const variantImages =
    (product?.selectedVariant?.images
      ?.map((e) => e.image)
      .filter((el) => el) as IkasImage[]) || [];
  const [allImages, setAllImages] = useState<IkasImage[]>([
    ...mainImages,
    ...variantImages,
  ]);
  const [selectedImage, setSelectedImage] = useState<IkasImage>(allImages[0]);
  const store = useStore();
  const isUserLoggedIn = !!store?.customerStore?.customer;

  // Debug: Ürün kontrolü için console log
  React.useEffect(() => {
    console.log('🆔 Mevcut Ürün ID:', product.id);
    console.log('📝 Mevcut Ürün Adı:', product.name);
    console.log('� Customer Debug:', {
      customer: store?.customerStore?.customer,
      hasCustomer: !!store?.customerStore?.customer,
      customerFirstName: store?.customerStore?.customer?.firstName || 'N/A'
    });
    console.log('�🔍 Ürün Detay Kontrol:', {
      productId: product.id,
      productName: product.name,
      isUserLoggedIn,
      hasPurchased: purchasedProductsStore.purchasedProductIds.has(product.id),
      totalPurchasedProducts: purchasedProductsStore.purchasedCount,
      storeLoaded: purchasedProductsStore.isLoaded,
      allPurchasedIds: Array.from(purchasedProductsStore.purchasedProductIds)
    });
  }, [product.id, isUserLoggedIn, purchasedProductsStore.isLoaded, purchasedProductsStore.purchasedCount]);
  const [modalImage, setModalImage] = useState<boolean>(false);
  const [tab, setTab] = useState<"D" | "R" | "P">("D");
  const [show, setShow] = useState(false);
  const [reviews, setReviews] = useState<IkasCustomerReviewList>();
  const [combineProducts, setCombineProducts] = useState<IkasProduct[]>([]);
  const { addToCart, loading } = useAddToCart();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const {
    customerReviewList,
    reviewsElementRef,
  } = useProductReviews({ product });


  useEffect(() => {
    const kombinUrun = product?.attributes?.find(
      (e) => e.productAttribute?.name === "Kombin Ürünler"
    );
    setCombineProducts(kombinUrun?.products || []);
  }, [product]);

  const checkScroll = useCallback(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    // Horizontal scroll kontrolü
    setCanScrollLeft(element.scrollLeft > 0);
    setCanScrollRight(
      element.scrollLeft + element.clientWidth < element.scrollWidth
    );

    setCanScrollUp(element.scrollTop > 0);
    setCanScrollDown(
      element.scrollTop + element.clientHeight < element.scrollHeight
    );
  }, []);

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    checkScroll();
    element.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      element.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scrollHorizontal = (direction: 'left' | 'right') => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const scrollAmount = element.clientWidth * 0.8;
    element.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  const scrollVertical = (direction: 'up' | 'down') => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const scrollAmount = element.clientHeight * 0.8;
    element.scrollBy({
      top: direction === 'down' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  const scrollLeft = () => scrollHorizontal('left');
  const scrollRight = () => scrollHorizontal('right');
  const scrollUp = () => scrollVertical('up');
  const scrollDown = () => scrollVertical('down');

  useEffect(() => {
    const kombinUrun = product?.attributes?.find(
      (e) => e.productAttribute?.name === "Kombin Ürünler"
    );
    if (kombinUrun && kombinUrun.products) {
      setCombineProducts(kombinUrun.products);
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      product.getCustomerReviews().then((e) => {
        setReviews(e);
      });
    }
  }, [product, product.selectedVariant]);

  useEffect(() => {
    const mainImagesUef =
      product?.attributes?.find((e) => e.productAttribute?.name === "Ana Resim")
        ?.images || [];
    const variantImagesUef =
      (product?.selectedVariant?.images
        ?.map((e) => e.image)
        .filter((el) => el) as IkasImage[]) || [];
    if (product.selectedVariant.images) {
      setSelectedImage([...mainImagesUef, ...variantImagesUef][0]);
      setAllImages([...mainImagesUef, ...variantImagesUef]);
    }
  }, [product.id]);
  useEffect(() => {
    setShow(false);
    setTimeout(() => {
      setShow(true);
    }, 200);
  }, [product]); const { direction } = useDirection();
  const { t } = useTranslation();
  const { isProductFavorite, pending, toggleFavorite } = useFavorite({
    productId: product.id,
  });
  const { isTurkishIP, shouldShowProduct, filterProductsByLocation } = useUserLocation();

  useEffect(() => {
    if (!shouldShowProduct(product)) {
    }
  }, [shouldShowProduct, product]);

  return (
    <div
      dir={direction}
      className="mb-10 mt-6 text-[color:var(--black-two)] layout grid grid-cols-[100%] lg:grid-cols-[calc(100%-292px)_260px] gap-8"
    >
      <ContentProtector />
      {allImages && modalImage && allImages.length > 0 && (
        <Imagemodal
          selectedImage={selectedImage}
          images={allImages}
          onClose={() => setModalImage(false)}
        />
      )}

      <div className="lg:col-span-2">
        {/* Breadcrumbs */}
        <ul className="flex flex-wrap gap-x-2 gap-y-0.5 text-[13px]">
          <li className="flex items-center gap-x-2">
            <Link href="/">
              <a className="text-[color:var(--color-one)]">{t("home")}</a>
            </Link>
          </li>
          {product.categories[0].categoryPathItems.map((e) => (
            <li key={e.id} className="flex items-center gap-x-2">
              <svg
                className="h-3.5 w-3.5 rtl:rotate-180 ltr:rotate-0 shrink-0 stroke-[color:var(--gray-two)]"
                viewBox="0 0 256 256"
                aria-hidden="true"
              >
                <polyline
                  points="96 48 176 128 96 208"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="24"
                />
              </svg>
              <Link href={e.href}>
                <a className="text-[color:var(--color-one)]">{e.name}</a>
              </Link>
            </li>
          ))}
          <li className="flex items-center gap-x-2">
            <svg
              className="h-3.5 w-3.5 rtl:rotate-180 ltr:rotate-0 shrink-0 stroke-[color:var(--gray-two)]"
              viewBox="0 0 256 256"
              aria-hidden="true"
            >
              <polyline
                points="96 48 176 128 96 208"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="24"
              />
            </svg>
            <Link href={product.categories[0].href}>
              <a className="text-[color:var(--color-one)]">
                {product.categories[0].name}
              </a>
            </Link>
          </li>
          <li className="flex items-center gap-x-2" aria-current="page">
            <svg
              className="h-3.5 w-3.5 rtl:rotate-180 ltr:rotate-0 shrink-0 stroke-[color:var(--gray-two)]"
              viewBox="0 0 256 256"
              aria-hidden="true"
            >
              <polyline
                points="96 48 176 128 96 208"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="24"
              />
            </svg>
            <span className="text-[color:var(--color-one)] line-clamp-1">
              {product.name}
            </span>
          </li>
        </ul>

      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-8">
          {/* Image Gallery */}
          <div className="md:block">
            <div className="flex flex-col-reverse xl:flex-row gap-4">
              <div className="relative">
                {/* all images */}
                <div
                  ref={scrollContainerRef}
                  className="overflow-x-auto xl:overflow-y-auto mt-8 xl:ml-0 ml-1"
                  style={{
                    maxWidth: "calc(5 * 82px + 4 * 16px)",
                    maxHeight: "calc(5 * 80px + 4 * 20px)",
                    scrollbarWidth: "none"
                  }}
                >
                  <div className="flex flex-row xl:flex-col gap-4">
                    {allImages.map((image) => (
                      <div
                        key={image.id + "image2"}
                        onClick={() => setSelectedImage(image)}
                        className={`cursor-pointer border min-w-[65px] lg:max-w-[80px] relative overflow-hidden ${selectedImage?.id === image?.id
                          ? "border-[color:var(--color-three)]"
                          : "border-transparent hover:border-[color:var(--gray-three)]"
                          }`}
                      >
                        <Image
                          image={image!}
                          alt={image?.altText || ""}
                          layout="responsive"
                          objectFit="cover"
                          height={372}
                          width={293}
                          useBlur
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {canScrollLeft && (
                  <button
                    onClick={scrollLeft}
                    className="inline xl:hidden absolute -left-7 top-1/2 z-10 text-[color:var(--color-two)] hover:text-[color:var(--color-four)] duration-150 cursor-pointer"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}
                {canScrollRight && (
                  <button
                    onClick={scrollRight}
                    className="inline xl:hidden absolute -right-7 top-1/2 z-10 text-[color:var(--color-two)] hover:text-[color:var(--color-four)] duration-150 cursor-pointer"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
                {canScrollUp && (
                  <button
                    onClick={scrollUp}
                    className="xl:inline absolute -top-4 left-1/2 -translate-x-1/2 z-10 text-[color:var(--color-two)] hover:text-[color:var(--color-four)] duration-150 cursor-pointer"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 15l-7-7-7 7"
                      />
                    </svg>
                  </button>
                )}
                {canScrollDown && (
                  <button
                    onClick={scrollDown}
                    className="xl:inline absolute -bottom-4 left-1/2 -translate-x-1/2 z-10 text-[color:var(--color-two)] hover:text-[color:var(--color-four)] duration-150 cursor-pointer"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 9l7 7 7-7"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* selected image */}
              <div className="flex-1" onClick={() => setModalImage(true)}>
                <div className="aspect-293/372 cursor-zoom-in relative w-full overflow-hidden bg-[color:var(--gray-bg)]/10 rounded">
                  <button
                    disabled={pending}
                    onClick={(e) => {
                      toggleFavorite(e);
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
                  {selectedImage && (
                    <Image
                      id="xx-selectedImage"
                      image={selectedImage}
                      alt={selectedImage?.altText || ""}
                      layout="responsive"
                      objectFit="contain"
                      height={372}
                      width={293}
                      useBlur
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-2xl">{product.name}</h1>
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-2">
                {!!product.selectedVariant?.price?.discountPercentage && (
                  <div className="w-14 h-14 rounded-sm text-xl flex items-center justify-center leading-none bg-[color:var(--color-two)] text-white">
                    %{product.selectedVariant?.price?.discountPercentage}
                  </div>
                )}
                <div className="flex justify-start flex-col">
                  {!!product.selectedVariant?.price?.discountPercentage && (
                    <span className="text-xl mb-1 mr-auto flex items-center justify-center whitespace-nowrap leading-none opacity-80 relative">
                      <span className="absolute rotate-3 w-full opacity-70 h-[2px] bg-[color:var(--color-three)] left-0 top-1/2 transform -translate-y-1/2" />
                      <Pricedisplay
                        center={false}
                        amount={product.selectedVariant.price.sellPrice}
                        currencyCode={
                          product.selectedVariant.price.currency || "USD"
                        }
                        currencySymbol={
                          product.selectedVariant.price.currencySymbol || "$"
                        }
                      />
                    </span>
                  )}
                  <span className="text-2xl leading-none text-[color:var(--color-four)] font-medium">
                    <Pricedisplay
                      amount={product.selectedVariant.price.finalPrice}
                      center={false}
                      currencyCode={
                        product.selectedVariant.price.currency || "USD"
                      }
                      currencySymbol={
                        product.selectedVariant.price.currencySymbol || "$"
                      }
                    />
                  </span>
                </div>
              </div>
              <div
                onClick={() => {
                  const element = document.getElementById("reviewsection");
                  if (element) {
                    window.scrollTo({
                      top: element.offsetTop - 20,
                      behavior: "smooth",
                    });
                  }
                }}
                className="flex cursor-pointer items-center"
              >
                <Rating
                  readonly
                  size={23}
                  SVGstyle={{ display: "inline-block" }}
                  initialValue={product.averageRating || 0}
                />
                <span className="rtl:mr-2 ltr:ml-2 flex mt-auto items-center justify-center text-sm text-[color:var(--gray-three)]">
                  ( {product.reviewCount || 0} )
                </span>
              </div>
              {product.selectedVariant.sku && (
                <span className="text-sm text-[color:var(--gray-three)]">
                  {product.selectedVariant.sku}
                </span>
              )}
              {product.attributes.find(
                (e) => e.productAttribute?.name === "Detay"
              ) && (
                  <span
                    className="prose-sm prose prose-ul:pl-0 prose-ul:list-inside marker:text-black/40"
                    dangerouslySetInnerHTML={{
                      __html: product.attributes.find(
                        (e) => e.productAttribute?.name === "Detay"
                      )!.value!,
                    }}
                  />
                )}
              {product.variants.length > 0 && (
                <div>
                  <Variants
                    onChange={() => {
                      const mainImagesUef =
                        product?.attributes?.find(
                          (e) => e.productAttribute?.name === "Ana Resim"
                        )?.images || [];
                      const variantImagesUef =
                        (product?.selectedVariant?.images
                          ?.map((e) => e.image)
                          .filter((el) => el) as IkasImage[]) || [];
                      setSelectedImage(
                        [...variantImagesUef, ...mainImagesUef][0]
                      );
                      setAllImages([...mainImagesUef, ...variantImagesUef]);
                    }}
                    product={product}
                  />
                </div>
              )}
              <div className="flex mt-4 gap-4">
                <div className="flex items-center justify-center">
                  <button
                    disabled={quantity === 1}
                    onClick={() => {
                      setQuantity((prev) => (prev - 1 > 1 ? prev - 1 : 1));
                    }}
                    className="flex hover:opacity-80 transition duration-300 disabled:pointer-events-none disabled:opacity-30 w-11 rounded-sm h-11 bg-[color:var(--color-three)] text-white items-center justify-center cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"
                      />
                    </svg>
                  </button>
                  <span className="w-11 bg-[color:var(--bg-color)] h-11 flex items-center justify-center">
                    {quantity}
                  </span>

                  <button
                    disabled={quantity === 10}
                    onClick={() => {
                      setQuantity((prev) => (prev + 1 < 11 ? prev + 1 : 10));
                    }}
                    className="flex hover:opacity-80 transition duration-300 disabled:pointer-events-none disabled:opacity-30 w-11 rounded-sm h-11 bg-[color:var(--color-three)] text-white items-center justify-center cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                      />
                    </svg>
                  </button>
                </div>

                <button
                  disabled={loading || (isTurkishIP && !product.isAddToCartEnabled)}
                  onClick={() => {
                    if (product.isAddToCartEnabled) {
                      addToCart(product, quantity);
                    } else if (!isTurkishIP) {
                      const url = window.location.pathname;
                      const segments = url.split('/');
                      const lastSegment = segments[segments.length - 1];
                      const productSlug = lastSegment || '';

                      const productNameFromUrl = productSlug
                        .replace(/-/g, ' ')
                        .replace(/\b\w/g, char => char.toUpperCase());

                      const productNameToUse = product.name || productNameFromUrl;

                      window.location.href = `/pages/back-in-stock-request?productName=${encodeURIComponent(productNameToUse)}`;
                    }
                  }}
                  className="tracking-wide hover:opacity-80 transition duration-300 disabled:pointer-events-none disabled:opacity-60 w-full bg-[color:var(--color-three)] text-sm md:text-base font-medium text-white rounded-sm py-2.5 px-5 cursor-pointer"
                >
                  {product.isAddToCartEnabled ? (
                    t("addToBasket")
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Envelope />
                      {soldOutButton}
                    </div>
                  )}
                </button>
              </div>
              {/* Box Data */}
              <div className="flex flex-col border gap-3 mt-6 border-[color:var(--gray-two)] rounded-sm px-5 py-6">
                {boxdata.items.map((e) => (
                  <div key={e.header + "head"} className="flex flex-row gap-3 flex-wrap">
                    <h2 className="font-medium w-full">{e.header}</h2>
                    {e.items.map((l) => (
                      <div
                        key={l.itemsdata.title + "title"}
                        className="flex flex-row items-center gap-1"
                      >
                        <div className="w-8 h-8 relative">
                          <Image
                            image={l.itemsdata.icon}
                            alt={l.itemsdata.icon.altText || ""}
                            layout="fill"
                            objectFit="contain"
                          />
                        </div>

                        <span className="text-sm">{l.itemsdata.title}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex border border-[color:var(--gray-two)] rounded-sm px-5 py-6 flex-col items-center">
          <h2 className="text-xl  text-[color:var(--color-three)] font-light">
            {product.brand?.name}
          </h2>
          <Link href={product.brand?.href || ""}>
            <a className="text-sm px-4 py-2.5 mt-2 text-[color:var(--color-three)] border border-[color:var(--color-three)] rounded-sm">
              {t("productDetail.allProductsInBrand")}
            </a>
          </Link>
        </div>


      </div>
      <div className="lg:col-span-2">

        {/* Combine Products */}
        {filterProductsByLocation(combineProducts || []).length > 0 && (
          <div>
            <h3 className="text-xl text-[color:var(--color-one)] font-medium">
              {t("productDetail.package")}
            </h3>
            <div className="gap-4 flex flex-col mt-4">
              {filterProductsByLocation(combineProducts || [])
                .filter((e) => !e.hasVariant)
                .filter((e) => e.hasStock)
                .map((e) => (
                  <div
                    key={e.id + "combine"}
                    className="flex md:flex-row flex-col border border-[color:var(--gray-six)]"
                  >
                    <div className="grid gap-4 w-full max-w-[550px] md:gap-8 p-6 grid-cols-[1fr_60px_1fr]">
                      <div className="flex border border-transparent w-full flex-col">
                        <div className="relative rounded-sm aspect-293/372 w-full overflow-hidden">
                          <Image
                            image={allImages[0]}
                            alt={allImages[0]?.altText || ""}
                            useBlur
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div className="mt-3 items-center flex flex-col text-[color:var(--black-two)]">
                          <div className="flex flex-col items-center">
                            <h3 className="text-lg h-[56px] line-clamp-2 text-center">
                              {product.name}
                            </h3>
                            <span className="text-xl md:text-2xl mt-2.5 font-medium">
                              <Pricedisplay
                                center
                                amount={
                                  product.selectedVariant.price.finalPrice
                                }
                                currencyCode={
                                  product.selectedVariant.price.currency ||
                                  "USD"
                                }
                                currencySymbol={
                                  product.selectedVariant.price
                                    .currencySymbol || "$"
                                }
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center flex-col">
                        <div className="flex h-full w-[1px] bg-[color:var(--gray-six)]" />
                        <div className="flex disabled:opacity-30 w-7 min-h-[28px] my-3 rounded-full h-7 bg-[color:var(--color-three)] text-white items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                            />
                          </svg>
                        </div>
                        <div className="flex h-full w-[1px] bg-[color:var(--gray-six)]" />
                      </div>
                      <div className="flex border border-transparent w-full flex-col">
                        <a
                          href={e.href}
                          target="_blank"
                          className="relative rounded-sm aspect-293/372 w-full overflow-hidden"
                        >
                          <Image
                            image={e.selectedVariant.mainImage?.image!}
                            alt={
                              e.selectedVariant.mainImage?.image?.altText || ""
                            }
                            useBlur
                            layout="fill"
                            objectFit="cover"
                          />
                        </a>

                        <div className="mt-3 items-center flex flex-col text-[color:var(--black-two)]">
                          <a
                            href={e.href}
                            target="_blank"
                            className="flex flex-col items-center"
                          >
                            <h3 className="text-lg h-[56px] line-clamp-2 text-center">
                              {e.name}
                            </h3>
                            <span className="text-xl md:text-2xl mt-2.5 font-medium">
                              <Pricedisplay
                                amount={e.selectedVariant.price.finalPrice}
                                center
                                currencyCode={
                                  product.selectedVariant.price.currency ||
                                  "USD"
                                }
                                currencySymbol={
                                  product.selectedVariant.price
                                    .currencySymbol || "$"
                                }
                              />
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex grow flex-col items-center justify-end md:items-start bg-[color:var(--gray-four)]">
                      <div className="text-[color:var(--color-three)] text-sm font-medium">
                        {t("productDetail.total")}
                      </div>
                      <div className="text-[color:var(--color-three)] text-2xl font-medium my-4">
                        <Pricedisplay
                          center
                          amount={
                            product.selectedVariant.price.finalPrice +
                            e.selectedVariant.price.finalPrice
                          }
                          currencyCode={
                            product.selectedVariant.price.currency || "USD"
                          }
                          currencySymbol={
                            product.selectedVariant.price.currencySymbol || "$"
                          }
                        />
                      </div>
                      <button
                        onClick={async () => {
                          await addToCart(e, 1);
                          await addToCart(product, 1);
                        }}
                        disabled={
                          loading ||
                          !e.isAddToCartEnabled ||
                          !product.isAddToCartEnabled
                        }
                        className="tracking-wide hover:opacity-80 transition duration-300 disabled:pointer-events-none disabled:opacity-60 whitespace-nowrap w-full bg-[color:var(--color-three)] text-sm md:text-base font-medium text-white rounded-sm py-2.5 px-5 cursor-pointer"
                      >
                        {product.isAddToCartEnabled
                          ? t("productDetail.addBasketTogether")
                          : t("soldOut")}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="md:flex hidden flex-col gap-6 mt-4 p-6 border border-[color:var(--gray-six)]">
          <div className="grid grid-cols-3">
            <button
              onClick={() => setTab("D")}
              className={`py-3 border rtl:rounded-r ltr:rounded-l border-[color:var(--color-three)] px-4 transition cursor-pointer ${tab === "D"
                ? "bg-[color:var(--color-three)] text-white"
                : "hover:bg-[color:var(--color-three)] hover:text-white"
                }`}
            >
              {t("productDetail.description")}
            </button>
            <button
              onClick={() => setTab("R")}
              className={`py-3 px-4 border-y border-r border-[color:var(--color-three)] transition cursor-pointer ${tab === "R"
                ? "bg-[color:var(--color-three)] text-white"
                : "hover:bg-[color:var(--color-three)] hover:text-white"
                }`}
            >
              {t("productDetail.returnPolicy")}
            </button>
            <button
              onClick={() => setTab("P")}
              className={`py-3 px-4 border-y rtl:border-l border-r border-[color:var(--color-three)] rtl:rounded-l ltr:rounded-r transition cursor-pointer ${tab === "P"
                ? "bg-[color:var(--color-three)] text-white"
                : "hover:bg-[color:var(--color-three)] hover:text-white"
                }`}
            >
              {t("productDetail.paymentPolicy")}
            </button>
          </div>
          {tab === "D" && (
            <div
              className="prose marker:text-[color:var(--rich-color)] rtl:prose-ul:pr-3 prose-table:!border-[color:var(--rich-color)] prose-tr:!border-[color:var(--rich-color)] prose-th:!border-[color:var(--rich-color)] prose-thead:!border-[color:var(--rich-color)] prose-td:!border-[color:var(--rich-color)] prose-p:[color:#374151] prose-headings:!text-[color:var(--rich-color)] max-w-none prose-sm"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
          {tab === "P" && (
            <div
              className="prose prose-table:overflow-hidden prose-table:max-w-full overflow-x-auto marker:text-[color:var(--rich-color)] prose-table:border-(color:--rich-color)! prose-tr:border-(color:--rich-color)! prose-th:border-(color:--rich-color)! prose-thead:border-(color:--rich-color)! prose-td:border-(color:--rich-color)! prose-p:[color:var(--black-two)] prose-headings:text-(color:--rich-color)! max-w-none prose-sm"
              dangerouslySetInnerHTML={{
                __html: product.attributes.find(
                  (e) => e.productAttribute?.name === "P"
                )?.value
                  ? product.attributes.find(
                    (e) => e.productAttribute?.name === "P"
                  )!.value!
                  : paymentText,
              }}
            />
          )}
          {tab === "R" && (
            <div
              className="prose prose-table:overflow-hidden prose-table:max-w-full overflow-x-auto marker:text-[color:var(--rich-color)] prose-table:border-(color:--rich-color)! prose-tr:border-(color:--rich-color)! prose-th:border-(color:--rich-color)! prose-thead:border-(color:--rich-color)! prose-td:border-(color:--rich-color)! prose-p:[color:var(--black-two)] prose-headings:text-(color:--rich-color)! max-w-none prose-sm"
              dangerouslySetInnerHTML={{
                __html: product.attributes.find(
                  (e) => e.productAttribute?.name === "R"
                )?.value
                  ? product.attributes.find(
                    (e) => e.productAttribute?.name === "R"
                  )!.value!
                  : returnText,
              }}
            />
          )}
        </div>
        <div className="border-t border-[color:var(--gray-six)] md:hidden block">
          <Accordion title={t("productDetail.description")}>
            <div
              className="prose prose-table:overflow-hidden prose-ul:rtl:pr-3 prose-table:max-w-full overflow-x-auto marker:text-[color:var(--rich-color)] prose-table:border-(color:--rich-color)! prose-tr:border-(color:--rich-color)! prose-th:border-(color:--rich-color)! prose-thead:border-(color:--rich-color)! prose-td:border-(color:--rich-color)! prose-p:[color:var(--black-two)] prose-headings:text-(color:--rich-color)! max-w-none prose-sm "
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </Accordion>
          <Accordion title={t("productDetail.returnPolicy")}>
            <div
              className="prose prose-table:overflow-hidden prose-table:max-w-full overflow-x-auto marker:text-[color:var(--rich-color)] prose-table:border-(color:--rich-color)! prose-tr:border-(color:--rich-color)! prose-th:border-(color:--rich-color)! prose-thead:border-(color:--rich-color)! prose-td:border-(color:--rich-color)! prose-p:[color:var(--black-two)] prose-headings:text-(color:--rich-color)! max-w-none prose-sm"
              dangerouslySetInnerHTML={{
                __html: product.attributes.find(
                  (e) => e.productAttribute?.name === "R"
                )
                  ? product.attributes.find(
                    (e) => e.productAttribute?.name === "R"
                  )!.value!
                  : returnText,
              }}
            />
          </Accordion>
          <Accordion title={t("productDetail.paymentPolicy")}>
            <div
              className="prose prose-table:overflow-hidden prose-table:max-w-full overflow-x-auto marker:text-[color:var(--rich-color)] prose-table:border-(color:--rich-color)! prose-tr:border-(color:--rich-color)! prose-th:border-(color:--rich-color)! prose-thead:border-(color:--rich-color)! prose-td:border-(color:--rich-color)! prose-p:[color:var(--black-two)] prose-headings:text-(color:--rich-color)! max-w-none prose-sm"
              dangerouslySetInnerHTML={{
                __html: product.attributes.find(
                  (e) => e.productAttribute?.name === "P"
                )
                  ? product.attributes.find(
                    (e) => e.productAttribute?.name === "P"
                  )!.value!
                  : paymentText,
              }}
            />
          </Accordion>
        </div>
        {show && (similar.data || []).length > 0 && (
          <>
            <div className="text-xl text-[color:var(--color-two)] font-medium my-7 text-center tracking-widest">
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
                items={(similar.data || [])?.map((product) => (
                  <div
                    key={product.id + "product"}
                    className="keen-slider__slide"
                  >
                    <ProductCard product={product} soldOutButtonText={soldOutButton} />
                  </div>
                ))}
              />
            </div>
          </>
        )}
        {show && (lastvisited.data || []).length > 0 && (
          <>
            <div className="text-xl text-[color:var(--color-two)] font-medium my-7 text-center tracking-widest">
              {t("productDetail.insterestedProducts")}
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
                items={(lastvisited.data || [])?.map((product) => (
                  <div
                    key={product.id + "product2"}
                    className="keen-slider__slide"
                  >
                    <ProductCard product={product} soldOutButtonText={soldOutButton} />
                  </div>
                ))}
              />
            </div>
          </>
        )}
        {reviews && (
          <div id="reviewsection">
            <div className="text-xl text-[color:var(--color-two)] font-medium mt-7 mb-6 text-left tracking-widest">
              {t("productDetail.comments")}
            </div>
            <div className="flex flex-col w-full">
              <div className="grid md:grid-cols-[calc(100%-224px)_200px] gap-6">
                <div className="flex">
                  <div className="flex min-w-[120px] w-[120px] rounded-sm h-min items-center justify-center flex-col p-[3px] bg-[color:var(--color-one)] text-white">
                    <div className="flex w-full py-5 bg-[color:var(--bg-color)] text-[color:var(--color-one)] items-center text-5xl justify-center">
                      {product.averageRating
                        ? product.averageRating?.toFixed(1)
                        : 0}
                    </div>
                    <div className="flex px-4 pb-2 pt-3 items-center text-sm leading-none font-light justify-center">
                      {product.reviewCount} {t("productDetail.comment")}
                    </div>
                  </div>

                  <div className="flex gap-4 rtl:pr-6 ltr:pl-6 flex-col">
                    <div className="flex items-center">
                      <Rating
                        readonly
                        size={23}
                        SVGstyle={{ display: "inline-block" }}
                        initialValue={product.averageRating || 0}
                      />
                      <span className="rtl:mr-2 ltr:ml-2 md:flex hidden mt-auto items-center justify-center text-sm text-[color:var(--gray-three)]">
                        ( {reviews.count || 0} {t("productDetail.comment")} )
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {/* Sadece login olmuş ve ürünü satın almış kullanıcılar yorum yapabilir */}
                      {isUserLoggedIn && purchasedProductsStore.purchasedProductIds.has(product.id) ? (
                        <CommentModal
                          trigger={(e) => (
                            <button
                              onClick={() => {
                                e();
                              }}
                              className="text-base underline text-left max-w-sm cursor-pointer"
                            >
                              {t("productDetail.beFirstComment")}
                            </button>
                          )}
                          productId={product.id}
                          onSuccess={() => {
                            product.getCustomerReviews().then((res) => {
                              setReviews(res);
                            });
                          }}
                          store={store}
                          requiredInput={requiredInput || ""}
                          loginRequired={loginRequired || ""}
                          successMessage={successMessage || ""}
                          errorMessage={errorMessage || ""}
                        />
                      ) : (
                        <span className="text-base max-w-sm text-[color:var(--gray-three)]">
                          {/* {!isUserLoggedIn
                            ? t("productDetail.loginRequiredToComment")
                            : t("productDetail.purchaseRequiredToComment")
                          } */}
                        </span>
                      )}

                      {/* <span className="text-base max-w-sm">
                        {t("productDetail.commentRule")}
                      </span> */}
                      <div
                        className='prose marker:text-[color:var(--rich-color)] rtl:prose-ul:pr-3 prose-table:!border-[color:var(--rich-color)] prose-tr:!border-[color:var(--rich-color)] prose-th:!border-[color:var(--rich-color)] prose-thead:!border-[color:var(--rich-color)] prose-td:!border-[color:var(--rich-color)] prose-p:[color:#374151] prose-headings:!text-[color:var(--rich-color)] max-w-none prose-sm'
                        dangerouslySetInnerHTML={{ __html: commentRules || "" }}
                      />
                      {/* <a className="text-sm underline">
                        {t("productDetail.commentRuleTitle")}
                      </a> */}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end items-start">
                  {/* Sadece login olmuş ve ürünü satın almış kullanıcılar yorum yazabilir */}
                  {isUserLoggedIn && purchasedProductsStore.purchasedProductIds.has(product.id) ? (
                    <CommentModal
                      trigger={(e) => (
                        <button
                          onClick={() => {
                            e();
                          }}
                          className="disabled:opacity-60 tracking-wide border-[color:var(--color-one)] border text-[color:var(--color-one)] text-sm font-medium rounded-sm py-2 px-5 cursor-pointer"
                          type="button"
                        >
                          {t("productDetail.writeComment")}
                        </button>
                      )}
                      productId={product.id}
                      onSuccess={() => {
                        product.getCustomerReviews().then((res) => {
                          setReviews(res);
                        });
                      }}
                      store={store}
                      requiredInput={requiredInput || ""}
                      loginRequired={loginRequired || ""}
                      successMessage={successMessage || ""}
                      errorMessage={errorMessage || ""}
                    />
                  ) : (
                    <button
                      disabled
                      className="disabled:opacity-60 tracking-wide border-[color:var(--gray-three)] border text-[color:var(--gray-three)] text-sm font-medium rounded-sm py-2 px-5 cursor-not-allowed"
                      type="button"
                      title={!isUserLoggedIn
                        ? t("productDetail.loginRequiredToComment")
                        : t("productDetail.purchaseRequiredToComment")
                      }
                    >
                      {t("productDetail.writeComment")}
                    </button>
                  )}
                </div>
              </div>

              <div ref={reviewsElementRef}>
                <Reviews customerReviewList={customerReviewList} />
              </div>

              {reviews.hasNext && (
                <button
                  onClick={() => {
                    reviews.getNext();
                  }}
                  className="disabled:opacity-60 w-min whitespace-nowrap mx-auto tracking-wide border-[color:var(--color-one)] border text-[color:var(--color-one)] text-sm font-medium rounded-sm py-2 px-5"
                >
                  {t("productDetail.moreComments")}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(ProductDetail);
