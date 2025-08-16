import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { RegisterForm, useStore, useTranslation } from "@ikas/storefront";
import { toast } from "react-hot-toast";

type UseRegisterStatus = {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  password: string | undefined;
};

export default function useRegister() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isFormSubmitted, setFormSubmitted] = useState(false);

  const [form] = useState(
    new RegisterForm({
      message: {
        requiredRule: "This field is required",
        emailRule: "Please enter a valid email address",
        minRule: "Please enter at least 8 characters",
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
    setFormSubmitted(true);

    try {
      setPending(true);
      const store = useStore();
      
      // Check if email exists before proceeding
      if (!form.email) {
        toast.error(t("emailRequired"));
        return;
      }
      
      const isEmailExist = await store.customerStore.checkEmail(form.email);
      if (isEmailExist) {
        toast.error(t("emailAlreadyExists"));
        return;
      }
      const response = await form.register();
      if (response.isFormError) return;
      if (!response.isSuccess) {
        toast.error(t("errorActionMessage"));
        return;
      }

      toast.success(t("registerSuccess"));

      setTimeout(() => {
        if (form.redirect) {
          router.push(decodeURIComponent(form.redirect));
        } else {
          router.push("/");
        }
      }, 1000);
      setFormSubmitted(false);
    } catch {
      toast.error(t("errorActionMessage"));
    } finally {
      setPending(false);
    }
  };

  const status: UseRegisterStatus = {
    firstName: form.firstNameErrorMessage,
    lastName: form.lastNameErrorMessage,
    email: form.emailErrorMessage,
    password: form.passwordErrorMessage,
  };

  return {
    isPending,
    isFormSubmitted,
    status,
    form,
    onFormSubmit,
  };
}
