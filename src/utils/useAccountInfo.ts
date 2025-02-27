import { useEffect, useState } from "react";
import {
  AccountInfoForm,
  IkasCustomer,
  useTranslation,
  useStore,
} from "@ikas/storefront";
import { toast } from "react-hot-toast";

type StatusType = {
  firstName: string | undefined;
  lastName: string | undefined;
  phone: string | undefined;
};

export default function useAccountInfo() {
  const { t } = useTranslation();
  const [pending, setPending] = useState(false);
  const store = useStore();

  const [accountInfoForm, setAccountInfoForm] = useState<AccountInfoForm>();

  useEffect(() => {
    if (!store.customerStore.customer) return;
    setAccountInfoForm(
      new AccountInfoForm({
        customer: new IkasCustomer(store.customerStore.customer),
        message: {
          requiredRule: t("requiredError"),
          phoneRule: () => t("validPhoneError"),
        },
      })
    );
  }, [store.customerStore.customer]);

  const onSubmit = async () => {
    if (pending) return;
    if (!accountInfoForm) return;

    setPending(true);
    const result = await accountInfoForm.submit();
    setPending(false);
    if (result.isFormError) return;
    if (!result.isSuccess) {
      toast.error(t("errorActionMessage"));
      return;
    }

    toast.success(t("successActionMessage"));
  };

  const status: StatusType = {
    firstName: accountInfoForm?.firstNameErrorMessage,
    lastName: accountInfoForm?.lastNameErrorMessage,
    phone: accountInfoForm?.phoneErrorMessage,
  };

  return {
    pending,
    accountInfoForm,
    status,
    onSubmit,
  };
}
