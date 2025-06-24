import React from "react";
import { observer } from "mobx-react-lite";
import {
  IkasOrder,
  Image,
  formatDate,
  IkasOrderPackageFullfillStatus,
  useTranslation,
  IkasOrderLineItem,
  IkasOrderLineItemStatus,
} from "@ikas/storefront";
import Pricedisplay from "../composites/pricedisplay";

import { OrderPackageStatus } from "../composites/orders";
import { useDirection } from "src/utils/useDirection";
import { useRouter } from "next/router";
import { orderStore } from "src/utils/orderStore";
import Envelope from "../svg/Envelope";



const OrderLineItemRefundStatusComponent = observer(
  ({
    orderLineItemStatus,
  }: {
    orderLineItemStatus: IkasOrderLineItem["status"];
  }) => {
    const status = orderRefundLineItemStatus(orderLineItemStatus);
    if (!status) return null;
    return (
      <span
        className="text-sm uppercase opacity-90 mt-2"
        style={{ color: status.color }}
      >
        {status.text}
      </span>
    );
  }
);

function orderRefundLineItemStatus(
  orderLineItemStatus: IkasOrderLineItemStatus
): { text: string; color: string } | null {
  const { t } = useTranslation();
  const text = (key: string) => t(`orderPackageStatus.${key}`);
  switch (orderLineItemStatus) {
    case IkasOrderLineItemStatus.REFUND_REQUEST_ACCEPTED:
      return { text: text("refundRequestAccepted"), color: "green" };
    case IkasOrderLineItemStatus.REFUNDED:
      return { text: text("refunded"), color: "green" };
    case IkasOrderLineItemStatus.REFUND_REJECTED:
      return { text: text("cancelRefunded"), color: "red" };
    case IkasOrderLineItemStatus.REFUND_REQUESTED:
      return { text: text("refundRequested"), color: "orange" };
    case IkasOrderLineItemStatus.DELIVERED:
      return { text: text("delivered"), color: "green" };
    case IkasOrderLineItemStatus.FULFILLED:
      return { text: text("fulfilled"), color: "green" };
    case IkasOrderLineItemStatus.CANCELLED:
      return { text: text("cancelled"), color: "red" };
    case IkasOrderLineItemStatus.UNFULFILLED:
      return { text: text("unfulfilled"), color: "gray" };

    default:
      return null;
  }
}

export default observer(function Orderdetail({
  order,
  refundEmailAddress,
}: {
  order: IkasOrder;
  refundEmailAddress: string;
}) {
  const { t } = useTranslation();
  const { direction } = useDirection();
  const router = useRouter();

  const handleGoToContact = () => {
    if (order?.orderNumber) {
      orderStore.setOrderNumber(order.orderNumber);
      const fn =
        order?.customer?.firstName ||
        "";
      const ln =
        order?.customer?.lastName ||
        "";
      const em =
        order?.customer?.email ||
        "";
      let ph =
        order?.billingAddress?.phone ||
        order?.shippingAddress?.phone ||
        "";

      orderStore.setFirstName(fn);
      orderStore.setLastName(ln);
      orderStore.setEmail(em);
      orderStore.setPhoneNumber(ph);

      router.push("/pages/order-contact");
    }
  };

  function getPackageTitle(status: IkasOrderPackageFullfillStatus): string {
    const text = (key: string) => t(`orderPackageStatus.${key}`);
    switch (status) {
      case IkasOrderPackageFullfillStatus.DELIVERED:
        return text("delivered");
      case IkasOrderPackageFullfillStatus.READY_FOR_SHIPMENT:
        return text("readyForShipment");
      case IkasOrderPackageFullfillStatus.READY_FOR_PICK_UP:
        return text("readyForPickUp");
      case IkasOrderPackageFullfillStatus.REFUNDED:
        return text("refunded");
      case IkasOrderPackageFullfillStatus.FULFILLED:
        return text("fulfilled");
      case IkasOrderPackageFullfillStatus.UNFULFILLED:
        return text("unfulfilled");
      case IkasOrderPackageFullfillStatus.CANCELLED:
        return text("cancelled");
      case IkasOrderPackageFullfillStatus.REFUND_REQUESTED:
        return text("refundRequested");
      default:
        return "";
    }
  }

  return (
    <div className="flex flex-col gap-12 w-full " dir={direction}>

      {/* Başlık */}
      <div className="flex flex-col mb-4 items-start md:flex-row md:justify-between ">
        <div className="flex flex-col items-start ">
          <div className="text-2xl">
            {`${t("orderDetail.orderDetail")} #${order.orderNumber}`}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <OrderPackageStatus status={order.orderPackageStatus!} />
            <div className="text-sm text-[color:var(--gray-three)]">
              {order.orderedAt
                ? formatDate(new Date(order.orderedAt))
                : "No Date"}
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between items-start">
          <button
            type="button"
            onClick={handleGoToContact}
            className="text-[color:var(--color-three)] hover:text-[color:var(--color-four)] transition-colors duration-200 cursor-pointer flex flex-row items-center gap-2"
          >
            <Envelope />
            <span>{t("contactUs")}</span>
          </button>
        </div>
      </div>

      <div className="flex md:flex-row md:justify-between flex-col w-full">
        {/* Paketler & Ürünler */}
        <div>
          {order.displayedPackages?.map((pkg) => {
            const items = pkg.getOrderLineItems(order);
            return (
              <div key={pkg.id} className="space-y-4">
                <h3 className="text-xl">
                  {getPackageTitle(pkg.orderPackageFulfillStatus)}
                </h3>
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="flex py-4">
                      <div className="relative rounded-sm aspect-293/372 w-full overflow-hidden min-w-[130px] max-w-[130px]">
                        <Image
                          image={item.variant.mainImage!}
                          alt={item.variant.mainImage?.altText || ""}
                          useBlur
                          layout="fill"
                        />
                      </div>
                      <div className="flex text-[color:var(--black-two)] flex-col ml-4">
                        <div className="text-base md:text-lg flex gap-1.5">
                          <span className="line-clamp-3">{item.variant.name} </span>
                          <span className="text-sm">(x{item.quantity})</span>
                        </div>
                        {item.variant.variantValues &&
                          item.variant.variantValues?.length > 0 && (
                            <span className="text-sm text-[color:var(--color-three)]">
                              {item.variant.variantValues
                                ?.map((e) => e.variantValueName)
                                .join(", ")}
                            </span>
                          )}
                        {item.variant.sku &&
                          item.variant.barcodeList &&
                          item.variant.barcodeList?.length > 0 && (
                            <div className="text-sm text-[color:var(--gray-three)]">
                              {item.variant.sku} |{" "}
                              {item.variant.barcodeList?.map((e) => e).join(", ")}
                            </div>
                          )}
                        <div className="flex mt-2 flex-col">
                          {!!item.discountPrice && (
                            <span className="text-lg flex items-center justify-center mr-auto mb-1 whitespace-nowrap leading-none opacity-80 relative">
                              <span className="absolute rotate-6 w-full opacity-70 h-[2px] bg-[color:var(--color-three)] left-0 top-1/2 transform -translate-y-1/2" />
                              <Pricedisplay
                                center={false}
                                amount={item.overridenPriceWithQuantity}
                                currencyCode={item.currencyCode || "USD"}
                                currencySymbol={item.currencySymbol || "$"}
                              />
                            </span>
                          )}
                          <span className="text-xl leading-none">
                            <Pricedisplay
                              center={false}
                              amount={item.finalPriceWithQuantity}
                              currencyCode={item.currencyCode || "USD"}
                              currencySymbol={item.currencySymbol || "$"}
                            />
                          </span>
                        </div>
                        <OrderLineItemRefundStatusComponent
                          orderLineItemStatus={item.status}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col">
          {/* Adresler */}
          <div className="flex flex-col">
            {order.displayedPackages.filter(
              (e) => !!e.trackingInfo?.cargoCompany
            ).length > 0 && (
                <>
                  <div className="text-xl">{t("trackingInfo")}</div>
                  {order.displayedPackages?.map((orderPackage) => (
                    <div className="grid border-b border-b-[color:var(--gray-six)] pb-4 mt-2 mb-4 grid-cols-2 gap-1">
                      <div className="text-[color:var(--gray-three)]">
                        {orderPackage.trackingInfo?.cargoCompany}
                      </div>
                      <div className="text-right">
                        <a
                          href={orderPackage.trackingInfo?.trackingLink || ""}
                          target="_blank"
                          className="text-[color:var(--color-three)] underline"
                        >
                          {orderPackage.trackingInfo?.trackingNumber}
                        </a>
                      </div>
                    </div>
                  ))}
                </>
              )}
            <div className="text-xl">{t("orderDetail.deliveryAddress")}</div>
            <div className="grid border-b border-b-[color:var(--gray-six)] pb-4 mt-2 mb-4 grid-cols-2 gap-1">
              <div className="text-[color:var(--gray-three)]">
                {t("orderDetail.name")}
              </div>
              <div className="text-right">
                {order.shippingAddress?.firstName}{" "}
                {order.shippingAddress?.lastName}
              </div>
              <div className="col-span-2 text-[color:var(--gray-three)]">
                {order.shippingAddress?.addressText}
              </div>
            </div>
            <div className="text-xl">{t("orderDetail.billingInfo")}</div>
            <div className="grid border-b border-b-[color:var(--gray-six)] pb-4 mt-2 mb-4 grid-cols-2 gap-1">
              <div className="text-[color:var(--gray-three)]">
                {t("orderDetail.name")}
              </div>
              <div className="text-right">
                {order.billingAddress?.firstName}{" "}
                {order.billingAddress?.lastName}
              </div>
              <div className="col-span-2 text-[color:var(--gray-three)]">
                {order.billingAddress?.addressText}
              </div>
            </div>
          </div>

          {/* Özet */}
          <div className="text-xl">{t("orderDetail.orderSummary")}</div>
          <div className="grid mt-2 mb-8 grid-cols-2 gap-1">
            <div className="text-[color:var(--gray-three)]">
              {t("orderDetail.shipping")}
            </div>
            <div className="text-right">
              <Pricedisplay
                amount={order.shippingTotal}
                center={false}
                isTable={true}
                currencyCode={order.currencyCode || "USD"}
                currencySymbol={order.currencySymbol || "$"}
              />
            </div>
            {order?.couponAdjustment?.amount && (
              <>
                {" "}
                <div className="text-[color:var(--gray-three)]">
                  {t("orderDetail.discountTotal")}
                </div>
                <div className="text-right">
                  <Pricedisplay
                    amount={order.couponAdjustment.amount || 0}
                    center={false}
                    isTable={true}
                    currencyCode={order.currencyCode || "USD"}
                    currencySymbol={order.currencySymbol || "$"}
                  />
                </div>
              </>
            )}
            <div className="text-[color:var(--gray-three)]">
              {t("orderDetail.tax")}
            </div>
            <div className="text-right">
              <Pricedisplay
                amount={order.totalTax}
                center={false}
                isTable={true}
                currencyCode={order.currencyCode || "USD"}
                currencySymbol={order.currencySymbol || "$"}
              />
            </div>
            <div className="text-[color:var(--gray-three)]">
              {t("orderDetail.subtotal")}
            </div>
            <div className="text-right">
              <Pricedisplay
                amount={order.totalPrice}
                center={false}
                isTable={true}
                currencyCode={order.currencyCode || "USD"}
                currencySymbol={order.currencySymbol || "$"}
              />
            </div>
            <div className="text-[color:var(--gray-three)]">
              {t("orderDetail.total")}
            </div>
            <div className="text-right">
              <Pricedisplay
                amount={order.totalFinalPrice}
                center={false}
                isTable={true}
                currencyCode={order.currencyCode || "USD"}
                currencySymbol={order.currencySymbol || "$"}
              />
            </div>
          </div>
          {/* <div className="mt-8 border-t border-[color:var(--gray-six)] pt-6">
            <button
              type="button"
              onClick={handleGoToContact}
              className="w-full bg-[color:var(--color-three)] hover:bg-[color:var(--color-four)] text-white font-medium py-2.5 px-6 rounded-sm transition-colors duration-200"
            >
              {t("contactUs")}
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
});
