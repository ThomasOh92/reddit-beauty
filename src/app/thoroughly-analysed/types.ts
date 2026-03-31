export type EvidenceAtomBase = {
  id: string;
  commentary?: string;
};

export type RedditEvidenceAtom = EvidenceAtomBase & {
  kind: "reddit";
  headerParts: string[];
  excerpt: string;
  postKind: "post" | "comment";
  url: string;
  upvotes: string;
  followOnComments?: number;
  posterDetails: string;
  additionalNote?: string;
};

export type LinkEvidenceAtom = EvidenceAtomBase & {
  kind: "link";
  label?: string;
  url: string;
  excerpt?: string;
  additionalNote?: string;
};

export type InstagramEvidenceAtom = EvidenceAtomBase & {
  kind: "instagramLink";
  user: string;
  excerptFromDescription: string;
  url: string;
  additionalNote?: string;
};

export type TikTokEvidenceAtom = EvidenceAtomBase & {
  kind: "tiktokLink";
  user: string;
  excerptFromDescription: string;
  url: string;
  additionalNote?: string;
};

export type EvidenceAtom = RedditEvidenceAtom | LinkEvidenceAtom | InstagramEvidenceAtom | TikTokEvidenceAtom;

export type EvidenceMolecule = {
  id: string;
  point: string;
  commentary?: string;
  atoms: EvidenceAtom[];
};

export type ThoroughlyAnalysedProduct = {
  name: string;
  slug: string;
  category: string;
  imageUrl: string;
  productLink?: string;
  lastChecked: string;
  molecules: EvidenceMolecule[];
  curatorNote?: string;
};
