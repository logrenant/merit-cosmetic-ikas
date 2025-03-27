import { observer } from "mobx-react-lite";
import useFavoriteProducts from "../../utils/useFavoriteProducts";
import Productcard from "./productcard";
import { Link, useStore, useTranslation } from "@ikas/storefront";

const FavoriteProducts = () => {
  const { products, isPending, getFavoriteProducts } = useFavoriteProducts();
  const store = useStore();
  const onClick = async (id: string) => {
    await store.customerStore.removeProductFromFavorites(id);
    getFavoriteProducts();
  };
  const { t } = useTranslation();

  return (
    <div>
      {isPending && (
        <div className="flex items-center justify-center h-[411px]">
          <div className="customloader" />
        </div>
      )}
      {!isPending && products.length === 0 && (
        <div className="flex flex-col">
          <div className="ltr:text-left font-light text-lg">
            {t("emptyFavorite")}
          </div>
          <Link href="/">
            <a className="mt-2 w-min whitespace-nowrap flex items-center justify-center lg:ml-auto px-4 py-2 bg-[color:var(--color-one)] text-white rounded-sm">
              {t("findProducts")}
            </a>
          </Link>
        </div>
      )}

      {!isPending && !!products.length && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {products.map((prod) => (
            <Productcard
              onToggle={() => {
                onClick(prod.id);
              }}
              key={prod.id}
              product={prod}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default observer(FavoriteProducts);
