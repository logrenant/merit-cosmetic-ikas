import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@ikas/storefront";
function Modal({
  trigger,
  onConfirm,
}: {
  trigger: (event: () => void) => React.ReactNode;
  onConfirm: (event: () => void) => void;
}) {
  const [showModal, setShowModal] = React.useState(false);
  const { t } = useTranslation();

  return (
    <>
      {trigger(() => setShowModal(true))}
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-hidden focus:outline-hidden">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-sm shadow-lg relative flex flex-col w-full bg-[color:var(--bg-color)] outline-hidden focus:outline-hidden">
                <div className="relative px-6 pt-6 mb-8 flex flex-col items-center text-center">
                  <p className="mb-1 text-[color:var(--black-two)] text-lg leading-relaxed">
                    {t("deleteModal.title")}
                  </p>
                  <span className="text-[color:var(--black-two)] underline text-sm">
                    {t("deleteModal.message")}
                  </span>
                </div>
                {/*footer*/}
                <div className="max-w-[300px] w-full mx-auto gap-3 grid grid-cols-2 px-4 pb-4 rounded-b">
                  <button
                    className="disabled:opacity-60 tracking-wide border-[color:var(--color-three)] border text-[color:var(--color-three)]  text-sm font-medium rounded-sm py-2 px-5"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    {t("deleteModal.cancel")}
                  </button>
                  <button
                    className="disabled:opacity-60 tracking-wide border-[color:var(--color-three)] border bg-[color:var(--color-three)] text-sm font-medium text-white rounded-sm py-2 px-5"
                    type="button"
                    onClick={() => {
                      onConfirm(() => setShowModal(false));
                    }}
                  >
                    {t("deleteModal.confirm")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black" />
        </>
      ) : null}
    </>
  );
}

export default observer(Modal);
