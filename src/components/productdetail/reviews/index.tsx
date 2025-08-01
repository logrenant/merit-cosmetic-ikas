import React from "react";
import { observer } from "mobx-react-lite";

import Review from "./review";
import useProductReviews from "src/utils/useProductReviews";


// prettier-ignore
type ReviewProps = {
    customerReviewList: ReturnType<typeof useProductReviews>["customerReviewList"];
};

const Reviews = (props: ReviewProps) => {
    const { customerReviewList } = props;

    const isVisible = customerReviewList && customerReviewList.data?.length > 0;
    if (!isVisible) return null;

    const sortedReviews = [...customerReviewList.data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <div className="w-full my-6 pt-6 border-t border-[color:var(--gray-one)]">
            {sortedReviews.map((review, index) => (
                <Review key={review.id + review.createdAt + index} review={review} />
            ))}
        </div>
    );
};

export default observer(Reviews);
