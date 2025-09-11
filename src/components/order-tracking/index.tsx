import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import {
  IkasOrder,
  IkasOrderTransaction,
  IkasTransactionType,
  IkasTransactionStatus,
  useStore,
  useTranslation
} from "@ikas/storefront";

import Orderdetail from "../orderdetail";
import { useDirection } from "src/utils/useDirection";
import { OrderTrackingProps } from "../__generated__/types";
import BackSvg from "../svg/BackSvg";

const OrderTracking = (props: OrderTrackingProps) => {
  const store = useStore();
  const { t } = useTranslation();
  const { direction } = useDirection();

  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<IkasOrder>();
  const [orderTransactions, setOrderTransactions] = useState<IkasOrderTransaction[]>();
  const [emailError, setEmailError] = useState("");
  const [orderNumberError, setOrderNumberError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefund, setIsRefund] = useState(false);
  const [isRefundedSuccess, setIsRefundedSuccess] = useState(false);

  const [formState, setFormState] = useState({
    email: '',
    orderNumber: '',
  });

  useEffect(() => {
    setFormState({
      email,
      orderNumber
    });
  }, [email, orderNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError("");
    setOrderNumberError("");
    setGeneralError("");
    setHasError(false);
    setIsSubmitting(true);

    let hasValidationErrors = false;

    if (email.length === 0) {
      setEmailError(props.emailRule ?? "");
      hasValidationErrors = true;
    }
    else if (formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      setEmailError(props.emailRule ?? "");
      hasValidationErrors = true;
    }

    if (orderNumber.length === 0) {
      setOrderNumberError(props.orderNumberRule ?? "");
      hasValidationErrors = true;
    }
    else if (formState.orderNumber) {
      const orderPattern = /^\+?\d{2,8}$/;
      const isValidOrder = orderPattern.test(
        formState.orderNumber.replace(/\s+/g, '')
      );

      if (!isValidOrder) {
        setOrderNumberError(props.orderNumberRule ?? "");
        hasValidationErrors = true;
      }
    }

    if (hasValidationErrors) {
      setIsSubmitting(false);
      return;
    }

    const found = await store.customerStore.getOrderByEmail(email, orderNumber);
    console.log("found:", found);

    if (!found) {
      setOrder(undefined);
      setOrderTransactions(undefined);
      setGeneralError(props.orderCannotFound ?? "");
      setIsSubmitting(false);
      return;
    }

    if (found.customer?.isGuestCheckout === false) {
      setEmailError(props.loginRule ?? "");
      setIsSubmitting(false);
      return;
    }

    setOrder(found);

    const txns = await store.customerStore.getOrderTransactions({ orderId: found.id });
    if (Array.isArray(txns) && txns.length) {
      const filtered = txns.filter(
        (tx) => tx.status === IkasTransactionStatus.SUCCESS && tx.type === IkasTransactionType.SALE
      );
      setOrderTransactions(filtered);
    }

    setIsSubmitting(false);
  };

  return (
    <div dir={direction}>
      <div className="flex items-center mt-10 gap-4 border-b-[4px] border-[color:var(--color-five)] pb-6 justify-center">
        <h1 className="text-lg px-4 relative font-medium text-[color:var(--color-one)]">
          {props.pageTitle}
          <span className="absolute left-0 bottom-[-28px] h-[4px] w-full bg-[color:var(--color-one)]"></span>
        </h1>
      </div>
      <div className="layout flex flex-col xl:flex-row justify-center gap-12 my-10">
        {!order && (
          <div >

            {generalError && (
              <div className="p-4 bg-[color:var(--auth-color)] text-[color:var(--black-two)] rounded-sm h-fit my-4">
                <p className="text-black text-[14px]">{generalError}</p>
              </div>
            )}

            <div className="grid lg:grid-cols-2 max-w-4xl gap-5 mx-auto">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 w-full"
              >
                <div>
                  <label className="text-base text-[color:var(--black-one)] mb-0.5">
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    placeholder={t("email")}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setFormState({ ...formState, email: e.target.value });
                      if (emailError) setEmailError("");
                    }}
                    className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] text-base font-light border rounded-sm px-2.5"
                  />
                  {emailError && (
                    <p className="text-red-600 text-[12px] mt-1">{emailError}</p>
                  )}
                </div>

                <div>
                  <label className="text-base text-[color:var(--black-one)] mb-0.5">
                    {props.orderNumberInput}
                  </label>
                  <input
                    type="text"
                    value={orderNumber}
                    placeholder={props.orderNumberInput}
                    onChange={(e) => {
                      setOrderNumber(e.target.value);
                      setFormState({ ...formState, orderNumber: e.target.value });
                      if (orderNumberError) setOrderNumberError("");
                    }}
                    className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] text-base font-light border rounded-sm px-2.5"
                  />
                  {orderNumberError && (
                    <p className="text-red-600 text-[12px] mt-1">{orderNumberError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2.5 disabled:opacity-60 tracking-wide w-full bg-[color:var(--color-three)] text-sm font-medium text-white rounded-sm py-2.5 px-5 cursor-pointer"
                >
                  {isSubmitting ? t("loading") : t("submit")}
                </button>
              </form>

              <div className="p-4 bg-[color:var(--auth-color)] text-[color:var(--black-two)] rounded-sm h-fit">
                <div
                  className="prose marker:text-[color:var(--rich-color)] rtl:prose-ul:pr-3 prose-table:!border-[color:var(--rich-color)] prose-tr:!border-[color:var(--rich-color)] prose-th:!border-[color:var(--rich-color)] prose-thead:!border-[color:var(--rich-color)] prose-td:!border-[color:var(--rich-color)] prose-p:[color:#374151] prose-headings:!text-[color:var(--rich-color)] prose-sm w-full"
                  dangerouslySetInnerHTML={{ __html: props.pageDescription || "" }}
                />
              </div>
            </div>
          </div>
        )}

        {order && (
          <div className="md:layout flex flex-col md:flex-row md:justify-center gap-12 items-start w-full">
            <div className="flex group cursor-pointer" onClick={() => { setOrder(undefined); setOrderTransactions(undefined); }}>
              <button
                className="text-[color:var(--gray-five)] group-hover:text-[color:var(--color-four)] leading-none flex items-center justify-start gap-1.5 cursor-pointer transition-all duration-200"
              >
                <span className="text-[color:var(--gray-five)] group-hover:text-[color:var(--color-four)] transition-all duration-200">
                  <BackSvg />
                </span>
                {t("back")}
              </button>
            </div>
            <Orderdetail order={order} refundEmailAddress={email} />
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(OrderTracking);