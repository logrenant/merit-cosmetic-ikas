import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { IkasOrder, useStore, useTranslation } from "@ikas/storefront";

import Orderdetail from "../orderdetail";
import { useDirection } from "src/utils/useDirection";
import { OrderTrackingProps } from "../__generated__/types";
import BackSvg from "../svg/BackSvg";
import login from "../login";

const OrderTracking = (props: OrderTrackingProps) => {
  const store = useStore();
  const { t } = useTranslation();
  const { direction } = useDirection();

  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [hasError, setHasError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [orderNumberError, setOrderNumberError] = useState("");
  const [order, setOrder] = useState<IkasOrder>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

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

    // Reset all errors
    setLoginError("");
    setEmailError("");
    setOrderNumberError("");
    setHasError(false);
    setGeneralError(null);
    setOrder(undefined);
    setIsSubmitting(true);

    // Form validation for email format and order number format
    if (formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      setEmailError(props.emailRule ?? "");
      setGeneralError(props.emailRule ?? "");
      setIsSubmitting(false);
      return;
    }

    if (formState.orderNumber) {
      const orderPattern = /^\+?\d{2,8}$/;
      const isValidOrder = orderPattern.test(
        formState.orderNumber.replace(/\s+/g, '')
      );

      if (!isValidOrder) {
        setOrderNumberError(props.orderNumberRule ?? "");
        setGeneralError(props.orderNumberRule ?? "");
        setIsSubmitting(false);
        return;
      }
    }

    if (email.length === 0) {
      setEmailError(props.emailRule ?? "");
      setGeneralError(props.emailRule ?? "");
      setIsSubmitting(false);
      return;
    }
    if (orderNumber.length === 0) {
      setOrderNumberError(props.orderNumberRule ?? "");
      setGeneralError(props.orderNumberRule ?? "");
      setIsSubmitting(false);
      return;
    }

    // const emailExists = await store.customerStore.checkEmail(email.trim().toLowerCase());

    // if (emailExists && store.customerStore.customer) {
    //   setHasError(true);
    //   setGeneralError(props.orderCannotFound ?? "");
    //   setIsSubmitting(false);
    //   return;
    // }

    try {
      const response = await store.customerStore.getOrderByEmail(
        email.trim().toLowerCase(),
        orderNumber.trim()
      );

      if (response) {
        setOrder(response);
        setIsSuccess(true);
      } else {
        setHasError(true);
        setGeneralError(props.orderCannotFound ?? "");
      }
    } catch (err) {
      console.error(err);
      setHasError(true);
      setGeneralError(props.orderCannotFound ?? "");
    } finally {
      setOrderNumberError("");
      setIsSubmitting(false);
    }
  };


  return (
    <div dir={direction}>
      <div className="flex items-center gap-4 border-b-[4px] border-[color:var(--color-five)] py-6  justify-center">
        <h1 className="text-lg px-4 relative font-medium text-[color:var(--color-one)] ">
          {props?.pageTitle}
          <span className="absolute left-0 bottom-[-28px] h-[4px] w-full bg-[color:var(--color-one)]"></span>
        </h1>
      </div>

      <div className="layout flex flex-col xl:flex-row justify-center gap-12 my-10">
        {!order && (
          <div
            className={`flex flex-col xl:flex-row gap-12 w-full`}
          >
            <form
              onSubmit={handleSubmit}
              className={`flex flex-col gap-3 w-full xl:w-[60%]`}
            >
              {/* Error Messages Box */}
              {(hasError || emailError || orderNumberError) && (
                <div className="mb-6 p-4 bg-[color:var(--auth-color)] text-[color:var(--black-two)] rounded-sm">
                  {hasError && (
                    <p>{props.orderCannotFound}</p>
                  )}
                  {emailError && (
                    <p>{emailError}</p>
                  )}
                  {orderNumberError && (
                    <p>{orderNumberError}</p>
                  )}
                </div>
              )}

              <div>
                <label className="text-base text-[color:var(--black-one)] mb-0.5">
                  *{t("email")}
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
              </div>

              <div>
                <label className="text-base text-[color:var(--black-one)] mb-0.5">
                  *{props.orderNumberInput}
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
              </div>

              <button
                type="submit"
                className="mt-2.5 disabled:opacity-60 tracking-wide w-full bg-[color:var(--color-three)] text-sm font-medium text-white rounded-sm py-2.5 px-5 cursor-pointer"
              >
                {isSubmitting ? t("loading") : t("submit")}
              </button>
            </form>

            {/* Description panel - Always visible with fixed width */}
            <div className={`p-4 bg-[color:var(--auth-color)] text-[color:var(--black-two)] rounded-sm xl:w-[40%]`}>
              <div
                className="prose marker:text-[color:var(--rich-color)] rtl:prose-ul:pr-3 prose-table:!border-[color:var(--rich-color)] prose-tr:!border-[color:var(--rich-color)] prose-th:!border-[color:var(--rich-color)] prose-thead:!border-[color:var(--rich-color)] prose-td:!border-[color:var(--rich-color)] prose-p:[color:#374151] prose-headings:!text-[color:var(--rich-color)] prose-sm w-full"
                dangerouslySetInnerHTML={{ __html: props.pageDescription || "" }}
              />
            </div>
          </div>
        )}

        {order && (
          <div className="md:layout flex flex-col md:flex-row md:justify-center gap-12 items-start w-full">
            <div className="flex group cursor-pointer" onClick={() => setOrder(undefined)}>
              <button
                className="text-[color:var(--gray-five)] group-hover:text-[color:var(--black-two)] leading-none flex items-center justify-start gap-1.5"
              >
                <span className="text-[color:var(--gray-five)] group-hover:text-[color:var(--black-two)] transition-all duration-200">
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
