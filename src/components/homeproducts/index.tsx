import { Image } from "@ikas/storefront";
import { observer } from "mobx-react-lite";
import React, { useState, useRef, useEffect } from "react";

import ProductCard from "../composites/productcard";
import SimpleSlider from "../composites/simpleslider";
import { HomeproductsProps } from "../__generated__/types";

const HomeProducts: React.FC<HomeproductsProps> = ({
  products,
  categories,
}) => {
  const [selectedProducts, setSelectedProducts] = useState(
    products![0].image.id
  );

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
    <div dir="ltr" className="TEST-PARENT my-10 layout relative" ref={ref} >

      {categories && (
        <div className="CATEGORRIES-SLIDER-TEST-HERE w-full mb-6">
          <SimpleSlider
            keenOptions={{
              initial: 0,
              loop: false,
              slides: {
                perView: 2,
                spacing: 10,
              },
              breakpoints: {
                "(min-width: 568px)": {
                  slides: { perView: 3, spacing: 16 },
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
                  className={`aspect-[216/91] cursor-pointer w-full relative ${selectedProducts === e.image.id
                    ? "EQUAL-TEST-HERE border-4 border-[color:var(--quick-color)] rounded"
                    : "NOT-EQUAL-TEST-HERE hover:border-4 border-[color:var(--quick-color)] hover:rounded"
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
        <SimpleSlider
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
          items={products
            ?.find((e) => {
              console.log("e.image.id", e.image.id, selectedProducts === e.image.id);
              e.products.data.forEach((prod) => {
                console.log("prod.name", prod.name);
              })
              return e.image.id === selectedProducts
            })
            ?.products.data?.map((product) => {
              console.log("product.name", product.name);
              return (
                <div key={product.id} className="TEST-ITEMS-MAPPING-2 keen-slider__slide">
                  {/* <p className="text-blue-500 font-bold text-sm">{product.name.slice(0, 10)}</p> */}
                  <ProductCard product={product} />
                </div>
              )
            }) ?? []
          }
        />
      </div>

    </div>
  );
};

export default observer(HomeProducts);
