// components/OrderTracking.tsx
import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import usePublicOrderDetail from "src/utils/usePublicOrderDetail";

interface OrderTrackingProps { }

function OrderTracking(props: OrderTrackingProps) {
    // Form için input state'leri
    const [formEmail, setFormEmail] = useState<string>("");
    const [formOrderId, setFormOrderId] = useState<string>("");
    const [submitted, setSubmitted] = useState<boolean>(false);

    // Email ve orderId ile sipariş detaylarını getiren hook'u kullanıyoruz
    const { order, isPending, error } = usePublicOrderDetail(formEmail, formOrderId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formEmail || !formOrderId) return;
        setSubmitted(true);
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block mb-1 font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="orderId" className="block mb-1 font-medium">
                            Sipariş ID
                        </label>
                        <input
                            id="orderId"
                            type="text"
                            value={formOrderId}
                            onChange={(e) => setFormOrderId(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Takip Et
                    </button>
                </form>
            ) : (
                <>
                    {isPending && <p>Yükleniyor...</p>}
                    {error && <p className="text-red-600">{error}</p>}
                    {order ? (
                        <div className="mt-8 p-4 border border-gray-200 rounded shadow">
                            <h1 className="text-2xl font-bold mb-4">Sipariş Detayları</h1>
                            <p>
                                <strong>Sipariş Numarası:</strong> {order.orderNumber}
                            </p>
                            <p>
                                <strong>Durum:</strong> {order.status}
                            </p>
                            <p>
                                <strong>Sipariş Tarihi:</strong>{" "}
                                {order.orderedAt ? new Date(order.orderedAt).toLocaleString() : "Bilinmiyor"}
                            </p>
                            <p>
                                <strong>Toplam Fiyat:</strong> {order.totalPrice}
                            </p>

                            {order.orderPackages && order.orderPackages.length > 0 && (
                                <div className="mt-6">
                                    <h2 className="text-xl font-semibold mb-2">Takip Bilgileri</h2>
                                    {order.orderPackages.map((pkg, index) => (
                                        <div key={index} className="border p-3 mb-3 rounded">
                                            {pkg.trackingInfo ? (
                                                <>
                                                    <p>
                                                        <strong>Kargo Firması:</strong> {pkg.trackingInfo.cargoCompany || "Bilinmiyor"}
                                                    </p>
                                                    <p>
                                                        <strong>Takip Numarası:</strong> {pkg.trackingInfo.trackingNumber || "Bilinmiyor"}
                                                    </p>
                                                    {pkg.trackingInfo.barcode && (
                                                        <p>
                                                            <strong>Barcode:</strong> {pkg.trackingInfo.barcode}
                                                        </p>
                                                    )}
                                                    {pkg.trackingInfo.trackingLink && (
                                                        <p>
                                                            <strong>Takip Linki:</strong>{" "}
                                                            <a
                                                                href={pkg.trackingInfo.trackingLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 underline"
                                                            >
                                                                {pkg.trackingInfo.trackingLink}
                                                            </a>
                                                        </p>
                                                    )}
                                                    <p>
                                                        <strong>Bildirim Gönderilsin mi?:</strong>{" "}
                                                        {pkg.trackingInfo.isSendNotification ? "Evet" : "Hayır"}
                                                    </p>
                                                </>
                                            ) : (
                                                <p>Takip bilgisi mevcut değil.</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        !isPending && <p>Sipariş bulunamadı.</p>
                    )}
                </>
            )}
        </div>
    );
}

export default observer(OrderTracking);
