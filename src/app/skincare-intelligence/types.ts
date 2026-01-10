export type SkinConcern =
	| "Acne"
	| "Fine Lines & Wrinkles"
	| "Dark Spots / Hyperpigmentation"
	| "Redness / Rosacea"
	| "Large Pores"
	| "Dullness"
	| "Blackheads"
	| "Uneven Texture"
	| "Dehydration"
	| "Not sure";

export type SkinType =
	| "Normal"
	| "Oily"
	| "Dry"
	| "Combination"
	| "Sensitive"
	| "Acne-Prone"
	| "Mature"
	| "Not sure";

export type GuidanceIngredient = {
	name: string;
	reason: string;
	evidence?: Array<{
		quote: string;
		label: string;
		url: string;
	}>;
};

export type GuidanceSection = {
	title: string;
	subtitle: string;
	ingredients: GuidanceIngredient[];
};

export type TrustedLink = {
	label: string;
	url: string;
};

export type ProductRec = {
	id: string;
	name: string;
	imageUrl: string;
	affiliateUrl: string;
	keyIngredient: string;
	redditMentionsApprox: number;
	redditScore: number; // 0-100
	primaryConcerns: SkinConcern[];
	okForSkinTypes: SkinType[];
	cautionForSkinTypes?: SkinType[];
	conflictFlag?: {
		missingForConcerns: SkinConcern[];
		note: string;
	};
};

export type SearchState = "idle" | "searching" | "done";
