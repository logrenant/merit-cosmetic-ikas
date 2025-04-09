import { formatCurrency } from "@ikas/storefront";
import { observer } from "mobx-react-lite";
import useConvertedPrice from "../../utils/useConvertedPrice";
import UIStore from "../../store/ui-store";
const Pricedisplay = ({
  amount,
  currencyCode,
  currencySymbol,
  center,
  left
}: {
  amount: number;
  currencyCode: string;
  currencySymbol: string;
  center: boolean;
  left?: boolean;
}) => {
  const { formatPrice } = useConvertedPrice();
  const uiStore = UIStore.getInstance();
  return (
    <span
      className={`flex items-center gap-x-1.5 whitespace-nowrap flex-wrap ${center ? "justify-center" : ""
        } ${left ? "flex-row-reverse justify-end" : ""}`}
    >
      {formatCurrency(amount, currencyCode, currencySymbol)}
      {uiStore.currency !== "USD" && (
        <span className="text-xs mt-0.5 md:text-sm text-[color:var(--color-four)]">
          ({formatPrice(amount)})
        </span>
      )}
    </span>
  );
};

export default observer(Pricedisplay);
