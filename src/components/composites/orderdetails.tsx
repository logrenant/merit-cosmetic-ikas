import { observer } from "mobx-react-lite";
import useOrderDetail from "../../utils/useOrderDetail";
import { OrderPackageStatus } from "./orders";
import {
  Image,
  useTranslation,
  IkasOrderLineItem,
  IkasOrderLineItemStatus,
  IkasPaymentMethodType,
  IkasOrderPackageFullfillStatus,
  IkasTrackingInfo,
} from "@ikas/storefront";
import Orderrefund from "./orderrefund";
import Pricedisplay from "./pricedisplay";

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
      return { text: text("refundApproved"), color: "green" };
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

const RefundProcessButton = ({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <button
      className="mt-2.5 disabled:opacity-60 tracking-wide w-min whitespace-nowrap bg-[color:var(--color-three)] text-sm font-medium text-white rounded-sm py-2.5 px-5"
      disabled={disabled}
      onClick={onClick}
    >
      {t(`orderDetail.refundRequest`)}
    </button>
  );
};

function getOrderPackageTitle(status: IkasOrderPackageFullfillStatus) {
  const { t } = useTranslation();
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

const OrderPackage = observer(
  ({
    title,
    orderLineItems,
    trackingInfo,
  }: {
    title: React.ReactNode;
    orderLineItems?: IkasOrderLineItem[];
    trackingInfo?: IkasTrackingInfo | null;
  }) => {
    if (!orderLineItems || !orderLineItems.length) return null;
    const quantity = orderLineItems.reduce(
      (quantity: number, oLI) => oLI.quantity + quantity,
      0
    );
    const { t } = useTranslation();

    return (
      <>
        <div className="text-xl">
          {title} ({quantity})
        </div>

        <div className="grid divide-y divide-[color:var(--gray-six)] grid-cols-1 mt-3">
          {orderLineItems.map((item) => (
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
      </>
    );
  }
);

const OrderDetail = () => {
  const {
    isPending,
    isRefundProcess,
    order,
    orderedAt,
    orderTransactions,
    toggleRefundProcess,
  } = useOrderDetail();
  const { t } = useTranslation();

  const onRefundProcessButtonClick = () => {
    toggleRefundProcess(!isRefundProcess);
    window.scroll(0, 0);
  };
  if (isPending)
    return (
      <div className="flex items-center justify-center h-[411px]">
        <div className="customloader" />
      </div>
    );
  if (!order) return null;

  return (
    <div>
      <div className="flex mb-4 items-start flex-col">
        <div className="text-2xl">
          {`${t("orderDetail.orderDetail")} #${order.orderNumber}`}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <OrderPackageStatus status={order.orderPackageStatus!} />
          <div className="text-sm text-[color:var(--gray-three)]">
            {orderedAt}
          </div>
        </div>
      </div>

      {/* products */}
      {isRefundProcess && <Orderrefund order={order} />}
      {!isRefundProcess && (
        <>
          <div className="grid gap-8 lg:grid-cols-[calc(100%-342px)_310px]">
            <div className="flex flex-col gap-4">
              {order.displayedPackages?.map((orderPackage) => {
                const orderLineItems = orderPackage.getOrderLineItems(order);
                const title = getOrderPackageTitle(
                  orderPackage.orderPackageFulfillStatus
                );
                return (
                  <OrderPackage
                    key={orderPackage.id}
                    title={title}
                    trackingInfo={orderPackage.trackingInfo}
                    orderLineItems={orderLineItems}
                  />
                );
              })}
            </div>
            <div>
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

              {orderTransactions && orderTransactions.length > 0 && (
                <>
                  <div className="text-xl">{t("orderDetail.payment")}</div>
                  <div className="grid border-b border-b-[color:var(--gray-six)] pb-4 mt-2 mb-4 gap-1">
                    {orderTransactions?.map((oT) => {
                      const paymentMethodText = t(
                        `orderTransactions.paymentMethod.${oT.paymentMethod}`
                      );
                      return (
                        <div key={oT.id}>
                          <div className="flex gap-2 justify-between w-full">
                            <span className="text-[color:var(--gray-three)]">
                              {paymentMethodText}
                            </span>
                            <div>
                              <Pricedisplay
                                amount={oT.amount || 0}
                                center={false}
                                currencyCode={oT.currencyCode || "USD"}
                                currencySymbol={oT.currencySymbol || "$"}
                              />
                            </div>
                          </div>

                          {oT.paymentMethod ===
                            IkasPaymentMethodType.CREDIT_CARD && (
                            <div>
                              **** **** ****{" "}
                              {oT.paymentMethodDetail?.lastFourDigits}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              <div className="text-xl">{t("orderDetail.orderSummary")}</div>
              <div className="grid mt-2 mb-8 grid-cols-2 gap-1">
                <div className="text-[color:var(--gray-three)]">
                  {t("orderDetail.shipping")}
                </div>
                <div className="text-right">
                  <Pricedisplay
                    amount={order.shippingTotal}
                    center={false}
                    left
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
                        left
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
                    left
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
                    left
                    center={false}
                    currencyCode={order.currencyCode || "USD"}
                    currencySymbol={order.currencySymbol || "$"}
                  />
                </div>
                <div className="text-[color:var(--gray-three)]">
                  {t("orderDetail.total")}
                </div>
                <div className="text-right">
                  <Pricedisplay
                    left
                    amount={order.totalFinalPrice}
                    center={false}
                    currencyCode={order.currencyCode || "USD"}
                    currencySymbol={order.currencySymbol || "$"}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            {!!order.refundableItems.length && (
              <RefundProcessButton
                disabled={!order.refundableItems.length}
                onClick={onRefundProcessButtonClick}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default observer(OrderDetail);
