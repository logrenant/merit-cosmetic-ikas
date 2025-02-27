import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LoginForm, useStore, useTranslation } from "@ikas/storefront";
import { toast } from "react-hot-toast";

type UseLoginStatus = {
  email: string | undefined;
  password: string | undefined;
};

export default function useLogin() {
  const router = useRouter();
  const { t } = useTranslation();

  const [form] = useState(
    new LoginForm({
      message: {
        requiredRule: t("requiredError"),
        emailRule: t("validEmailError"),
        minRule: t("passwordLength"),
      },
    })
  );

  const [isPending, setPending] = useState(false);

  useEffect(() => {
    const store = useStore();
    if (!store.customerStore.customer?.id) return;
    if (form.redirect) {
      router.push(decodeURIComponent(form.redirect));
    } else {
      router.push("/account");
    }
  }, []);

  const onFormSubmit = async () => {
    if (isPending) return;

    try {
      setPending(true);
      const response = await form.login();
      if (response.isFormError) return;
      if (!response.isSuccess) {
        toast.error(t("loginError"));
        return;
      }

      toast.success(t("loginSuccess"));
      setTimeout(() => {
        if (form.redirect) {
          router.push(decodeURIComponent(form.redirect));
        } else {
          router.push("/");
        }
      }, 1000);
    } catch {
      toast.error(t("loginError"));
    } finally {
      setPending(false);
    }
  };
  const status: UseLoginStatus = {
    email: form.emailErrorMessage,
    password: form.passwordErrorMessage,
  };

  return {
    isPending,
    status,
    form,
    onFormSubmit,
  };
}
