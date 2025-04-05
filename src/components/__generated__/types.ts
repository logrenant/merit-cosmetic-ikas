import {
	IkasNavigationLink,
	IkasImage,
	IkasProductList,
	IkasCategoryList,
	IkasBrandList,
	IkasProduct,
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
};

