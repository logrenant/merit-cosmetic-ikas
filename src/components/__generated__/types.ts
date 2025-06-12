import {
	IkasNavigationLink,
	IkasImage,
	IkasProductList,
	IkasBlog,
	IkasCategoryList,
	IkasBrandList,
	IkasProduct,
	IkasBlogList,
} from "@ikas/storefront"

export type BannerLink = { 
	link: IkasNavigationLink;
	image: IkasImage;
};

export type Banner = { 
};

export type AnasayfaKategori = { 
	image: IkasImage;
	products: IkasProductList;
};

export type erik = { 
};

export type sloganlar = { 
};

export type FooterLink = { 
	title: string;
	links: IkasNavigationLink[];
};

export type Links = { 
};

export type IkonListItem = { 
	title: string;
	icon: IkasImage;
};

export type KonTextList = { 
	itemsdata: IkonListItem;
};

export type KutuListesi = { 
	header: string;
	items: KonTextList[];
};

export type KutuListesiListe = { 
	items: KutuListesi[];
};

export type ImageLinkListItem = { 
	link: IkasNavigationLink;
	icon: IkasImage;
};

export type ImageLinkList = { 
	items: ImageLinkListItem[];
};

export type ContactProps = { 
	mail: string;
	phone: string;
	address: string;
};

export type FormMessages = { 
	title: string;
	text: string;
};

export type BlogProps = { 
	blog: IkasBlog;
	showImage?: boolean;
	imageAspectRatio: ImageAspectRatio;
};

export enum ImageAspectRatio{ 
	"_1_1" = "_1_1",
	"_16_9" = "_16_9",
	"_3_1" = "_3_1",
	"_4_3" = "_4_3",
	"_21_9" = "_21_9",
};

export type PolicyContent = { 
	title?: string;
	content?: string;
};

export type FooterToast = { 
	success?: string;
	error?: string;
	invalidEmail?: string;
	domainError?: string;
};

export type ContactFormRule = { 
	requiredRule: string;
	emailRule: string;
	minRule: string;
	phoneRule: string;
};

export type NavbarProps = {
	categories: IkasCategoryList;
	products: IkasProductList;
	popularCategories: IkasCategoryList;
	popularProducts: IkasProductList;
	popularBrands: IkasBrandList;
	slogans: string[];
	bannerSlogan: string;
	sortItems: string;
	logo: IkasImage;
	productList?: IkasProductList;
};

export type QuicklinksProps = {
	links: ImageLinkList;
};

export type BannerProps = {
	banners?: BannerLink[];
	col: string;
	slider: boolean;
};

export type HomeproductsProps = {
	products?: AnasayfaKategori[];
	categories: boolean;
	xlBanner?: IkasImage;
	lgBanner?: IkasImage;
	smBanner?: IkasImage;
};

export type StorylinksProps = {
	items?: BannerLink[];
};

export type FooterProps = {
	linkdata: FooterLink[];
	helpLinksTitle?: string;
	helpLinks?: IkasNavigationLink[];
	footerResponse?: FooterToast;
	newsletterTitle: string;
	newsletterDesc: string;
	brandName: string;
};

export type ProductlistgridProps = {
	products: IkasProductList;
	popular: IkasProductList;
	categories: IkasCategoryList;
};

export type ProductdetailProps = {
	product: IkasProduct;
	similar: IkasProductList;
	lastvisited: IkasProductList;
	boxdata: KutuListesiListe;
	paymentText: string;
	returnText: string;
	requiredInput?: string;
	loginRequired?: string;
	successMessage?: string;
	errorMessage?: string;
};

export type SearchlistgridProps = {
	products: IkasProductList;
};

export type RegisterProps = {
	details: KutuListesiListe;
};

export type LoginProps = {
	details: KutuListesiListe;
};

export type CartProps = {
	relatedProducts: IkasProductList;
};

export type SpecialpagesProps = {
	content: string;
};

export type BrandsProps = {
	products: IkasProductList;
};

export type ContactpageProps = {
	contactProps: ContactProps;
	formMessages: FormMessages;
	formRule: ContactFormRule;
	orderNumberInput?: string;
};

export type OrderTrackingProps = {
	pageTitle?: string;
	pageDescription?: string;
	orderNumberInput?: string;
	orderCannotFound?: string;
	emailRule?: string;
	orderNumberRule?: string;
	loginRule?: string;
};

export type PageBlogProps = {
	blog: IkasBlog;
	showAuthor?: boolean;
	showPublishedDate?: boolean;
	buttonText?: string;
};

export type PageBlogsProps = {
	title?: string;
	filterTitle?: string;
	blogList: IkasBlogList;
	showAuthor?: boolean;
	showDescription?: boolean;
	showCategory?: boolean;
	showPublishedDate?: boolean;
	showFilter?: boolean;
};

export type FaqProps = {
	pageContent: string;
};

export type PageBlogCategoryProps = {
	blogList: IkasBlogList;
	showAuthor?: boolean;
	showDescription?: boolean;
	showCategory?: boolean;
	showPublishedDate?: boolean;
};

export type AboutusProps = {
	pageTitle: string;
	pageContent?: string;
};

export type TermsconditionsProps = {
	pageContent: string;
};

export type DistanceAgreementProps = {
	pageContent: string;
};

export type PrivacyPolicyProps = {
	pageContent: string;
};

export type DisclaimerProps = {
	pageContent: string;
};

export type ShippingPolicyProps = {
	pageContent: string;
};

export type QuickImageLinksProps = {
	links?: ImageLinkList;
};

export type OrderContactProps = {
	orderNumberInput?: string;
	contactProps: ContactProps;
	formMessages: FormMessages;
	formRule: ContactFormRule;
	submitError?: string;
};

export type HomepageBlogsProps = {
	blogList: IkasBlogList;
	xlBanner?: IkasImage;
	mdBanner?: IkasImage;
	smBanner?: IkasImage;
	showAuthor?: boolean;
	showDescription?: boolean;
	showCategory?: boolean;
	showPublishedDate?: boolean;
};

export type WholesaleProps = {
	pageContent: string;
};

