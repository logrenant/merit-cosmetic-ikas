import { observer } from "mobx-react-lite";
import useOrders from "../../utils/useOrders";
import { Image, Link, formatDate } from "@ikas/storefront";
import React from "react";
import { IkasOrderPackageStatus, useTranslation } from "@ikas/storefront";
import Pricedisplay from "./pricedisplay";

const Orders = () => {
  const { isPending, orders } = useOrders();
  const { t } = useTranslation();
  return (
    <div>
      {isPending && (
        <div className="flex items-center justify-center h-[411px]">
          <div className="customloader" />
        </div>
      )}
      {!isPending && orders.length === 0 && (
        <div className="flex flex-col">
          <div className="text-left font-light text-lg">{t("emptyOrder")}</div>
          <Link href="/">
            <a className="mt-2 w-min whitespace-nowrap flex items-center justify-center  lg:ml-auto px-4 py-2 bg-[color:var(--color-one)] text-white rounded-sm">
              {t("findProducts")}
            </a>
          </Link>
        </div>
      )}

      {!isPending && !!orders.length && (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[color:var(--bg-color)] grid md:grid-cols-[130px_calc(100%-162px)] gap-8 text-[color:var(--black-two)] rounded-sm border border-[color:var(--black-one)] p-4"
            >
              <div>
                <div className="relative rounded-sm aspect-293/372 w-full overflow-hidden">
                  {order.orderLineItems.filter((e) => e.variant.mainImage)[0]
                    .variant.mainImage?.id && (
                    <Image
                      useBlur
                      image={
                        order.orderLineItems.filter(
                          (e) => e.variant.mainImage
                        )[0].variant.mainImage!
                      }
                      alt={
                        order.orderLineItems.filter(
                          (e) => e.variant.mainImage
                        )[0].variant.name
                      }
                      width="1"
                      height="1"
                      layout="fill"
                      objectFit="contain"
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="text-base flex flex-col mb-1">
                  {order.orderLineItems.map((orderLineItem) => (
                    <span key={orderLineItem.id} className="flex">
                      - {orderLineItem.variant.name}
                    </span>
                  ))}
                </div>
                <div className="flex md:flex-row flex-col mb-2 gap-1 md:items-center justify-between">
                  <div className="text-base flex flex-col gap-0.5 text-[color:var(--black-one)]">
                    <span>
                      {order.orderNumber} |{" "}
                      {order.orderPackageStatus && (
                        <OrderPackageStatus status={order.orderPackageStatus} />
                      )}
                    </span>
                    <div className="flex flex-col">
                      {order!.orderPackages &&
                        order!.orderPackages!.length > 0 &&
                        order!.orderPackages[0]!.trackingInfo?.trackingNumber &&
                        order!.orderPackages.map((el) => (
                          <span key={el.id}>
                            <a
                              href={el.trackingInfo?.trackingLink || ""}
                              target="_blank"
                              className="text-[color:var(--color-three)] mr-2 underline"
                            >
                              {el.trackingInfo?.trackingNumber}
                            </a>
                            ({el!.trackingInfo?.cargoCompany})
                          </span>
                        ))}
                    </div>
                  </div>

                  {order.orderedAt && (
                    <div className="text-base">
                      {formatDate(new Date(order.orderedAt))}
                    </div>
                  )}
                </div>
                <div className="flex mt-auto items-center justify-between">
                  <div className="flex items-center">
                    <div className="md:text-lg flex">
                      {order.orderLineItems.reduce(
                        (acc, orderLineItem) => acc + orderLineItem.quantity,
                        0
                      )}{" "}
                      {t("product")} -{" "}
                      <Pricedisplay
                        amount={order.totalFinalPrice}
                        center={false}
                        currencyCode={order.currencyCode || "USD"}
                        currencySymbol={order.currencySymbol || "$"}
                      />
                    </div>
                  </div>
                  <Link href={`/account/orders/${order.id}`}>
                    <a className="flex items-center justify-center w-min px-4 py-2 bg-[color:var(--color-one)] text-white rounded-sm">
                      {t("details")}
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default observer(Orders);

export const OrderPackageStatus = observer(
  (props: { status: IkasOrderPackageStatus }) => {
    const status: {
      text: string;
      color: "black" | "green" | "red";
    } = {
      text: getOrderPackageStatusText(props.status),
      color: "black",
    };

    switch (props.status) {
      case IkasOrderPackageStatus.FULFILLED:
      case IkasOrderPackageStatus.PARTIALLY_FULFILLED:
      case IkasOrderPackageStatus.DELIVERED:
      case IkasOrderPackageStatus.PARTIALLY_DELIVERED:
        status.color = "green";
        break;

      case IkasOrderPackageStatus.CANCELLED:
      case IkasOrderPackageStatus.PARTIALLY_CANCELLED:
      case IkasOrderPackageStatus.CANCEL_REJECTED:
      case IkasOrderPackageStatus.CANCEL_REQUESTED:
        status.color = "red";
        break;

      default:
        break;
    }

    return <span style={{ color: status.color }}>{status.text}</span>;
  }
);

export function getOrderPackageStatusText(status: IkasOrderPackageStatus) {
  const { t } = useTranslation();

  // orderPackageStatus i18n Text helper
  const text = (key: string) => t(`orderPackageStatus.${key}`);

  switch (status) {
    case IkasOrderPackageStatus.UNFULFILLED:
      return text(`unfulfilled`);

    case IkasOrderPackageStatus.READY_FOR_SHIPMENT:
      return text(`readyForShipment`);

    case IkasOrderPackageStatus.PARTIALLY_FULFILLED:
      return text(`partiallyFulfilled`);

    case IkasOrderPackageStatus.FULFILLED:
      return text(`fulfilled`);

    case IkasOrderPackageStatus.DELIVERED:
      return text(`delivered`);

    case IkasOrderPackageStatus.PARTIALLY_DELIVERED:
      return text(`partiallyDelivered`);

    case IkasOrderPackageStatus.UNABLE_TO_DELIVER:
      return text(`unableToDeliver`);

    case IkasOrderPackageStatus.CANCELLED:
      return text(`cancelled`);

    case IkasOrderPackageStatus.PARTIALLY_CANCELLED:
      return text(`partiallyCancelled`);

    case IkasOrderPackageStatus.CANCEL_REJECTED:
      return text(`cancelRejected`);

    case IkasOrderPackageStatus.REFUNDED:
      return text(`refunded`);

    case IkasOrderPackageStatus.PARTIALLY_REFUNDED:
      return text(`partiallyRefunded`);

    case IkasOrderPackageStatus.REFUND_REQUEST_ACCEPTED:
      return text(`refundRequestAccepted`);

    case IkasOrderPackageStatus.REFUND_REJECTED:
      return text(`refundRejected`);

    case IkasOrderPackageStatus.REFUND_REQUESTED:
      return text(`refundRequested`);

    default:
      return "";
  }
}
