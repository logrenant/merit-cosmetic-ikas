import { useState, useEffect } from "react";
import {
  IkasAddressForm,
  IkasCustomer,
  IkasCustomerAddress,
  IkasLocalizedCustomerAddress,
  useStore,
  useTranslation,
} from "@ikas/storefront";

export default function useAddress() {
  const store = useStore();
  const { t } = useTranslation();
  const [addressForm, setAddressForm] = useState<IkasAddressForm>();
  const [isNewAddressFormVisible, setAddressFormVisibility] = useState(false);

  const isAddressFormVisible = isNewAddressFormVisible && !!addressForm;
  const addressesCount = store.customerStore?.customer?.addresses?.length ?? 0;
  const hasAddress = !!addressesCount;
  const createAddressForm = (address?: IkasLocalizedCustomerAddress) => {
    return new IkasAddressForm({
      address: address || new IkasLocalizedCustomerAddress(),
      message: {
        requiredRule: t("requiredError"),
        invalidRule: () => t("invalidError"),
        phoneRule: () => t("validPhoneError"),
      },
    });
  };

  const onAddNewAddressClick = () => {
    setAddressForm(createAddressForm());
  };

  const onAddressSave = async () => {
    if (!addressForm) return;
    const result = await addressForm.submit();
    if (!result?.isSuccess) {
      throw new Error(t("errorActionMessage"));
    }
    setAddressForm(undefined);
  };

  const onAddressDelete = async (
    address: IkasCustomerAddress,
    index: number
  ) => {
    const customer = new IkasCustomer(store.customerStore.customer!);
    customer.addresses?.splice(index, 1);
    await store.customerStore.saveCustomer(customer);
  };

  const onAddresEdit = (address: IkasCustomerAddress, index: number) => {
    const customerAddress = new IkasLocalizedCustomerAddress(address);
    setAddressForm(createAddressForm(customerAddress));
  };

  const onAddressFormClose = () => {
    setAddressForm(undefined);
  };

  useEffect(() => {
    if (addressForm) {
      setAddressFormVisibility(true);
    } else {
      setAddressFormVisibility(false);
    }
  }, [addressForm]);

  useEffect(() => {
    if (!addressesCount) {
      setAddressForm(createAddressForm());
    }
  }, [addressesCount]);

  return {
    isAddressFormVisible,
    addressForm,
    addressesCount,
    hasAddress,
    onAddNewAddressClick,
    onAddressFormClose,
    onAddressDelete,
    onAddresEdit,
    onAddressSave,
  };
}
