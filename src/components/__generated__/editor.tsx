import dynamic from "next/dynamic";
import { IkasEditorComponentLoader } from "@ikas/storefront";


const Component0 = dynamic(() => import("../navbar"), { loading: () => <IkasEditorComponentLoader /> });
const Component1 = dynamic(() => import("../quicklinks"), { loading: () => <IkasEditorComponentLoader /> });
const Component2 = dynamic(() => import("../banner"), { loading: () => <IkasEditorComponentLoader /> });
const Component3 = dynamic(() => import("../homeproducts"), { loading: () => <IkasEditorComponentLoader /> });
const Component4 = dynamic(() => import("../storylinks"), { loading: () => <IkasEditorComponentLoader /> });
const Component5 = dynamic(() => import("../footer"), { loading: () => <IkasEditorComponentLoader /> });
const Component6 = dynamic(() => import("../productlistgrid"), { loading: () => <IkasEditorComponentLoader /> });
const Component7 = dynamic(() => import("../productdetail"), { loading: () => <IkasEditorComponentLoader /> });
const Component8 = dynamic(() => import("../searchlistgrid"), { loading: () => <IkasEditorComponentLoader /> });
const Component9 = dynamic(() => import("../register"), { loading: () => <IkasEditorComponentLoader /> });
const Component10 = dynamic(() => import("../account"), { loading: () => <IkasEditorComponentLoader /> });
const Component11 = dynamic(() => import("../login"), { loading: () => <IkasEditorComponentLoader /> });
const Component12 = dynamic(() => import("../notfound"), { loading: () => <IkasEditorComponentLoader /> });
const Component13 = dynamic(() => import("../forgotpassword"), { loading: () => <IkasEditorComponentLoader /> });
const Component14 = dynamic(() => import("../recoverpassword"), { loading: () => <IkasEditorComponentLoader /> });
const Component15 = dynamic(() => import("../cart"), { loading: () => <IkasEditorComponentLoader /> });
const Component16 = dynamic(() => import("../specialpages"), { loading: () => <IkasEditorComponentLoader /> });
const Component17 = dynamic(() => import("../brands"), { loading: () => <IkasEditorComponentLoader /> });
const Component18 = dynamic(() => import("../contactpage"), { loading: () => <IkasEditorComponentLoader /> });


const Components = {
  "7b8fb0b4-4b50-49fa-9bd7-08d4dcf78e40": Component0,"e3b92c51-3ef2-483e-b7ed-3d541cdb9445": Component1,"c96aa5cb-b1b2-4b1b-98c4-2a026e3c6376": Component2,"b56b6b14-e8a6-4fb1-9f80-6317b47dba20": Component3,"075d8a49-331b-4426-8eb4-95fd91d4a9fd": Component4,"3172a00f-46f6-4d21-b72f-8918dc95d7d9": Component5,"81731b4c-ab17-49dd-9495-edf07d236cca": Component6,"3e5c985d-e7c9-4154-8a1b-6b357a4aac9b": Component7,"03c765d2-e293-4d87-a645-a770a6290ae4": Component8,"bbbf8cca-b421-40f4-b6e3-55d0f164bc8c": Component9,"6e7727fa-9dda-4592-bd5e-5e89338da1e4": Component10,"0495956d-795d-414f-9402-4033cfd9f04d": Component11,"8cdd025a-a441-4660-93b1-fd936066198c": Component12,"933af85e-ea6c-460f-a23d-4fa34161acb2": Component13,"b1e521aa-46b5-4e93-a00c-9f6089cd553d": Component14,"2d0e935d-2d7f-4334-82c6-4e68a9584c93": Component15,"704ffdf5-6c65-4c10-8e65-cbbcc299429d": Component16,"a3281c22-be37-4922-9ca0-8c8682e54e3f": Component17,"b6481f53-b8c1-46a0-8a68-84ca23c3a6b7": Component18
};

export default Components;