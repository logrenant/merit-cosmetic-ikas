import { ActivateCustomerPage } from "@ikas/storefront";
import { ActivateCustomerPage as ActivateCustomerPageNext } from "@ikas/storefront-next";
import Components from "src/components/__generated__/pages/account/activate";

const PageComponent = ActivateCustomerPage.default;

const Page = (props: any) => {
  return <PageComponent components={Components} {...props} />;
};

export default Page;
export const getStaticProps = ActivateCustomerPageNext.getStaticProps;
