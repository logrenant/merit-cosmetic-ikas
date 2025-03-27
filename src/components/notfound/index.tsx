import { Link, useTranslation } from "@ikas/storefront";
import { observer } from "mobx-react-lite";
const NotFound = observer(() => {
  const { t } = useTranslation();
  return (
    <section className="flex items-center h-full p-16">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-semibold text-9xl">404</h2>
          <p className="text-xl font-semibold">{t("notFound.message")}</p>
          <p className="mt-4 mb-4">{t("notFound.description")}</p>
          <Link href="/">
            <a className="mt-2 w-min whitespace-nowrap flex items-center justify-center mx-auto px-4 py-2 bg-[color:var(--color-one)] text-white rounded-sm">
              {t("notFound.button")}
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
});

export default NotFound;
