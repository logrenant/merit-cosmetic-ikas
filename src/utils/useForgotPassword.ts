import { useState } from "react";
import { ForgotPasswordForm, useStore, useTranslation } from "@ikas/storefront";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
type UseForgotPasswordStatus = {
  email: string | undefined;
};

export default function useForgotPassword() {
  const { t } = useTranslation();
  const router = useRouter();
  const [form] = useState(
    new ForgotPasswordForm({
      message: {
        requiredRule: t("requiredError"),
        emailRule: t("validEmailError"),
      },
    })
  );

  const [isPending, setPending] = useState(false);

  const onFormSubmit = async () => {
    if (isPending) return;

    try {
      setPending(true);

      const hasError = await form.validateAll();
      if (hasError) return;

      const store = useStore();
      const isEmailExist = await store.customerStore.checkEmail(form.email);
      if (!isEmailExist) {
        toast.error(t("emailDoesntExist"));
        return;
      }

      const response = await form.submit();
      if (response.isFormError) return;
      if (!response.isSuccess) {
        toast.error(t("errorActionMessage"));
        return;
      }

      toast.success(t("successActionMessage"));
      router.push("/");
    } catch {
      toast.error(t("errorActionMessage"));
    } finally {
      setPending(false);
    }
  };

  const status: UseForgotPasswordStatus = {
    email: form.emailErrorMessage,
  };

  return {
    isPending,
    status,
    form,
    onFormSubmit,
  };
}
