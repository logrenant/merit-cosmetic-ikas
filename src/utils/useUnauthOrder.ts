import { useState } from "react";
import { useStore, IkasOrder } from "@ikas/storefront";

export default function useUnauthOrder() {
  const store = useStore();
  const [order, setOrder] = useState<IkasOrder | null>(null);
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (email: string, orderNumber: string) => {
    setPending(true);
    setError(null);
    try {
      console.log("API Request Params:", { email, orderNumber });
      const result = await store.customerStore.getOrderByEmail(email, orderNumber);
      console.log("API Response:", result);
      
      if (result?.id) { // Daha güvenli kontrol
        setOrder(result);
      } else {
        setError("Sipariş bulunamadı. Lütfen bilgilerinizi kontrol edin.");
      }
    } catch (e: any) {
      console.error("API Error:", e);
      setError(e.message || "Teknik bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setPending(false);
    }
  };


  return {
    order,
    isPending,
    error,
    fetchOrder,
  };
}