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
    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedIdx, setSelectedIdx] = React.useState(0);

    const handleImageClick = (idx: number) => {
        setSelectedIdx(idx);
        setModalOpen(true);
    };

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
                {Array.isArray(review.images) && review.images.length > 0 && (
                    <div className="flex flex-row gap-4 pt-3">
                        {review.images.map((img, idx) => (
                            img?.src ? (
                                <img
                                    key={img.id || idx}
                                    src={img.src}
                                    alt={img.altText || `review-image-${idx}`}
                                    className="max-w-[220px] max-h-[140px] w-auto h-auto rounded cursor-zoom-in"
                                    onClick={() => handleImageClick(idx)}
                                />
                            ) : null
                        ))}
                    </div>
                )}
            </div>
            <div className="text-xs pt-1 flex justify-end">
                {formatDate(new Date(review.createdAt))}
            </div>
            {modalOpen && Array.isArray(review.images) && review.images[selectedIdx]?.src && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setModalOpen(false)}>
                    <div className="relative">
                        <img
                            src={review.images[selectedIdx].src}
                            alt={review.images[selectedIdx].altText || `review-image-modal-${selectedIdx}`}
                            className="max-w-[90vw] max-h-[90vh] rounded shadow-lg"
                        />
                        <button
                            className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full px-3 py-2 text-black cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); setModalOpen(false); }}
                        >
                            &#10005;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default observer(Review);
