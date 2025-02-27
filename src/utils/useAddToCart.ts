import { useState } from "react";
import { IkasProduct, useStore, useTranslation } from "@ikas/storefront";
import { GraphQLError } from "graphql";
import { IkasCartOperationResult } from "@ikas/storefront/build/store/cart";
import { toast } from "react-hot-toast";

export function useAddToCart() {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const addToCart = async (product: IkasProduct, quantity: number) => {
    const store = useStore();

    const item = store.cartStore.findExistingItem(
      product.selectedVariant,
      product
    );

    let result: IkasCartOperationResult;

    setLoading(true);
    if (item) {
      result = await store.cartStore.changeItemQuantity(
        item,
        item.quantity + quantity
      );
    } else {
      result = await store.cartStore.addItem(
        product.selectedVariant,
        product,
        quantity
      );
    }
    setLoading(false);

    if (result.response?.graphQLErrors) {
      maxQuantityPerCartHandler({
        productName: product.name,
        errors: result.response?.graphQLErrors,
        message: t("maxQuantityPerCartError"),
      });
    } else {
      toast.success(t("addedToCart"));
    }
  };

  return {
    loading,
    addToCart,
  };
}

type MaxQuantityPerCartHandlerProps = {
  productName: string;
  errors?: readonly GraphQLError[];
  message: string;
};

export const maxQuantityPerCartHandler = ({
  productName,
  errors,
  message,
}: MaxQuantityPerCartHandlerProps) => {
  if (!errors?.length) return;
  const isMaxQuantityPerCartError = errors?.findIndex(
    (error) => error.extensions.code === "MAX_QUANTITY_PER_CART_LIMIT_REACHED"
  );

  if (isMaxQuantityPerCartError !== -1) {
    toast.error(message);
  }
};
