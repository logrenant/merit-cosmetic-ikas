import React from "react";
import { observer } from "mobx-react-lite";
import {
  IkasOrder,
  Image,
  formatDate,
  IkasOrderPackageFullfillStatus,
  useTranslation
} from "@ikas/storefront";
import Pricedisplay from "../composites/pricedisplay";

export default observer(function Orderdetail({
  order,
  refundEmailAddress,
}: {
  order: IkasOrder;
  refundEmailAddress: string;
}) {
  const { t } = useTranslation();
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
    <div className="max-w-4xl mx-auto p-4 space-y-6 rounded">
      {/* Başlık */}
      <div>
        <h2 className="text-2xl font-bold">Order #{order.orderNumber}</h2>
        <p className="text-[color:var(--black-one)]">
          {order.orderedAt
            ? formatDate(new Date(order.orderedAt))
            : "Tarih yok"}
        </p>
      </div>

      {/* Paketler & Ürünler */}
      {order.displayedPackages?.map((pkg) => {
        const items = pkg.getOrderLineItems(order);
        return (
          <div key={pkg.id} className="space-y-4">
            <h3 className="text-xl font-semibold">
              {getPackageTitle(pkg.orderPackageFulfillStatus)}
            </h3>
            <div className="divide-y">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center py-3 first:pt-0 last:pb-0"
                >
                  {/* Ürün Görseli */}
                  <div className="w-24 h-24 flex-shrink-0">
                    <Image
                      image={item.variant.mainImage!}
                      alt={item.variant.name}
                      useBlur
                      width={80}
                      height={80}
                      className="rounded object-cover"
                    />
                  </div>
                  {/* Ürün Bilgisi */}
                  <div className="ml-4 flex-1">
                    <p className="font-medium">{item.variant.name}</p>
                    {item.variant.variantValues?.length && (
                      <p className="text-sm text-[color:var(--black-one)]">
                        {item.variant.variantValues
                          .map((v) => v.variantValueName)
                          .join(", ")}
                      </p>
                    )}
                    <div className="mt-1 flex justify-between text-sm">
                      <span>Adet: {item.quantity}</span>
                      <Pricedisplay
                        amount={item.finalPriceWithQuantity}
                        currencyCode={item.currencyCode!}
                        currencySymbol={item.currencySymbol!}
                        center={false}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Adresler */}
      <div className="flex flex-row gap-8">
        <div>
          <h4 className="font-semibold mb-1">Teslimat Adresi</h4>
          {order.shippingAddress && (
            <address className="not-italic text-sm">
              {order.shippingAddress.firstName}{" "}
              {order.shippingAddress.lastName}
              <br />
              {order.shippingAddress.addressText}
            </address>
          )}
        </div>
        <div>
          <h4 className="font-semibold mb-1">Fatura Adresi</h4>
          {order.billingAddress && (
            <address className="not-italic text-sm">
              {order.billingAddress.firstName}{" "}
              {order.billingAddress.lastName}
              <br />
              {order.billingAddress.addressText}
            </address>
          )}
        </div>
      </div>

      {/* Özet */}
      <div className=" mx-auto border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <div className="text-[color:var(--gray-three)]">
            {t("orderDetail.subtotal")}
          </div>
          <Pricedisplay
            amount={order.totalPrice}
            currencyCode={order.currencyCode!}
            currencySymbol={order.currencySymbol!}
            center={false}
          />
        </div>
        <div className="flex justify-between">
          <div className="text-[color:var(--gray-three)]">
            {t("orderDetail.shipping")}
          </div>
          <Pricedisplay
            amount={order.shippingTotal}
            currencyCode={order.currencyCode!}
            currencySymbol={order.currencySymbol!}
            center={false}
          />
        </div>
        {order.couponAdjustment?.amount != null && (
          <div className="flex justify-between">
            <div className="text-[color:var(--gray-three)]">
              {t("orderDetail.discountTotal")}
            </div>
            <Pricedisplay
              amount={-order.couponAdjustment.amount}
              currencyCode={order.currencyCode!}
              currencySymbol={order.currencySymbol!}
              center={false}
            />
          </div>
        )}
        <div className="flex justify-between">
          <div className="text-[color:var(--gray-three)]">
            {t("orderDetail.tax")}
          </div>
          <Pricedisplay
            amount={order.totalTax}
            currencyCode={order.currencyCode!}
            currencySymbol={order.currencySymbol!}
            center={false}
          />
        </div>
        <div className="flex justify-between font-semibold">
          <div className="text-[color:var(--gray-three)]">
            {t("orderDetail.total")}
          </div>
          <Pricedisplay
            amount={order.totalFinalPrice}
            center={false}
            currencyCode={order.currencyCode || "USD"}
            currencySymbol={order.currencySymbol || "$"}
          />
        </div>
      </div>
    </div>
  );
});
