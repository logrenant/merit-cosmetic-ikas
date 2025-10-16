// components/Orders.tsx
import React from "react";
import { observer } from "mobx-react-lite";
import useOrders from "../../utils/useOrders";
import { Image, Link, formatDate } from "@ikas/storefront";
import {
  IkasOrderPackageStatus,
  useTranslation,
} from "@ikas/storefront";
import Pricedisplay from "./pricedisplay";
import { useRouter } from "next/router";

const Orders = () => {
  const { isPending, orders } = useOrders();
  const { t } = useTranslation();
  const router = useRouter();

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-[411px]">
        <div className="customloader" />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col">
        <div className="text-left font-light text-lg">
          {t("emptyOrder")}
        </div>
        <Link href="/">
          <a className="mt-2 w-min whitespace-nowrap flex items-center justify-center lg:ml-auto px-4 py-2 bg-[color:var(--color-one)] text-white rounded-sm">
            {t("findProducts")}
          </a>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {orders.map((order) => {
        const variantWithImage = order.orderLineItems.find(
          (e) => !!e.variant.mainImage?.id
        );

        const fallbackItem = order.orderLineItems[0];
        console.log("Variant objesi:", fallbackItem.variant);

        const fallbackImage =
          (fallbackItem.variant as any).images?.[0] ?? null;

        const imageToShow =
          variantWithImage?.variant.mainImage ||
          fallbackImage;

        return (
          <div
            key={order.id}
            className="bg-[color:var(--bg-color)] grid md:grid-cols-[130px_calc(100%-162px)] gap-8 text-[color:var(--black-two)] rounded-sm border border-[color:var(--black-one)] p-4"
          >
            {/* Görsel */}
            <div>
              <div className="relative rounded-sm aspect-293/372 w-full overflow-hidden">
                {imageToShow && (
                  <Image
                    useBlur
                    image={imageToShow}
                    alt={
                      variantWithImage
                        ? variantWithImage.variant.name
                        : fallbackItem.variant.name
                    }
                    layout="fill"
                    objectFit="contain"
                  />
                )}
              </div>
            </div>

            {/* Detaylar */}
            <div className="flex flex-col">

              {/* Sipariş numarası, durum, kargo */}
              <div className="flex md:flex-row flex-col mb-2 gap-1 justify-between bg-[color:var(--color-one)] text-white px-2 py-1 rounded-sm">
                <div className="text-base flex flex-col gap-0.5">
                  <span>
                    {order.orderNumber} |{" "}
                    {order.orderPackageStatus && (
                      <OrderPackageStatus
                        status={order.orderPackageStatus}
                      />
                    )}
                  </span>
                  {order.orderPackages
                    ?.filter((pkg) => pkg.trackingInfo?.trackingNumber)
                    .map((pkg) => (
                      <span key={pkg.id}>
                        <a
                          href={pkg.trackingInfo?.trackingLink || ""}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {pkg.trackingInfo?.trackingNumber}
                        </a>
                        {" "}
                        ({pkg.trackingInfo?.cargoCompany})
                      </span>
                    ))}
                </div>

                {/* Tarih */}
                {order.orderedAt && (
                  <div className="text-base">
                    {formatDate(
                      new Date(order.orderedAt)
                    )}
                  </div>
                )}
              </div>

              {/* Ürün adları */}
              <div className="text-base flex flex-col mb-1">
                {order.orderLineItems.map((item) => (
                  <span key={item.id} className="flex">
                    - {item.variant.name}
                  </span>
                ))}
              </div>

              {/* Adet & Fiyat */}
              <div className="flex mt-auto items-center justify-between">
                <div className="flex flex-row items-center">
                  <div className="flex flex-row gap-1">
                    <span>
                      {order.orderLineItems.reduce(
                        (acc, i) => acc + i.quantity,
                        0
                      )}
                    </span>
                    <span>
                      {(() => {
                        const quantity = order.orderLineItems.reduce(
                          (acc, i) => acc + i.quantity,
                          0
                        );
                        const isArabic = router.locale === "ar";

                        if (quantity === 1) {
                          return isArabic ? "منتج" : "Product";
                        } else {
                          return isArabic ? "منتجات" : "Products";
                        }
                      })()}
                    </span>
                    <Pricedisplay
                      amount={order.totalFinalPrice}
                      center={false}
                      currencyCode={
                        order.currencyCode || "USD"
                      }
                      currencySymbol={
                        order.currencySymbol || "$"
                      }
                    />
                  </div>
                </div>
                <Link href={`/account/orders/${order.id}`}>
                  <a className="flex items-center justify-center w-min px-4 py-2 bg-[color:var(--color-one)] text-white rounded-sm mt-4">
                    {t("details")}
                  </a>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default observer(Orders);

export const OrderPackageStatus = observer(
  (props: { status: IkasOrderPackageStatus }) => {
    const { status: text, color } = (() => {
      let txt = getOrderPackageStatusText(props.status);
      let clr: "black" | "green" | "red" | "orange" = "black";
      switch (props.status) {
        case IkasOrderPackageStatus.FULFILLED:
        case IkasOrderPackageStatus.PARTIALLY_FULFILLED:
        case IkasOrderPackageStatus.DELIVERED:
        case IkasOrderPackageStatus.PARTIALLY_DELIVERED:
        case IkasOrderPackageStatus.REFUNDED:
        case IkasOrderPackageStatus.PARTIALLY_REFUNDED:
        case IkasOrderPackageStatus.REFUND_REQUEST_ACCEPTED:
          clr = "green";
          break;
        case IkasOrderPackageStatus.CANCELLED:
        case IkasOrderPackageStatus.PARTIALLY_CANCELLED:
        case IkasOrderPackageStatus.CANCEL_REJECTED:
        case IkasOrderPackageStatus.CANCEL_REQUESTED:
        case IkasOrderPackageStatus.REFUND_REJECTED:
          clr = "red";
          break;
        case IkasOrderPackageStatus.REFUND_REQUESTED:
          clr = "orange";
          break;
      }
      return { status: txt, color: clr };
    })();

    return <span style={{ color }}>{text}</span>;
  }
);

export function getOrderPackageStatusText(
  status: IkasOrderPackageStatus
) {
  const { t } = useTranslation();
  const txt = (key: string) => t(`orderPackageStatus.${key}`);

  switch (status) {
    case IkasOrderPackageStatus.UNFULFILLED:
      return txt("unfulfilled");
    case IkasOrderPackageStatus.READY_FOR_SHIPMENT:
      return txt("readyForShipment");
    case IkasOrderPackageStatus.PARTIALLY_FULFILLED:
      return txt("partiallyFulfilled");
    case IkasOrderPackageStatus.FULFILLED:
      return txt("fulfilled");
    case IkasOrderPackageStatus.DELIVERED:
      return txt("delivered");
    case IkasOrderPackageStatus.PARTIALLY_DELIVERED:
      return txt("partiallyDelivered");
    case IkasOrderPackageStatus.UNABLE_TO_DELIVER:
      return txt("unableToDeliver");
    case IkasOrderPackageStatus.CANCELLED:
      return txt("cancelled");
    case IkasOrderPackageStatus.PARTIALLY_CANCELLED:
      return txt("partiallyCancelled");
    case IkasOrderPackageStatus.CANCEL_REJECTED:
      return txt("cancelRejected");
    case IkasOrderPackageStatus.REFUNDED:
      return txt("refunded");
    case IkasOrderPackageStatus.PARTIALLY_REFUNDED:
      return txt("partiallyRefunded");
    case IkasOrderPackageStatus.REFUND_REQUEST_ACCEPTED:
      return txt("refundRequestAccepted");
    case IkasOrderPackageStatus.REFUND_REJECTED:
      return txt("refundRejected");
    case IkasOrderPackageStatus.REFUND_REQUESTED:
      return txt("refundRequested");
    default:
      return "";
  }
}
