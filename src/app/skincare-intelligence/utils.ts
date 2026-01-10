import type { ProductRec, SkinConcern, SkinType } from "./types";

export function clamp(n: number, min: number, max: number) {
	return Math.max(min, Math.min(max, n));
}

export function formatNumber(n: number) {
	return new Intl.NumberFormat(undefined).format(n);
}

export function computeMatchScore(
	product: ProductRec,
	concern: SkinConcern,
	skinType: SkinType,
) {
	const concernMatch = product.primaryConcerns.includes(concern);
	const skinTypeOk = product.okForSkinTypes.includes(skinType) || skinType === "Not sure";
	const skinTypeCaution = product.cautionForSkinTypes?.includes(skinType) ?? false;

	if (concernMatch && skinTypeOk && !skinTypeCaution) return 100;
	if (concernMatch && (skinTypeOk || skinTypeCaution)) return 80;
	if (!concernMatch && skinTypeOk && !skinTypeCaution) return 60;
	return 40;
}

export function sortByBestMatch(items: Array<{ score: number; product: ProductRec }>) {
	return [...items].sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		if (b.product.redditScore !== a.product.redditScore)
			return b.product.redditScore - a.product.redditScore;
		return b.product.redditMentionsApprox - a.product.redditMentionsApprox;
	});
}
