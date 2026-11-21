export type Availability = "in-stock" | "low-stock" | "out-of-stock" | "coming-soon";

export interface Product {
  id: string; // also the URL slug: /product/:id
  name: string;
  categoryId: string;
  price: number;
  size: string;
  short: string;
  description: string;
  image: string;
  gallery: string[];
  featured: boolean;
  availability: Availability;
  published: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Article {
  id: string; // URL slug: /journal/:id
  title: string;
  excerpt: string;
  content: string; // paragraphs separated by blank lines
  categoryId: string;
  image: string;
  author: string;
  date: string;
  readTime: number;
  published: boolean;
  featured: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  image: string;
  visible: boolean;
}

export type EnquiryStatus = "new" | "in-progress" | "resolved";

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  status: EnquiryStatus;
  notes: string;
}

export interface Subscriber {
  id: string;
  email: string;
  date: string;
  source: string;
}

export interface BrandSection {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
}

export interface HomepageSettings {
  announcement: string;
  promoMessage: string;
  showPromo: boolean;
  heroEyebrow: string;
  heroHeading: string;
  heroDescription: string;
  heroImage: string;
  featuredIds: string[];
  introTitle: string;
  introText: string;
  philosophy: BrandSection[];
  why: BrandSection[];
}

export interface SiteSettings {
  companyName: string;
  brandName: string;
  logoText: string;
  logoImage: string;
  tagline: string;
  cin: string;
  incorporationDate: string;
  status: string;
  registeredOffice: string;
  directors: string;
  capital: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  pinterest: string;
  youtube: string;
  footerAbout: string;
  footerNote: string;
}

export interface Activity {
  id: string;
  text: string;
  time: string;
}

export interface SiteData {
  products: Product[];
  categories: Category[];
  articles: Article[];
  journalCategories: Category[];
  gallery: GalleryItem[];
  enquiries: Enquiry[];
  subscribers: Subscriber[];
  homepage: HomepageSettings;
  settings: SiteSettings;
  activity: Activity[];
}

export type CollectionKey =
  | "products"
  | "categories"
  | "articles"
  | "journalCategories"
  | "gallery"
  | "enquiries"
  | "subscribers";
