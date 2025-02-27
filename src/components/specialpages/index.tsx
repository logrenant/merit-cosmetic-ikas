import { useTranslation } from "@ikas/storefront";
import { observer } from "mobx-react-lite";
import { SpecialpagesProps } from "../__generated__/types";
const SpeacialPages = observer(({ content }: SpecialpagesProps) => {
  const { t } = useTranslation();
  return (
    <div className="my-14 layout">
      <div
        className="prose prose-base max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
});

export default SpeacialPages;
