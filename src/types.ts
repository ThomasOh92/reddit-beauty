import { Timestamp } from "firebase-admin/firestore";
import { PortableTextBlock } from "next-sanity";

export interface Product {
  id: string;
  product_name: string;
  positive_mentions: number;
  negative_mentions: number;
  neutral_mentions: number;
  amazon_url_us?: string;
  amazon_url_uk?: string;
  image_url: string;
  sephora_url?: string;
  fallback_url?: string;
  upvote_count?: number;
  rank?: number;
  slug: string;
  editorial_rating?: number;
  editorial_summary?: string;
  faq?: { [key: string]: string }[];
  lastUpdated?: Timestamp;
  methodology?: string;
  one_sentence_definition?: string;
  pros_cons?: { [key: string]: string[] };
  sentiment_score?: number;
}

export interface Discussion {
  Subreddit: string;
  thread_title: string;
  date: string;
  permalink: string;
}

export interface CategoryDetails {
  slug: string;
  title: string;
  type: string;
  subtitle: string;
  readyForDisplay?: boolean;
  lastUpdated: string;
  thumbnailUrl?: string;
}

export interface Quote {
  id: string;
  comment: string;
  author: string;
  url: string;
  helpfulness_score: number;
  sentiment: string;
  score: number;
}

// Shape for the post data. All optional fields are marked accordingly
export interface Post {
  _id: string;
  _createdAt?: string;
  title: string;
  slug: string;
  body: PortableTextBlock[];
  excerpt?: string;
  mainImage?: {
    asset?: { _ref?: string };
    alt?: string;
  };
  publishedAt?: string;
  dateModified?: string;
  locale?: string;
  author?: {
    _id: string;
    name?: string;
    slug?: string;
    image?: { asset?: { _ref?: string }; alt?: string } | null;
  } | null;
  primaryCategory?: { _id: string; title?: string; slug?: string } | null;
  categories?: { _id: string; title?: string; slug?: string }[] | null;
  tags?: string[] | null;
  relatedPosts?: Array<{
    _id: string;
    title?: string;
    slug?: string;
    publishedAt?: string;
    mainImage?: { asset?: { _ref?: string }; alt?: string } | null;
  }> | null;
  relatedLinks?: Array<{ title?: string; url?: string; description?: string }>; 
  faq?: Array<{ question?: string; answer?: string }>; 
  howTo?: {
    title?: string;
    intro?: string;
    totalTime?: string;
    steps?: Array<{
      title?: string;
      body?: PortableTextBlock[];
      image?: { asset?: { _ref?: string }; alt?: string } | null;
    }>
  } | null;
  reviewBlock?: {
    itemName?: string;
    ratingValue?: number;
    ratingCount?: number;
  } | null;
  sources?: Array<{ title?: string; publisher?: string; url?: string; rel?: string[] }>; 
  reviewedBy?: { _id: string; name?: string; slug?: string; image?: { asset?: { _ref?: string }; alt?: string } | null } | null;
  lastReviewedAt?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: { asset?: { _ref?: string }; alt?: string } | null;
    twitterCard?: string;
    structuredData?: string;
  } | null;
  featured?: boolean;
  ogImage?: { asset?: { _ref?: string }; alt?: string } | null;
  previousSlugs?: string[];
  readingTime?: number;
};
