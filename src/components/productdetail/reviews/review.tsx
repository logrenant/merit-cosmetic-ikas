import React from "react";
import { observer } from "mobx-react-lite";
import { formatDate, IkasCustomerReview, useTranslation } from "@ikas/storefront";

import getMonthName from "src/utils/getMonthName";
import { Rating } from "react-simple-star-rating";


type Props = {
    review: IkasCustomerReview;
};

const Review = (props: Props) => {
    const { review } = props;

    return (
        <div
            key={review.id + "comment"}
            className="w-full border-b border-[color:var(--gray-one)] pb-6 mb-6 grid md:grid-cols-[115px_1fr_130px] gap-2 md:gap-8"
        >
            <div className="flex flex-col items-start md:items-center text-center text-base">
                <Rating
                    readonly
                    size={23}
                    SVGstyle={{ display: "inline-block" }}
                    initialValue={review.star || 0}
                />
            </div>
            <div className="flex pt-1 flex-col">
                <span className="text-base mb-3">{review.title}</span>

                <p className="text-sm tracking-wide font-light">
                    {review.comment}
                </p>
            </div>
            <div className="text-xs pt-1 flex justify-end">
                {formatDate(new Date(review.createdAt))}
            </div>
        </div>
    );
};

export default observer(Review);
