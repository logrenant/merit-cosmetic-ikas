import React, { useState, useRef, useEffect } from "react";
import { observer } from "mobx-react-lite";
import ProductCard from "../composites/productcard";
import { HomeproductsProps } from "../__generated__/types";
import SimpleSlider from "../composites/simpleslider";
import { Image } from "@ikas/storefront";

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

      {isVisible && (<div className="relative w-full">

        <div className={`absolute translate-y-[${pxValue}] translate-x-[-10px] left-0 w-12 h-12 rounded-full bg-slate-500 text-white opacity-30 z-50 flex items-center justify-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </div>

        <div className="absolute translate-y-[150px] right-0 w-12 h-12 rounded-full bg-slate-500 text-white opacity-30 z-50 flex items-center justify-center">

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>

        </div>

      </div>)}
    

      {categories && (
        <div className="CATEGORRIES-SLIDER-TEST-HERE w-full mb-6">
          <SimpleSlider
            keenOptions={{
              initial: 0,
              loop: true,
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
                <p className="text-red-500 ">{e.image.id.slice(-5)} </p>

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
                  <p className="text-blue-500 font-bold text-sm">{product.name.slice(0, 10)}</p>
                  <ProductCard product={product} />
                </div>
              )
            })

          }
        />
      </div>


    </div>
  );
};

export default observer(HomeProducts);
