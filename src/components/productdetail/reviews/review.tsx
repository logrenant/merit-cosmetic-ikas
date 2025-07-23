
import React from "react";
import { observer } from "mobx-react-lite";
import { formatDate, IkasCustomerReview, useTranslation } from "@ikas/storefront";
import getMonthName from "src/utils/getMonthName";
import { Rating } from "react-simple-star-rating";
import ImageModal from "src/components/composites/imagemodal";


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
            className="w-full border-b border-[color:var(--gray-one)] pb-6 mb-6 flex flex-col md:grid md:grid-cols-[115px_1fr_130px] gap-2 md:gap-8"
        >
            <div className="flex justify-between lg:flex-col items-start md:items-center text-center text-base">
                <Rating
                    readonly
                    size={23}
                    SVGstyle={{ display: "inline-block" }}
                    initialValue={review.star || 0}
                />
                <div className="text-xs pt-1 flex justify-end lg:hidden ">
                    {formatDate(new Date(review.createdAt))}
                </div>
            </div>
            <div className="flex pt-1 flex-col">
                <span className="text-base mb-3">{review.title}</span>
                <p className="text-sm tracking-wide font-light text-[#374151]">
                    {review.comment}
                </p>
                {Array.isArray(review.images) && review.images.length > 0 && (
                    <div className="flex flex-col lg:flex-row gap-4 pt-3">
                        {review.images.map((img, idx) => (
                            img?.src ? (
                                <img
                                    key={img.id || idx}
                                    src={img.src}
                                    alt={img.altText || `review-image-${idx}`}
                                    className="lg:max-w-[220px] lg:max-h-[140px] max-h-[280px] w-auto h-auto rounded cursor-zoom-in"
                                    onClick={() => handleImageClick(idx)}
                                />
                            ) : null
                        ))}
                    </div>
                )}
            </div>
            <div className="text-xs pt-1 lg:flex justify-end hidden ">
                {formatDate(new Date(review.createdAt))}
            </div>
            {modalOpen && Array.isArray(review.images) && review.images[selectedIdx]?.src && (
                <ImageModal
                    images={review.images}
                    selectedImage={review.images[selectedIdx]}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
};

export default observer(Review);
