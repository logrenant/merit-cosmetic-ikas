import { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Image } from "@ikas/storefront";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "../composites/productcard";
import SwiperSlider from "../composites/swiperslider";
import { HomeproductsProps } from "../__generated__/types";
import { useScreen } from "src/utils/hooks/useScreen";
import { useUserLocation } from "src/utils/useUserLocation";
import { useDirection } from "src/utils/useDirection";



const HomeProducts = ({ products, categories, xlBanner, lgBanner, smBanner, soldOut }: HomeproductsProps) => {
  const { isTurkishIP, filterProductsByLocation } = useUserLocation();
  const { direction } = useDirection();
  const { isSmall, isMobile, isDesktop } = useScreen();
  const ref = useRef<HTMLDivElement>(null);

  // SSR-safe: Only reverse on client
  const [isClient, setIsClient] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(products?.[0]?.image?.id || "");
  const [firstFiveCategories, setFirstFiveCategories] = useState(products ? products.slice(0, 5) : []);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (products) {
      let cats = products;
      if (isClient && direction === 'rtl') {
        cats = [...products].reverse();
      }
      setFirstFiveCategories(cats.slice(0, 5));
      // Eğer mevcut selectedProducts ilk 5'te yoksa, ilk 5'in ilki seçili olsun
      if (!cats.slice(0, 5).some(cat => cat.image.id === selectedProducts)) {
        setSelectedProducts(cats[0]?.image?.id || "");
      }
    }
  }, [products, direction, isClient]);



  const [isVisible, setIsVisible] = useState(true);
  const [pxValue, setPxValue] = useState('150px');
  const [sliderKey, setSliderKey] = useState(0);

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

      {firstFiveCategories.length > 0 && (
        <div className="CATEGORRIES-SLIDER-TEST-HERE w-full mb-4 relative">
          <Swiper
            key={sliderKey}
            modules={[Navigation]}
            slidesPerView={2}
            spaceBetween={10}
            breakpoints={{
              768: { slidesPerView: 4, spaceBetween: 16 },
              1024: { slidesPerView: 5, spaceBetween: 16 },
            }}
            navigation
            className="w-full"
          >
            {firstFiveCategories.map((e) => (
              <SwiperSlide key={e.image.id} className="min-w-0 w-full flex justify-center">
                <div
                  onClick={() => setSelectedProducts(e.image.id)}
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
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      <div dir={direction} className="w-full">
        <SwiperSlider
          showPagination={true}
          showNavigation={true}
          perView={2}
          breakpoints={{
            768: { slidesPerView: 3, spaceBetween: 8 },
            1024: { slidesPerView: 5, spaceBetween: 8 },
          }}
          items={(() => {
            const currentProducts = isClient && direction === 'rtl' ? [...(products || [])].reverse() : (products || []);
            const selectedCategory = currentProducts.find((e) => e.image.id === selectedProducts);
            const categoryProducts = selectedCategory?.products.data || [];
            const filteredProducts = filterProductsByLocation(categoryProducts);
            return filteredProducts.map((product) => (
              <ProductCard key={product.id + "product"} product={product} soldOutButtonText={soldOut?.soldOutButton} />
            ));
          })()}
        />
      </div>
    </div>
  );
};
export default observer(HomeProducts);