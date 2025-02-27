import {
  IkasProduct,
  Image,
  Link,
  useStore,
  useTranslation,
} from "@ikas/storefront";
import { observer } from "mobx-react-lite";
import { useState, useEffect, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";


const BellButton = ({
  popularProducts,
}: {
  popularProducts: IkasProduct[];
}) => {
  const [openBell, setOpenBell] = useState(false);
  const { t } = useTranslation();
  const store = useStore();
  const [isPending, setPending] = useState(false);
  const [products, setProducts] = useState<IkasProduct[]>([]);

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => {
        setOpenBell(false);

  });


  const getFavoriteProducts = async () => {
    if (products.length === 0) {
      setPending(true);
    }
    try {
      const result = await store.customerStore.getFavoriteProducts();
      result.forEach((p) => {
        p.selectedVariantValues = p.variants[0].variantValues;
      });
      setProducts(result);
    } catch (error) {
      console.error("Error on getFavoriteProducts");
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    if (store.customerStore.customer?.id && openBell === true) {
      getFavoriteProducts();
    }
  }, [store.customerStore.customer?.id, openBell]);

  return (
    <div className="flex px-2 h-full items-center justify-center relative"
    >
      <button
        onClick={() => {
          setOpenBell(!openBell);
        }}
        onMouseEnter={() => {
          setOpenBell(true);
        }}
        className="flex items-center justify-center"
      >
        <svg
          width="22"
          height="24"
          viewBox="0 0 22 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.6531 18.214C16.9307 17.9444 19.1686 17.4069 21.3202 16.6127C19.498 14.5942 18.4912 11.9705 18.4952 9.25129V8.3956V8.33448C18.4952 6.38926 17.7225 4.5237 16.347 3.14822C14.9715 1.77274 13.1059 1 11.1607 1C9.21548 1 7.34992 1.77274 5.97444 3.14822C4.59896 4.5237 3.82622 6.38926 3.82622 8.33448V9.25129C3.82991 11.9707 2.8226 14.5944 1 16.6127C3.11844 17.395 5.35179 17.939 7.66827 18.214M14.6531 18.214C12.333 18.4892 9.98843 18.4892 7.66827 18.214M14.6531 18.214C14.8293 18.7639 14.8731 19.3477 14.781 19.9177C14.6889 20.4878 14.4635 21.028 14.1231 21.4945C13.7827 21.9609 13.337 22.3404 12.8222 22.602C12.3074 22.8636 11.7381 23 11.1607 23C10.5833 23 10.014 22.8636 9.49921 22.602C8.98443 22.3404 8.53871 21.9609 8.19833 21.4945C7.85795 21.028 7.63253 20.4878 7.54042 19.9177C7.44831 19.3477 7.49211 18.7639 7.66827 18.214"
            stroke="#212121"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {openBell && (
        <div ref={ref} className="absolute w-[250px] z-[51] rtl:left-0 ltr:-right-8 top-[37px] rounded overflow-hidden bg-[color:var(--bg-color)] shadow-navbar">
          <h3 className="text-sm  text-center bg-[color:var(--color-one)] px-4 py-1.5 text-white">
            {t("monthlyFavorite")}
          </h3>
          <div className="grid divide-y divide-[color:var(--gray-one)] grid-cols-1"
            onMouseLeave={() => {
            setOpenBell(false);
          }}
          >
            {isPending ? (
              <div className="flex items-center justify-center h-[200px]">
                <div className="customloader" />
              </div>
            ) : (
              (products.length > 0 ? products : popularProducts)
                .slice(0, 5)
                .map((product) => {
                  const mainImages = product?.attributes?.find(
                    (e) => e.productAttribute?.name === "Ana Resim"
                  )?.images;
                  const showImage =
                    mainImages && mainImages.length > 0
                      ? mainImages[0]
                      : product?.selectedVariant?.mainImage?.image!;
                  return (
                    <Link key={product.id} href={product.href}>
                      <a className="grid gap-1 px-2 py-3 grid-cols-[70px,1fr] w-full">
                        <div className="relative rounded aspect-[293/372] max-w-[60px] w-full overflow-hidden">
                          <Image
                            alt={product.name}
                            useBlur
                            image={showImage}
                            sizes="(max-width: 1280px) 180px, 180px"
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div className="p-1 flex flex-col text-[color:var(--black-two)]">
                          <h3 className="text-xs line-clamp-3">
                            {product.name}
                          </h3>
                        </div>
                      </a>
                    </Link>
                  );
                })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default observer(BellButton);
