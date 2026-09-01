export type PublishStatus = "draft" | "published" | "archived";

export type CmsEntity = {
  id: string;
  slug: string;
  status: PublishStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type MediaAsset = {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export type Destination = CmsEntity & {
  name: string;
  country: string;
  countryCode: string;
  excerpt?: string;
  image?: MediaAsset;
  featured?: boolean;
};

export type TourPackage = CmsEntity & {
  name: string;
  destinationId: string;
  duration: string;
  startingPrice: number;
  currency: "BDT" | "USD";
  excerpt: string;
  image?: MediaAsset;
};

export type VisaProduct = CmsEntity & {
  name: string;
  country: string;
  excerpt: string;
};

export type ServiceItem = CmsEntity & {
  name: string;
  excerpt: string;
  icon: string;
};

export type Review = CmsEntity & {
  author: string;
  quote: string;
  rating: number;
  tour?: string;
  country?: string;
};

export type InquiryStatus =
  | "new"
  | "contacted"
  | "processing"
  | "completed"
  | "cancelled";

export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  destination?: string;
  travelDate?: string;
  travelers?: number;
  service?: string;
  message?: string;
  status: InquiryStatus;
  createdAt: string;
};
