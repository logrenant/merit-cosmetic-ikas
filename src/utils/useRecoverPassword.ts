import { useState } from "react";
import { useRouter } from "next/router";
import { RecoverPasswordForm, useTranslation } from "@ikas/storefront";
import { toast } from "react-hot-toast";

type UseRecoverPasswordStatus = {
  password: string | undefined;
  passwordAgain: string | undefined;
};

export default function useRecoverPassword() {
  const router = useRouter();
  const { t } = useTranslation();

  const [form] = useState(
    new RecoverPasswordForm({
      message: {
        requiredRule: t("requiredError"),
        minRule: t("passwordLength"),
        equalsRule: t("passwordsNotMatch"),
      },
    })
  );

  const [isPending, setPending] = useState(false);

  const onFormSubmit = async () => {
    if (isPending) return;

    try {
      setPending(true);

      const response = await form.submit();
      if (response.isFormError) return;
      if (!response.isSuccess) {
        toast.error(t("errorActionMessage"));
        return;
      }

      toast.success(t("successActionMessage"));

      if (form.redirect) {
        router.push(decodeURIComponent(form.redirect));
      } else {
        router.push("/account/login");
      }
    } catch {
      toast.error(t("errorActionMessage"));
    } finally {
      setPending(false);
    }
  };

  const status: UseRecoverPasswordStatus = {
    password: form.passwordErrorMessage,
    passwordAgain: form.passwordAgainErrorMessage,
  };

  return {
    isPending,
    status,
    form,
    onFormSubmit,
  };
}
