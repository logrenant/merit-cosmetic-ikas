import { Link, useStore, useTranslation } from "@ikas/storefront";
import { observer } from "mobx-react-lite";
const ProductCard: React.FC = () => {
  const { t } = useTranslation();
  const store = useStore();
  const links = [
    {
      href: "/account",
      label: t("accountInfo"),
    },
    {
      href: "/account/favorite-products",
      label: t("favoriteProducts"),
    },
    {
      href: "/account/addresses",
      label: t("address"),
    },
    {
      href: "/account/orders",
      label: t("orders"),
    },
  ];

  return (
    <div className="flex w-full text-left items-start flex-col text-lg">
      {links.map((lnk, i) => (
        <Link key={`${lnk.label}${lnk.href}${i}`} href={lnk.href}>
          <a
            className={`${store?.router?.pathname === lnk.href
                ? "text-[color:var(--black-two)]"
                : "hover:text-[color:var(--black-two)] text-[color:var(--gray-five)]"
              } flex py-4 first:pt-0.5 leading-none border-b border-[color:var(--black-two)] items-center justify-between w-full`}
          >
            <span>{lnk.label}</span>
            {store?.router?.pathname !== lnk.href && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 opacity-60 ltr:rotate-0 rtl:rotate-180"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            )}
          </a>
        </Link>
      ))}
      <button
        className="text-[color:var(--gray-five)] hover:text-[color:var(--black-two)] leading-none lg:flex hidden mt-32 items-center justify-start gap-1.5 w-full cursor-pointer"
        onClick={() => {
          store.customerStore.logout();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.3}
          stroke="currentColor"
          className="w-6 h-6 ltr:rotate-0 rtl:rotate-180"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
          />
        </svg>

        <span>{t("logout")}</span>
      </button>
    </div>
  );
};

export default observer(ProductCard);
