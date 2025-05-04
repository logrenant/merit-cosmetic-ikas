import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { IkasOrder, useStore, useTranslation } from "@ikas/storefront";
import Orderdetail from "../orderdetail";
import { OrderTrackingProps } from "../__generated__/types";

const OrderTracking = (props: OrderTrackingProps) => {
    const { t } = useTranslation();
    const store = useStore();

    const [email, setEmail] = useState("");
    const [orderNumber, setOrderNumber] = useState("");
    const [hasError, setHasError] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [orderNumberError, setOrderNumberError] = useState("");
    const [order, setOrder] = useState<IkasOrder>();

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
        <div className="layout flex flex-col gap-6 p-6 rounded my-14">
            <h2 className="text-2xl font-bold text-center">{props?.pageTitle}</h2>

            <div
                className={`flex w-full ${order
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
                    <div className="relative border border-[color:var(--input-color)] p-4 rounded w-full xl:min-w-[70%] xl:max-w-[70%]">
                        <button
                            className="absolute top-6 right-8 text-[color:var(--black-one)] hover:text-[color:var(--color-three)] text-lg font-bold"
                            onClick={() => setOrder(undefined)}
                        >
                            ×
                        </button>
                        <Orderdetail order={order} refundEmailAddress={email} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default observer(OrderTracking);
