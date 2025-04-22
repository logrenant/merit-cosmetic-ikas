import React, { useState } from "react";
import { formatDate } from "@ikas/storefront";
import useUnauthOrder from "src/utils/useUnauthOrder";
import { observer } from "mobx-react-lite";


const OrderTracking = () => {

    const { order, error, isPending, fetchOrder } = useUnauthOrder();
    const [email, setEmail] = useState("");
    const [orderNumber, setOrderNumber] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchOrder(email.trim().toLowerCase(), orderNumber.trim());
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    required
                />
                <button type="submit" disabled={isPending}>
                    {isPending ? "Sorgulanıyor..." : "Siparişi Bul"}
                </button>
            </form>

            {isPending && <p>Yükleniyor...</p>}
            {error && <p>{error}</p>}
            {order && (
                <div>
                    <p>Sipariş Numarası: {order.orderNumber}</p>
                    <p>Sipariş Tarihi: {order.orderedAt ? formatDate(new Date(order.orderedAt)) : "Bilinmiyor"}</p>
                    <p>Toplam Tutar: {order.formattedTotalFinalPrice}</p>
                    {/* Diğer sipariş bilgileri burada gösterilebilir */}
                </div>
            )}
        </div>
    );
}

export default observer(OrderTracking)