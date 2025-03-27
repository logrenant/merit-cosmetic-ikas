import { observer } from "mobx-react-lite";
import useRecoverPassword from "../../utils/useRecoverPassword";
import { useDirection } from "../../utils/useDirection";
import { useTranslation } from "@ikas/storefront";

const RecoverPassword = () => {
  const recoverPassword = useRecoverPassword();
  const { isPending, form, onFormSubmit, status } = recoverPassword;
  const { t } = useTranslation();
  const { direction } = useDirection();
  return (
    <div dir={direction}>
      <div className="flex items-center mt-10 gap-4 border-b-[4px] border-[color:var(--color-five)] pb-6 justify-center">
        <h1 className="text-lg px-4 relative font-medium text-[color:var(--color-one)] ">
          {t("forgotPassword")}
          <span className="absolute left-0 bottom-[-28px] h-[4px] w-full bg-[color:var(--color-one)]" />
        </h1>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onFormSubmit();
        }}
        className="flex px-5 gap-3 flex-col my-10 max-w-md mx-auto"
      >
        <div className="flex flex-col w-full">
          <label className="text-base text-[color:var(--black-one)] mb-0.5">
            {t("password")}
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => {
              form.onPasswordChange(e.target.value);
            }}
            placeholder={t("password")}
            className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded-sm px-2.5"
          />

          {status.password && (
            <span className="text-red-500 mt-0.5 text-xs">
              {status.password}
            </span>
          )}
        </div>
        <div className="flex flex-col w-full">
          <label className="text-base text-[color:var(--black-one)] mb-0.5">
            {t("passwordAgain")}
          </label>
          <input
            type="password"
            value={form.passwordAgain}
            onChange={(e) => {
              form.onPasswordAgainChange(e.target.value);
            }}
            placeholder={t("passwordAgain")}
            className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded-sm px-2.5"
          />

          {status.passwordAgain && (
            <span className="text-red-500 mt-0.5 text-xs">
              {status.passwordAgain}
            </span>
          )}
        </div>

        <button
          disabled={isPending}
          className="mt-2.5 disabled:opacity-60 tracking-wide w-full bg-[color:var(--color-three)] text-sm font-medium text-white rounded-sm py-2.5 px-5"
          type="submit"
        >
          {isPending ? t("loading") : t("submit")}
        </button>
      </form>
    </div>
  );
};

export default observer(RecoverPassword);
