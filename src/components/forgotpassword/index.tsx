import { observer } from "mobx-react-lite";
import useForgotPassword from "../../utils/useForgotPassword";
import { useDirection } from "../../utils/useDirection";
import { useTranslation } from "@ikas/storefront";

const ForgotPassword = () => {
  const forgotPassword = useForgotPassword();
  const { isPending, form, onFormSubmit, status } = forgotPassword;
  const { t } = useTranslation();
  const { direction } = useDirection();

  return (
    <div dir={direction}>
      <div className="flex items-center mt-10 gap-4 border-b-[4px] border-[color:var(--color-one)] pb-6 justify-center">
        <h1 className="text-lg px-4 relative font-medium text-[color:var(--color-one)] ">
          {t("forgotPassword")}
          <span className="absolute left-0 bottom-[-28px] h-[4px] w-full bg-[color:var(--color-one)]"></span>
        </h1>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await onFormSubmit();
        }}
        className="flex px-5 gap-3 flex-col my-10 max-w-md mx-auto"
      >
        <div className="flex flex-col w-full">
          <label className="text-base text-[color:var(--black-one)] mb-0.5">
            {t("email")}
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => {
              form.onEmailChange(e.target.value);
            }}
            placeholder={t("email")}
            className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
          />

          {status.email && (
            <span className="text-red-500 mt-0.5 text-xs">{status.email}</span>
          )}
        </div>

        <button
          disabled={isPending}
          className="mt-2.5 disabled:opacity-60 tracking-wide w-full bg-[color:var(--color-three)] text-sm font-medium text-white rounded py-2.5 px-5"
          type="submit"
        >
          {isPending ? t("loading") : t("submit")}
        </button>
      </form>
    </div>
  );
};

export default observer(ForgotPassword);
