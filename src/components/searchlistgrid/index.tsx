import React, { useMemo, useRef } from "react";
import { observer } from "mobx-react-lite";
import ProductCard from "../composites/productcard";
import { SearchlistgridProps } from "../__generated__/types";
import { useDirection } from "../../utils/useDirection";
import { useUserLocation } from "../../utils/useUserLocation";
import { Link, useStore, useTranslation } from "@ikas/storefront";
const Searchlistgrid: React.FC<SearchlistgridProps> = ({ products }) => {
  const { direction } = useDirection();
  const { t } = useTranslation();
  const store = useStore();
  const { filterProductsByLocation, adjustProductCount } = useUserLocation();

  // Filter products for Turkish IPs - only show products that can be purchased
  const filteredProducts = useMemo(() => {
    return filterProductsByLocation(products.data);
  }, [products.data, filterProductsByLocation]);

  // Ref for the product grid
  const productGridRef = useRef<HTMLDivElement>(null);
  // Ref for the first product of the newly loaded batch
  const firstNewProductRef = useRef<HTMLDivElement>(null);
  // Track current product count before loading more
  const currentProductCountRef = useRef(0);

  // Adjust the product count for display
  const adjustedProductCount = useMemo(() => {
    return adjustProductCount(products.data, products.count);
  }, [products.data, products.count, adjustProductCount]);
  return (
    <div dir={direction} className="my-10 layout">
      <div className="w-full mb-4">
        <ul className="flex flex-wrap gap-x-2 gap-y-0.5 text-[13px]">
          <li className="flex items-center gap-x-2">
            <Link href="/">
              <a className="text-[color:var(--color-one)]">{t("home")}</a>
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
              {store?.router?.query.s}
            </span>
          </li>
        </ul>
      </div>
      <div className="text-2xl text-center text-[color:var(--color-two)] font-medium mb-8">
        {t("searchTitle", {
          query: store?.router?.query.s,
          count: adjustedProductCount ? adjustedProductCount : "0",
        })}
      </div>
      {filteredProducts.length > 0 ? (
        <div
          ref={productGridRef}
          id="listgrid"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 gap-y-6"
        >
          {filteredProducts.map((product, index) => {
            // Assign ref to the first product of the newly loaded batch
            const shouldAssignRef = index === currentProductCountRef.current && currentProductCountRef.current > 0;
            return (
              <div
                key={product.id}
                ref={shouldAssignRef ? firstNewProductRef : undefined}
              >
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
      ) : (
        !products.isLoading && (
          <div className="text-center text-lg">{t("categoryPage.empty")}</div>
        )
      )}
      {products.hasNext && (
        <div className="flex mt-8">
          <button
            id="loadmore"
            onClick={() => {
              // Store current product count before loading more
              currentProductCountRef.current = filteredProducts.length;

              products.getNext().then(() => {
                setTimeout(() => {
                  if (firstNewProductRef.current) {
                    const targetTop = firstNewProductRef.current.offsetTop;
                    window.scrollTo({
                      top: targetTop,
                      behavior: "smooth",
                    });
                  }
                }, 100);
              });
            }}
            disabled={products.isLoading}
            className="flex items-center justify-center gap-2 disabled:opacity-60 px-20 text-lg py-10 bg-[color:var(--color-two)] rounded-sm text-white cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            {t("categoryPage.more")}
          </button>
        </div>
      )}
    </div>
  );
};

export default observer(Searchlistgrid);
