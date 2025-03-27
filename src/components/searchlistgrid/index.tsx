import React from "react";
import { observer } from "mobx-react-lite";
import ProductCard from "../composites/productcard";
import { SearchlistgridProps } from "../__generated__/types";
import { useDirection } from "../../utils/useDirection";
import { Link, useStore, useTranslation } from "@ikas/storefront";
const Searchlistgrid: React.FC<SearchlistgridProps> = ({ products }) => {
  const { direction } = useDirection();
  const { t } = useTranslation();
  const store = useStore();
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
          count: products.count ? products.count : "0",
        })}
      </div>
      {products.data.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 gap-y-6">
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
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
              products.getNext().then(() => {
                const element = document.getElementById("loadmore");
                if (element?.offsetTop) {
                  window.scrollTo({
                    top: element?.offsetTop! - 500 || 0,
                    behavior: "smooth",
                  });
                }
              });
            }}
            disabled={products.isLoading}
            className="flex items-center justify-center gap-2 disabled:opacity-60 px-20 text-lg py-10 bg-[color:var(--color-two)] rounded-sm text-white"
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
