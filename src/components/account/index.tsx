import { observer } from "mobx-react-lite";
import useAccount from "../../utils/useAccount";
import Accountinfo from "../composites/accountinfo";
import Favoriteproducts from "../composites/favoriteproducts";
import Address from "../composites/address";
import Orders from "../composites/orders";
import Orderdetails from "../composites/orderdetails";
import Accountmenu from "../composites/accountmenu";
import { useStore, useTranslation } from "@ikas/storefront";
import { useDirection } from "../../utils/useDirection";

const Account = () => {
  const {
    hasCustomer,
    isAccount,
    isFavoriteProducts,
    isAddresses,
    isOrderDetail,
    isOrders,
  } = useAccount();
  const store = useStore();
  const { direction } = useDirection();
  const { t } = useTranslation();
  if (!hasCustomer)
    return (
      <div className="flex items-center justify-center h-[411px]">
        <div className="customloader" />
      </div>
    );
  return (
    <div dir={direction} className="min-h-[80vh]">
      <div className="grid lg:grid-cols-[260px,calc(100%-292px)] gap-8 my-10 layout">
        <Accountmenu />
        {isAccount && <Accountinfo />}
        {isFavoriteProducts && <Favoriteproducts />}
        {isAddresses && <Address />}
        {isOrderDetail && <Orderdetails />}
        {isOrders && <Orders />}
        <div className="lg:hidden flex w-full justify-end mt-6">
          <button
            className="text-[color:var(--gray-five)] hover:text-[color:var(--black-two)] leading-none flex items-center justify-start gap-1.5"
            onClick={() => {
              store.customerStore.logout();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.3}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>

            <span>{t("logout")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default observer(Account);
