import { Image } from "@ikas/storefront";
import { observer } from "mobx-react-lite";
import { useKeenSlider } from "keen-slider/react";
import React, { useState, useRef, useEffect } from "react";

import ProductCard from "../composites/productcard";
import SimpleSlider from "../composites/simpleslider";
import { HomeproductsProps } from "../__generated__/types";
import { sliderBreakpoints } from "src/styles/breakpoints";

const HomeProducts = ({ products, categories, banner }: HomeproductsProps) => {
  const [selectedProducts, setSelectedProducts] = useState(
    products![0].image.id
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxSlide, setMaxSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

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

  const [isVisible, setIsVisible] = useState(true);
  const [pxValue, setPxValue] = useState('150px');

  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div dir="ltr" className="TEST-PARENT my-6 layout relative" ref={ref} >

      {banner && (
        <div className="w-full relative h-28 mb-6">
          <Image
            image={banner}
            alt={banner.altText || "Banner"}
            layout="fill"
            objectFit="cover"
            className="rounded"
          />
        </div>
      )}

      {categories && (
        <div ref={sliderRef} className="CATEGORRIES-SLIDER-TEST-HERE w-full mb-6">
          <SimpleSlider
            showPagination={false}
            showNavigation={true}
            keenOptions={{
              initial: 0,
              loop: false,
              slides: {
                perView: 2,
                spacing: 10,
              }, renderMode: "precision",
              breakpoints: {
                "(min-width: 568px)": {
                  slides: { perView: 2, spacing: 16 },
                },
                "(min-width: 768px)": {
                  slides: { perView: 4, spacing: 16 },
                },
                "(min-width: 1024px)": {
                  slides: {
                    perView: 5,
                    spacing: 16,
                  },
                },
              },
            }}

            items={products!.map((e) => (
              <div key={e.image.id} className="TEST-ITEMS-MAPPING-1 keen-slider__slide">
                <div
                  onClick={() => {
                    console.log("e.image.id", e.image.id);
                    setSelectedProducts(e.image.id);
                  }}
                  className={`aspect-216/91 cursor-pointer w-full relative ${selectedProducts === e.image.id
                    ? "EQUAL-TEST-HERE border-4 border-[color:var(--quick-color)] rounded-sm"
                    : "NOT-EQUAL-TEST-HERE hover:border-4 border-[color:var(--quick-color)] hover:rounded-sm"
                    }`}
                >
                  <Image
                    id={"test-id---" + e.image.id}
                    alt={e.image?.altText || ""}
                    useBlur
                    image={e.image}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
            ))}
          />
        </div>
      )}

      <div className="TEST-SECOND-SLIDER w-full">
        <div className="TEST-SECOND-SLIDER w-full">
          <SimpleSlider
            key={selectedProducts}
            showPagination={true}
            keenOptions={{
              initial: 0,
              slides: {
                perView: 5,
                spacing: 8,
              },
            }}
            items={products
              ?.find((e) => e.image.id === selectedProducts)
              ?.products.data?.map((product) => (
                <div key={product.id} className="TEST-ITEMS-MAPPING-2 keen-slider__slide">
                  <ProductCard product={product} />
                </div>
              )) ?? []}
          />
        </div>
      </div>

    </div>
  );
};

export default observer(HomeProducts);
