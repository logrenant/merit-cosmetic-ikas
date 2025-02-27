import React, { useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import { IkasBaseStore, useTranslation } from "@ikas/storefront";
import { Rating } from "react-simple-star-rating";
import { toast } from "react-hot-toast";
import { useOnClickOutside } from "usehooks-ts";
function CommentModal({
  trigger,
  onSuccess,
  store,
  productId,
}: {
  trigger: (event: () => void) => React.ReactNode;
  store: IkasBaseStore;
  productId: string;
  onSuccess: () => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [commentLoadind, setCommentLoadind] = useState(false);
  const [commentForm, setCommentForm] = useState<{
    title: string;
    comment: string;
    rating: number;
  }>({
    title: "",
    comment: "",
    rating: 0,
  });
  const [commentFormErrors, setCommentFormErrors] = useState<{
    title: string | null;
    comment: string | null;
    rating: string | null;
  }>({
    title: null,
    comment: null,
    rating: null,
  });
  const createComment = async () => {
    const isLogged = !!store.customerStore.customer?.id;
    if (!isLogged) {
      toast.error("Yorum yapabilmek için giriş yapmalısınız");
      return;
    }
    try {
      setCommentLoadind(true);
      await store.customerStore.sendReview({
        productId: productId,
        title: commentForm.title,
        star: commentForm.rating,
        comment: commentForm.comment,
      });
      toast.success("Yorumunuz başarıyla gönderildi");
      setCommentForm({
        title: "",
        comment: "",
        rating: 0,
      });
      onSuccess();
      setShowModal(false);
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setCommentLoadind(false);
    }
  };
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => {
    setShowModal(false);
  });
  const { t } = useTranslation();
  return (
    <>
      {trigger(() => setShowModal(true))}
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div
                ref={ref}
                className="border-0 p-6 gap-3 rounded shadow-lg relative flex md:min-w-[560px] flex-col w-full bg-[color:var(--bg-color)] outline-none focus:outline-none"
              >
                <div className="flex flex-col w-full">
                  <label className="text-base text-[color:var(--black-one)] mb-0.5">
                    {t("title")}
                  </label>
                  <input
                    type="text"
                    value={commentForm.title}
                    onChange={(e) => {
                      setCommentForm({
                        ...commentForm,
                        title: e.target.value,
                      });
                    }}
                    placeholder={t("title")}
                    className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
                  />

                  {commentFormErrors.title && (
                    <span className="text-red-500 mt-0.5 text-xs">
                      {commentFormErrors.title}
                    </span>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-base text-[color:var(--black-one)] mb-0.5">
                    {t("rating")}
                  </label>
                  <div className="flex items-center">
                    <Rating
                      size={23}
                      SVGstyle={{ display: "inline-block" }}
                      onClick={(e) => {
                        setCommentForm({
                          ...commentForm,
                          rating: e,
                        });
                      }}
                      initialValue={commentForm.rating}
                    />
                  </div>
                  {commentFormErrors.rating && (
                    <span className="text-red-500 mt-0.5 text-xs">
                      {commentFormErrors.rating}
                    </span>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-base text-[color:var(--black-one)] mb-0.5">
                    {t("comment")}
                  </label>
                  <textarea
                    value={commentForm.comment}
                    onChange={(e) => {
                      setCommentForm({
                        ...commentForm,
                        comment: e.target.value,
                      });
                    }}
                    placeholder={t("commentPlaceholder")}
                    className="w-full resize-none h-[220px] border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
                  />

                  {commentFormErrors.comment && (
                    <span className="text-red-500 mt-0.5 text-xs">
                      {commentFormErrors.comment}
                    </span>
                  )}
                </div>
                <button
                  disabled={commentLoadind}
                  onClick={() => {
                    setCommentFormErrors({
                      title: "",
                      comment: "",
                      rating: "",
                    });
                    if (
                      commentForm.title &&
                      commentForm.comment &&
                      commentForm.rating
                    ) {
                      createComment();
                    } else {
                      setCommentFormErrors({
                        title: !commentForm.title ? t("requireError") : "",
                        comment: !commentForm.comment ? t("requireError") : "",
                        rating: !commentForm.rating ? t("requireError") : "",
                      });
                    }
                  }}
                  className="tracking-wide hover:opacity-80 transition duration-300 disabled:pointer-events-none disabled:opacity-60 w-full bg-[color:var(--color-three)] text-sm md:text-base font-medium text-white rounded py-2.5 px-5"
                >
                  {t("send")}
                </button>
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black" />
        </>
      ) : null}
    </>
  );
}

export default observer(CommentModal);
