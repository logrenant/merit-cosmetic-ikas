import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { IkasOrder, useStore, useTranslation } from "@ikas/storefront";

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
  const [hasError, setHasError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [orderNumberError, setOrderNumberError] = useState("");
  const [order, setOrder] = useState<IkasOrder>();

  const [formState, setFormState] = useState({
    email: '',
    orderNumber: '',
  });

  const validate = () => {
    const e: Partial<Record<keyof typeof formState, string>> = {};

    // email format
    if (formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      e.email = props.emailRule;
    }
    // order number numeric
    if (formState.orderNumber) {
      const phonePattern = /^\+?\d{2,8}$/;
      const isValidPhone = phonePattern.test(
        formState.orderNumber.replace(/\s+/g, '')
      );

      if (!isValidPhone) {
        e.orderNumber = props.orderNumberRule;
      }
    }
    return Object.keys(e).length === 0;
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoginError("");
    setEmailError("");
    setOrderNumberError("");
    setHasError(false);
    setOrder(undefined);

    // Validate form
    if (!validate()) return;

    if (email.length === 0) {
      setEmailError(props.emailRule ?? "");
      return;
    }
    if (orderNumber.length === 0) {
      setOrderNumberError(props.orderNumberRule ?? "");
      return;
    }

    const emailExists = await store.customerStore.checkEmail(email.trim().toLowerCase());

    if (emailExists && store.customerStore.customer) {
      setHasError(true);
      return;
    }


    try {

      const response = await store.customerStore.getOrderByEmail(
        email.trim().toLowerCase(),
        orderNumber.trim()
      );

      if (response) {
        setOrder(response);
      } else {
        setHasError(true);
      }
    } catch (err) {
      console.error(err);
      setHasError(true);
    } finally {
      setOrderNumberError("");
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

      <div className="layout flex xl:flex-row justify-center flex-col gap-12 my-10">
        {!order && (
          <div
            className={`flex flex-row gap-12`}
          >
            <form
              onSubmit={handleSubmit}
              className={`flex flex-col gap-3 w-full ${order && "w-[30%]"}`}
            >
              <div>
                <label className="text-base text-[color:var(--black-one)] mb-0.5">
                  *{t("email")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] text-base font-light border rounded-sm px-2.5"
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-500">{emailError}</p>
                )}
              </div>

              <div>
                <label className="text-base text-[color:var(--black-one)] mb-0.5">
                  *{props.orderNumberInput}
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] text-base font-light border rounded-sm px-2.5"
                />
                {orderNumberError && (
                  <p className="mt-1 text-sm text-red-500">{orderNumberError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!email || !orderNumber}
                className="mt-2.5 disabled:opacity-60 tracking-wide w-full bg-[color:var(--color-three)] text-sm font-medium text-white rounded-sm py-2.5 px-5 cursor-pointer"
              >
                {t("submit")}
              </button>
              {hasError && (
                <div className="p-3 text-red-600">
                  {props.orderCannotFound}
                </div>
              )}
              {/* {loginError && (
                <p className="p-3 text-red-600">{props.loginRequired}</p>
              )} */}
            </form>
            {!order && (
              <div className={`p-4 bg-[color:var(--auth-color)] text-[color:var(--black-two)] rounded-sm min-w-[40%] max-w-[40%]`}>
                <div
                  className="prose marker:text-[color:var(--rich-color)] rtl:prose-ul:pr-3 prose-table:!border-[color:var(--rich-color)] prose-tr:!border-[color:var(--rich-color)] prose-th:!border-[color:var(--rich-color)] prose-thead:!border-[color:var(--rich-color)] prose-td:!border-[color:var(--rich-color)] prose-p:[color:#374151] prose-headings:!text-[color:var(--rich-color)] max-w-none prose-sm xl:w-4/5"
                  dangerouslySetInnerHTML={{ __html: props.pageDescription || "" }}
                />
              </div>
            )}
          </div>
        )}

        {order && (
          <div className="layout flex flex-row gap-12 items-start">
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
