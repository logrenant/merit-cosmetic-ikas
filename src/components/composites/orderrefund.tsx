import React, { useState } from "react";
import {
  IkasOrder,
  IkasOrderLineItem,
  IkasOrderLineItemStatus,
  Image,
  useStore,
  useTranslation,
} from "@ikas/storefront";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { toast } from "react-hot-toast";
import Pricedisplay from "./pricedisplay";

const RefundQuantitySelect = observer(
  (props: { orderLineItem: IkasOrderLineItem }) => {
    const quantityOptions = useMemo(() => {
      const quantities = [];

      for (let i = 0; i <= props.orderLineItem.quantity; i++) {
        quantities.push({ label: `${i}`, value: `${i}` });
      }
      return quantities;
    }, [props.orderLineItem]);

    return (
      <select
        placeholder="Quantity"
        className="w-full max-w-[100px] border-[color:var(--black-two)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-transparent relative z-[1] text-xs mt-2 font-light border rounded px-2.5"
        value={props.orderLineItem.refundQuantity || "0"}
        onChange={(value) => {
          props.orderLineItem.refundQuantity =
            value.target.value === "-1"
              ? null
              : parseInt(value.target.value as string);
        }}
      >
        {quantityOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

const OrderRefund = ({ order }: { order: IkasOrder }) => {
  const store = useStore();
  const { t } = useTranslation();
  const [isRefundedSuccess, setIsRefundedSuccess] = useState(false);

  const refundableItems = useMemo(() => {
    if (!order?.orderLineItems) return [];
    return order.orderLineItems.filter((item) => {
      return [
        IkasOrderLineItemStatus.DELIVERED,
        IkasOrderLineItemStatus.FULFILLED,
      ].includes(item.status);
    });
  }, [order?.orderLineItems]);

  const RefundButton = observer(() => {
    const disabled = refundableItems.every(
      (item) => item.refundQuantity === null
    );

    const onClick = async () => {
      const response = await store.customerStore.refundOrder(order);

      if (response) {
        setIsRefundedSuccess(true);
      } else {
        toast.error(t("orderDetail.refund.refundError"));
      }
    };

    let selectedRefundItemQuantity = 0;
    refundableItems.forEach(
      (oLI) => (selectedRefundItemQuantity += oLI.refundQuantity || 0)
    );

    return (
      <button
        className="mt-2.5 disabled:opacity-60 tracking-wide w-min whitespace-nowrap bg-[color:var(--color-three)] text-sm font-medium text-white rounded py-2.5 px-5 cursor-pointer"
        disabled={disabled}
        onClick={onClick}
      >
        {selectedRefundItemQuantity
          ? t("orderDetail.refund.refundButton", {
            quantity: "" + selectedRefundItemQuantity,
          })
          : t("orderDetail.refund.refundButtonNoItem")}
      </button>
    );
  });

  const RefundSuccessUI = () => {
    const { t } = useTranslation();
    return (
      <div className="text-lg flex flex-col py-4">
        <span> {t("orderDetail.refund.refundSuccess")}</span>
        <button
          onClick={() => {
            window.location.reload();
          }}
          className="flex text-sm whitespace-nowrap mt-2 items-center justify-center w-min px-4 py-2 bg-[color:var(--color-one)] text-white rounded cursor-pointer"
        >
          {t("back")}
        </button>
      </div>
    );
  };

  const OrderRefundLineItems = observer(() => {
    return (
      <div className="grid divide-y divide-[color:var(--gray-six)] grid-cols-1 mt-8">
        {refundableItems.map((orderLineItem) => (
          <div key={orderLineItem.id} className="flex py-4">
            <div className="relative rounded aspect-[293/372] w-full overflow-hidden min-w-[80px] max-w-[80px]">
              <Image
                image={orderLineItem.variant.mainImage!}
                alt={orderLineItem.variant.mainImage?.altText || ""}
                useBlur
                layout="fill"
              />
            </div>
            <div className="flex flex-col ml-4">
              <div className="text-base lg:text-lg">
                {orderLineItem.variant.name}
              </div>
              <div className="text-sm text-[color:var(--gray-three)]">
                {orderLineItem.variant.sku}
              </div>
              <div className="text-sm text-[color:var(--gray-three)]">
                {t("quantity")}: {orderLineItem.quantity}
              </div>
              <div className="text-sm text-[color:var(--gray-three)]">
                {t("price")}:{" "}
                <Pricedisplay
                  center={false}
                  amount={orderLineItem.finalPriceWithQuantity}
                  currencyCode={orderLineItem.currencyCode || "USD"}
                  currencySymbol={orderLineItem.currencySymbol || "$"}
                />
              </div>

              <RefundQuantitySelect orderLineItem={orderLineItem} />
            </div>
          </div>
        ))}
      </div>
    );
  });

  return (
    <>
      {isRefundedSuccess && <RefundSuccessUI />}
      {!isRefundedSuccess && (
        <>
          <OrderRefundLineItems />
          <RefundButton />
        </>
      )}
    </>
  );
};

export default observer(OrderRefund);