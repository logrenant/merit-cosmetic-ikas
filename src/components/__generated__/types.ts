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
};

export type StorylinksProps = {
	items?: BannerLink[];
};

export type FooterProps = {
	linkdata: FooterLink[];
	footerResponse?: FooterToast;
	newsletterTitle: string;
	newsletterDesc: string;
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
};

export type PageBlogProps = {
	blog: IkasBlog;
	showImage?: boolean;
};

export type PageBlogsProps = {
	title?: string;
	blogList: IkasBlogList;
	showAuthor?: boolean;
	showDescription?: boolean;
	showCategory?: boolean;
	showPublishedDate?: boolean;
};

export type UserPolicyProps = {
	acceptanceofTerms?: PolicyContent;
	partiesResponsibilities?: PolicyContent;
	intellectualPropertyRights?: PolicyContent;
	privacyConfidentialInformation?: PolicyContent;
	userRegistrationSecurity?: PolicyContent;
	forceMajeure?: PolicyContent;
	agreementValidity?: PolicyContent;
	amendmentstoTerms?: PolicyContent;
	notifications?: PolicyContent;
	generalTermsofUse?: PolicyContent;
};

export type FaqProps = {
	title: string;
	faqQuestion1?: PolicyContent;
	faqQuestion2?: PolicyContent;
	faqQuestion3?: PolicyContent;
	faqQuestion4?: PolicyContent;
	faqQuestion5?: PolicyContent;
	faqQuestion6?: PolicyContent;
};

