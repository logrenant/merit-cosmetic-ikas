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
  const [selectedProducts, setSelectedProducts] = useState(
    products![0].image.id
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxSlide, setMaxSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Categories slider states
  const [categoriesCurrentSlide, setCategoriesCurrentSlide] = useState(0);
  const [categoriesMaxSlide, setCategoriesMaxSlide] = useState(0);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  const { isTurkishIP, filterProductsByLocation } = useUserLocation();
  const { direction } = useDirection();

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

  // Categories slider with RTL support
  const [categoriesSliderRef, categoriesSlider] = useKeenSlider<HTMLDivElement>({
    initial: direction === "rtl" ? Math.max(0, (products?.length || 0) - 2) : 0,
    rtl: direction === "rtl", // Use RTL when direction is RTL
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
    setSliderKey(prev => prev + 1);
  }, [direction]);

  // Update categories slider when direction changes
  useEffect(() => {
    if (categoriesSlider.current && direction === "rtl") {
      const targetSlide = Math.max(0, (products?.length || 0) - 2);
      categoriesSlider.current.moveToIdx(targetSlide);
    }
  }, [direction, products?.length, categoriesSlider]);

  return (
    <div dir={direction} className="TEST-PARENT my-4 layout relative" ref={ref} >

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
            {products!.map((e) => (
              <div key={e.image.id} className="keen-slider__slide">
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
                onClick={() => direction === "rtl" ? categoriesSlider.current?.next() : categoriesSlider.current?.prev()}
                className={`xl:hidden absolute top-[30%] ${direction === "rtl" ? "right-[-32px]" : "left-[-32px]"} text-[color:var(--color-two)] hover:text-[color:var(--color-four)] duration-150 cursor-pointer`}
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
                    d={direction === "rtl" ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
                  />
                </svg>
              </button>
              <button
                onClick={() => direction === "rtl" ? categoriesSlider.current?.prev() : categoriesSlider.current?.next()}
                className={`xl:hidden absolute top-[30%] ${direction === "rtl" ? "left-[-32px]" : "right-[-32px]"} text-[color:var(--color-two)] hover:text-[color:var(--color-four)] duration-150 cursor-pointer`}
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
                    d={direction === "rtl" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
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
            key={selectedProducts}
            showPagination={true}
            keenOptions={{
              initial: 0,
              rtl: direction === "rtl",
              slides: {
                perView: 5,
                spacing: 8,
              },
            }}
            items={products
              ?.find((e) => e.image.id === selectedProducts)
              ?.products.data
              ? filterProductsByLocation(
                products.find((e) => e.image.id === selectedProducts)?.products.data || []
              )?.map((product) => (
                <div key={product.id} className="TEST-ITEMS-MAPPING-2 keen-slider__slide">
                  <ProductCard product={product} soldOutButtonText={soldOut?.soldOutButton} />
                </div>
              ))
              : []}
          />
        </div>
      </div>

    </div>
  );
};

export default observer(HomeProducts);
