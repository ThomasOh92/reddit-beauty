export interface Product {
  id: string;
  product_name: string;
  positive_mentions: number;
  negative_mentions: number;
  amazon_url_us?: string;
  amazon_url_uk?: string;
  image_url: string;
  sephora_url?: string;
  fallback_url?: string;
  upvote_count?: number;
  rank?: number;
  slug: string;
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
};
