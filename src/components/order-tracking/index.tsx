import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { IkasOrder, useStore, useTranslation } from "@ikas/storefront";

import Orderdetail from "../orderdetail";
import { useDirection } from "src/utils/useDirection";
import { OrderTrackingProps } from "../__generated__/types";

const OrderTracking = (props: OrderTrackingProps) => {
    const store = useStore();
    const { t } = useTranslation();
    const { direction } = useDirection();

    const [email, setEmail] = useState("");
    const [orderNumber, setOrderNumber] = useState("");
    const [hasError, setHasError] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [orderNumberError, setOrderNumberError] = useState("");
    const [order, setOrder] = useState<IkasOrder>();
    const [isPending, setPending] = useState(true);
    const [isRefundProcess, toggleRefundProcess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setOrder(undefined);
        setHasError(false);

        if (email.length === 0) {
            setEmailError(t("tracking.emptyEmailError"));
            return;
        }
        if (orderNumber.length === 0) {
            setOrderNumberError(t("tracking.emailOrderNumber"));
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
            setEmailError("");
            setOrderNumberError("");
        }
    };

    useEffect(() => {
        setOrder(undefined);
        setHasError(false);
    }, []);

    return (
        <div dir={direction}>
            <div className="flex flex-col gap-12 my-10">
                <div className="flex items-center gap-4 border-b-[4px] border-[color:var(--color-five)] pb-6 justify-center">
                    <h1 className="text-lg px-4 relative font-medium text-[color:var(--color-one)] ">
                        {props?.pageTitle}
                        <span className="absolute left-0 bottom-[-28px] h-[4px] w-full bg-[color:var(--color-one)]"></span>
                    </h1>
                </div>
                <div
                    className={`flex w-full layout ${order
                        ? "flex-col xl:flex-row items-start gap-12"
                        : "justify-center items-center"
                        }`}
                >
                    <form
                        onSubmit={handleSubmit}
                        className={`flex flex-col gap-4 ${order
                            ? "w-full"
                            : "w-full md:w-1/2 lg:w-1/3"
                            }`}
                    >
                        {hasError && (
                            <div className="p-3 text-red-800 rounded">
                                {t("common:tracking.orderTrackingError")}
                            </div>
                        )}

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
                                *{t("orderNumber")}
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
                    </form>

                    {order && (
                        <div className="w-full xl:min-w-[70%] xl:max-w-[70%]">
                            <Orderdetail order={order} refundEmailAddress={email} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default observer(OrderTracking);
