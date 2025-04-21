// hooks/usePublicOrderDetail.ts
import { useState, useEffect } from "react";
import { IkasOrder } from "@ikas/storefront";

export interface UsePublicOrderDetailReturn {
  order: IkasOrder | null;
  isPending: boolean;
  error: string | null;
}

/**
 * Bu hook, yalnızca e-posta ve sipariş id'si (orderId) verildiğinde,
 * auth gerektirmeyen şekilde sipariş detayını getirir.
 *
 * @param email - Müşterinin e-posta adresi
 * @param orderId - Sipariş id'si
 * @returns { order, isPending, error } bilgilerini içeren hook dönüşü
 */
export default function usePublicOrderDetail(
  email: string,
  orderId: string
): UsePublicOrderDetailReturn {
  const [order, setOrder] = useState<IkasOrder | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email || !orderId) return;

    setIsPending(true);
    setError(null);

    async function fetchOrder() {
      try {
        const url = `/api/public/order?email=${encodeURIComponent(email)}&orderId=${encodeURIComponent(orderId)}`;
        const res = await fetch(url);

        if (!res.ok) {
          // Hata detaylarını almaya çalışalım
          let errorMessage = `HTTP Error ${res.status}`;
          try {
            const errorData = await res.json();
            if (errorData.message) {
              errorMessage += `: ${errorData.message}`;
            }
          } catch (jsonErr) {
            // Eğer body JSON değilse text olarak alalım
            const errorText = await res.text();
            if (errorText) {
              errorMessage += `: ${errorText}`;
            }
          }
          throw new Error(errorMessage);
        }

        const data: IkasOrder = await res.json();
        if (!data) {
          throw new Error("Sipariş bulunamadı.");
        }
        setOrder(data);
      } catch (err: any) {
        console.error("Error fetching order:", err);
        setError(err.message || "Beklenmeyen bir hata oluştu.");
      } finally {
        setIsPending(false);
      }
    }

    fetchOrder();
  }, [email, orderId]);

  return { order, isPending, error };
}
