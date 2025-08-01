import { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Image } from "@ikas/storefront";
import { KeenSliderInstance, KeenSliderPlugin, useKeenSlider } from "keen-slider/react";

import "keen-slider/keen-slider.min.css";
import ProductCard from "../composites/productcard";
import SimpleSlider from "../composites/simpleslider";
import { HomeproductsProps } from "../__generated__/types";
import { sliderBreakpoints } from "src/styles/breakpoints";
import { useScreen } from "src/utils/hooks/useScreen";
import { useUserLocation } from "src/utils/useUserLocation";
import { useDirection } from "src/utils/useDirection";

const HomeProducts = ({ products, categories, xlBanner, lgBanner, smBanner, soldOut }: HomeproductsProps) => {
  const { direction } = useDirection();
  const [isClient, setIsClient] = useState(false);

  // SSR-safe initialization - use original products on server, reversed on client after hydration
  const [reversedProducts, setReversedProducts] = useState(products);

  const [selectedProducts, setSelectedProducts] = useState(
    products?.[0]?.image?.id || ""
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxSlide, setMaxSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Categories slider states
  const [categoriesCurrentSlide, setCategoriesCurrentSlide] = useState(0);
  const [categoriesMaxSlide, setCategoriesMaxSlide] = useState(0);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  const { isTurkishIP, filterProductsByLocation } = useUserLocation();

  const MutationPlugin = (slider: KeenSliderInstance) => {
    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(() => slider.update());
    });

    slider.on("created", () => {
      observer.observe(slider.container, { childList: true });
    });

    slider.on("destroyed", () => {
      observer.disconnect();
    });
  };

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
      setMaxSlide(s.track.details.maxIdx);
    },
    created(s) {
      setLoaded(true);
      setMaxSlide(s.track.details.maxIdx);
    },
    slides: { perView: 2, spacing: 10 },
    breakpoints: {
      [sliderBreakpoints.xs]: { slides: { perView: 3, spacing: 16 } },
      [sliderBreakpoints.md]: { slides: { perView: 4, spacing: 16 } },
      [sliderBreakpoints.lg]: { slides: { perView: 5, spacing: 16 } },
    },
  });

  // Categories slider with RTL support - SSR safe
  const [categoriesSliderRef, categoriesSlider] = useKeenSlider<HTMLDivElement>({
    initial: 0, // Always start from 0 during SSR
    rtl: false, // Always use LTR for slider navigation regardless of site direction
    slideChanged(s) {
      setCategoriesCurrentSlide(s.track.details.rel);
      setCategoriesMaxSlide(s.track.details.maxIdx);
    },
    created(s) {
      setCategoriesLoaded(true);
      setCategoriesMaxSlide(s.track.details.maxIdx);
    },
    slides: { perView: 2, spacing: 10 },
    breakpoints: {
      [sliderBreakpoints.md]: { slides: { perView: 4, spacing: 16 } },
      [sliderBreakpoints.lg]: { slides: { perView: 5, spacing: 16 } },
    },
  }, [MutationPlugin]);

  const [isVisible, setIsVisible] = useState(true);
  const [pxValue, setPxValue] = useState('150px');
  const [sliderKey, setSliderKey] = useState(0);

  const ref = useRef<HTMLDivElement>(null);
  const { isSmall, isMobile, isDesktop } = useScreen();

  // SSR-safe initialization - only run on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update reversed products and selected product only on client side
  useEffect(() => {
    if (isClient && products) {
      const newReversedProducts = direction === "rtl" ? [...products].reverse() : products;
      setReversedProducts(newReversedProducts);

      // Update selected product to maintain consistency
      if (newReversedProducts.length > 0) {
        setSelectedProducts(newReversedProducts[0].image.id);
      }
    }
  }, [isClient, direction, products]);

  // Move slider to appropriate position after client hydration
  useEffect(() => {
    if (isClient && categoriesSlider.current && direction === "rtl" && reversedProducts) {
      // RTL'de slider'ı sondan 2. pozisyona kaydır (sağdan görünür hale getir)
      const targetSlide = Math.max(0, reversedProducts.length - 2);
      setTimeout(() => {
        categoriesSlider.current?.moveToIdx(targetSlide);
      }, 100); // Küçük bir delay ekle
    } else if (isClient && categoriesSlider.current && direction === "ltr") {
      // LTR'de başa dön
      setTimeout(() => {
        categoriesSlider.current?.moveToIdx(0);
      }, 100);
    }
  }, [isClient, direction, reversedProducts?.length, categoriesSlider]);

  useEffect(() => {
    console.log("categories", categories);
  }, [categories]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const elementHeight = entry.contentRect.height;
        console.log("elementHeight", elementHeight);

        if (elementHeight < 300) {
          setIsVisible(false);
          setPxValue('75px');

        } else {
          setIsVisible(true);
          setPxValue('150px');
        }
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  // Force slider recreation when direction changes
  useEffect(() => {
    if (isClient) {
      setSliderKey(prev => prev + 1);
    }
  }, [direction, isClient]);

  return (
    <div dir="ltr" className="TEST-PARENT my-4 layout relative" ref={ref} >

      {isDesktop && xlBanner && (
        <div className="aspect-1400/120 relative mb-4">
          <Image
            image={xlBanner}
            alt={xlBanner.altText || "Banner"}
            layout="fill"
            className="object-contain"
          />
        </div>
      )}
      {!isDesktop && isMobile && !isSmall && lgBanner && (
        <div className="aspect-704/64 relative mb-4">
          <Image
            image={lgBanner}
            alt={lgBanner.altText || "Banner"}
            layout="fill"
            className="object-contain"
          />
        </div>
      )}
      {isSmall && smBanner && (
        <div className="aspect-316/64 relative mb-4">
          <Image
            image={smBanner}
            alt={smBanner.altText || "Banner"}
            layout="fill"
            className="object-contain"
          />
        </div>
      )}

      {categories && (
        <div className="CATEGORRIES-SLIDER-TEST-HERE w-full mb-4 relative">
          {/* Categories Slider Container */}
          <div ref={categoriesSliderRef} className="keen-slider flex flex-row">
            {reversedProducts!.map((e, index) => (
              <div key={e.image.id} className={`keen-slider__slide`}>
                <div
                  onClick={() => {
                    console.log("e.image.id", e.image.id);
                    setSelectedProducts(e.image.id);
                  }}
                  className={`aspect-648/270 cursor-pointer w-full relative overflow-hidden ${selectedProducts === e.image.id
                    ? "opacity-90 border-4 border-[color:var(--color-one)]"
                    : "hover:border-4 hover:border-[color:var(--color-one)] transition-all duration-300"
                    }`}
                >
                  <Image
                    id={"test-id---" + e.image.id}
                    alt={e.image?.altText || ""}
                    useBlur
                    image={e.image}
                    layout="fill"
                    objectFit="cover"
                    className={`duration-300 ${selectedProducts === e.image.id
                      ? "scale-110"
                      : "hover:scale-110"
                      }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {categoriesLoaded && categoriesSlider.current && (
            <>
              <button
                onClick={() => categoriesSlider.current?.prev()}
                className={`xl:hidden absolute top-[30%] left-[-32px] text-[color:var(--color-two)] hover:text-[color:var(--color-four)] duration-150 cursor-pointer`}
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
              <button
                onClick={() => categoriesSlider.current?.next()}
                className={`xl:hidden absolute top-[30%] right-[-32px] text-[color:var(--color-two)] hover:text-[color:var(--color-four)] duration-150 cursor-pointer`}
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
            </>
          )}
        </div>
      )}

      <div className="TEST-SECOND-SLIDER w-full">
        <div className="TEST-SECOND-SLIDER w-full">
          <SimpleSlider
            key={`${selectedProducts}-${direction}-${isClient}`}
            showPagination={true}
            keenOptions={{
              initial: 0, // Her zaman 0'dan başla, SimpleSlider kendi RTL logic'ini kullansın
              slides: {
                perView: 2,
                spacing: 10,
              },
              breakpoints: {
                [sliderBreakpoints.md]: { slides: { perView: 4, spacing: 16 } },
                [sliderBreakpoints.lg]: { slides: { perView: 5, spacing: 16 } },
              },
            }}
            items={(() => {
              // Only apply RTL logic on client side to avoid SSR mismatch
              const currentProducts = isClient ? reversedProducts : products;
              const selectedCategory = currentProducts?.find((e) => e.image.id === selectedProducts);
              const categoryProducts = selectedCategory?.products.data || [];
              const filteredProducts = filterProductsByLocation(categoryProducts);
              // RTL'de ürünlerin sırasını değiştirmeyelim, SimpleSlider'ın kendi RTL logic'i doğru çalışsın
              const finalProducts = filteredProducts; // Reverse yapmıyoruz

              return finalProducts?.map((product, index) => (
                <div
                  key={product.id}
                  className={`TEST-ITEMS-MAPPING-2 keen-slider__slide`}
                >
                  <ProductCard product={product} soldOutButtonText={soldOut?.soldOutButton} />
                </div>
              ));
            })()}
          />
        </div>
      </div>

    </div>
  );
};

export default observer(HomeProducts);
