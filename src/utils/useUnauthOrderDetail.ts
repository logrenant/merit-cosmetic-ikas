// useUnauthOrderDetail.ts
import { useState } from 'react';
import { useStore } from '@ikas/storefront';

type IkasOrder = any;

interface UseUnauthOrderDetailReturn {
  isPending: boolean;
  order: IkasOrder | undefined;
  orderedAt: string;
  isRefundProcess: boolean;
  toggleRefundProcess: () => void;
  getOrder: (email: string, orderNumber: string) => Promise<void>;
}

export function useUnauthOrderDetail(): UseUnauthOrderDetailReturn {
    const store = useStore();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [order, setOrder] = useState<IkasOrder | undefined>(undefined);
  const [isRefundProcess, setIsRefundProcess] = useState<boolean>(false);

  const getOrder = async (email: string, orderNumber: string): Promise<void> => {
    setIsPending(true);
    try {
      const orderData: IkasOrder = await store.customerStore.getOrderByEmail(email, orderNumber);
      setOrder(orderData);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      setOrder(undefined);
    } finally {
      setIsPending(false);
    }
  };

  const toggleRefundProcess = (): void => {
    setIsRefundProcess((prev) => !prev);
  };

  const orderedAt = order
    ? new Date(order.createdAt).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return {
    isPending,
    order,
    orderedAt,
    isRefundProcess,
    toggleRefundProcess,
    getOrder,
  };
}
