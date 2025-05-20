import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import {
  IkasBaseStore,
  IkasCustomerReviewList,
  IkasProduct,
} from "@ikas/storefront";

function useProductReviews({ product }: { product: IkasProduct }) {
  const store = IkasBaseStore.getInstance();
  const router = useRouter();

  // States
  const [isFormVisible, setFormVisible] = useState(false);
  const [customerReviewList, setCustomerReviewList] =
    useState<IkasCustomerReviewList | null>(null);

  // Refs
  const reviewsElementRef = useRef<HTMLDivElement>(null);

  const onWriteReviewButtonClick = () => {
    if (
      product.isCustomerReviewLoginRequired &&
      !store.customerStore.customer
    ) {
      const route = decodeURIComponent(
        "/account/login?redirect=" + product.href
      );

      router.push(route);
    } else {
      setFormVisible((prev) => !prev);
    }
  };

  const getCustomerReviews = async () => {
    try {
      const result = await product.getCustomerReviews({ limit: 6 });
      setCustomerReviewList(result);
    } catch (error) {
      console.log("error", error);
    }
  };

  const onPageChange = async (page: number) => {
    await customerReviewList?.getPage(page);

    window.scrollTo({
      top: reviewsElementRef.current?.offsetTop ?? 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setFormVisible(false);
    getCustomerReviews();
  }, [product]);

  return {
    isFormVisible,
    customerReviewList,
    reviewsElementRef,
    onWriteReviewButtonClick,
    onPageChange,
  };
}

export default useProductReviews;
