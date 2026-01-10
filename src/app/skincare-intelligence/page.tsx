"use client";
import { useEffect, useMemo, useRef, useState } from "react";

import { SKIN_CONCERNS, SKIN_TYPES } from "./data";
import type { SearchState, SkinConcern, SkinType } from "./types";
import { PickComboCard } from "./components/PickComboCard";
import { SearchingStatusCard } from "./components/SearchingStatusCard";

function toRedditUrl(raw: string | null): string | null {
	const input = (raw ?? "").trim();
	if (!input) return null;

	const lower = input.toLowerCase();
	const isRedditHost = lower.includes("reddit.com") || lower.includes("redd.it");

	if (lower.startsWith("http://") || lower.startsWith("https://")) {
		return isRedditHost ? input : null;
	}

	if (lower.startsWith("reddit.com") || lower.startsWith("www.reddit.com")) {
		return `https://${input}`;
	}

	if (lower.startsWith("redd.it") || lower.startsWith("www.redd.it")) {
		return `https://${input}`;
	}

	// Common relative-ish forms
	if (input.startsWith("/")) {
		return `https://www.reddit.com${input}`;
	}

	if (lower.startsWith("r/") || lower.startsWith("u/") || lower.startsWith("user/")) {
		return `https://www.reddit.com/${input}`;
	}

	return null;
}

type ScienceBasicsIngredient = {
	id: string | number;
	name: string;
	description: string | null;
	effect: "HELPFUL" | "AVOID";
	concernEffect?: "HELPFUL" | "AVOID";
	concernNote?: string | null;
	skinTypeEffect?: "HELPFUL" | "AVOID";
	skinTypeNote?: string | null;
};

type ScienceBasicsResponse =
	| {
			success: true;
			data: {
				message?: string;
				ingredients: ScienceBasicsIngredient[];
			};
		}
	| { success: false; error: string };

type SuggestedProductReview = {
	review_link: string | null;
	review_text: string | null;
	sentiment: string | null;
	skin_type_reasoning: string | null;
	skin_concern_reasoning: string | null;
};

type SuggestedProduct = {
	id: string | number;
	title: string;
	brand: string | null;
	reviews: SuggestedProductReview[];
};

type SuggestedProductsResponse =
	| {
			success: true;
			data: {
				message?: string;
				products: SuggestedProduct[];
			};
		}
	| { success: false; error: string };

export default function SkinConcernHelperPage() {
	const [selectedConcern, setSelectedConcern] = useState<SkinConcern | null>(null);
	const [selectedSkinType, setSelectedSkinType] = useState<SkinType | null>(null);
	const [searchState, setSearchState] = useState<SearchState>("idle");
	const [searchStep, setSearchStep] = useState<0 | 1 | 2>(0);
	const [searchingUiDone, setSearchingUiDone] = useState(false);
	const ingredientModalRef = useRef<HTMLDialogElement | null>(null);
	const [activeIngredient, setActiveIngredient] = useState<ScienceBasicsIngredient | null>(null);
	const [scienceBasicsLoading, setScienceBasicsLoading] = useState(false);
	const [scienceBasicsError, setScienceBasicsError] = useState<string | null>(null);
	const [scienceBasicsMessage, setScienceBasicsMessage] = useState<string | null>(null);
	const [scienceBasicsIngredients, setScienceBasicsIngredients] = useState<
		ScienceBasicsIngredient[] | null
	>(null);
	const [suggestedProductsLoading, setSuggestedProductsLoading] = useState(false);
	const [suggestedProductsError, setSuggestedProductsError] = useState<string | null>(null);
	const [suggestedProductsMessage, setSuggestedProductsMessage] = useState<string | null>(null);
	const [suggestedProducts, setSuggestedProducts] = useState<SuggestedProduct[] | null>(
		null
	);

	const canSearch = Boolean(selectedConcern && selectedSkinType);

	const scienceBasicsAllIngredients = useMemo(
		() => scienceBasicsIngredients ?? [],
		[scienceBasicsIngredients]
	);

	const openIngredientModal = (ingredient: ScienceBasicsIngredient) => {
		setActiveIngredient(ingredient);
		ingredientModalRef.current?.showModal();
	};
	const closeIngredientModal = () => {
		ingredientModalRef.current?.close();
		setActiveIngredient(null);
	};

	useEffect(() => {
		if (searchState !== "searching") return;

		setSearchingUiDone(false);
		setSearchStep(0);
		const t1 = setTimeout(() => setSearchStep(1), 650);
		const t2 = setTimeout(() => setSearchStep(2), 1300);
		const t3 = setTimeout(() => setSearchingUiDone(true), 1600);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(t3);
		};
	}, [searchState]);

	useEffect(() => {
		if (searchState !== "searching") return;
		if (!canSearch) return;

		const controller = new AbortController();
		setScienceBasicsLoading(true);
		setScienceBasicsError(null);
		setScienceBasicsMessage(null);
		setScienceBasicsIngredients(null);
		setSuggestedProductsLoading(true);
		setSuggestedProductsError(null);
		setSuggestedProductsMessage(null);
		setSuggestedProducts(null);

		fetch("/api/getScienceBasics", {
			method: "POST",
			cache: "no-store",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				skinType: selectedSkinType,
				skinConcern: selectedConcern,
			}),
			signal: controller.signal,
		})
			.then(async (res) => {
				const json = (await res.json()) as ScienceBasicsResponse;
				if (!res.ok || !json.success) {
					throw new Error(
						"error" in json
							? json.error
							: "Failed to load science basics"
					);
				}
				setScienceBasicsMessage(json.data.message ?? null);
				setScienceBasicsIngredients(json.data.ingredients ?? []);
			})
			.catch((err: unknown) => {
				if (controller.signal.aborted) return;
				setScienceBasicsError(
					err instanceof Error ? err.message : "Unknown error"
				);
			})
			.finally(() => {
				if (controller.signal.aborted) return;
				setScienceBasicsLoading(false);
			});

		fetch("/api/getSuggestedProducts", {
			method: "POST",
			cache: "no-store",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				skinType: selectedSkinType,
				skinConcern: selectedConcern,
				limit: 3,
			}),
			signal: controller.signal,
		})
			.then(async (res) => {
				const json = (await res.json()) as SuggestedProductsResponse;
				if (!res.ok || !json.success) {
					throw new Error(
						"error" in json
							? json.error
							: "Failed to load suggested products"
					);
				}
				setSuggestedProductsMessage(json.data.message ?? null);
				setSuggestedProducts(json.data.products ?? []);
			})
			.catch((err: unknown) => {
				if (controller.signal.aborted) return;
				setSuggestedProductsError(
					err instanceof Error ? err.message : "Unknown error"
				);
			})
			.finally(() => {
				if (controller.signal.aborted) return;
				setSuggestedProductsLoading(false);
			});

		return () => controller.abort();
	}, [searchState, canSearch, selectedConcern, selectedSkinType]);

	useEffect(() => {
		if (searchState !== "searching") return;
		if (!canSearch) return;
		if (!searchingUiDone) return;
		if (scienceBasicsLoading || suggestedProductsLoading) return;

		const scienceBasicsResolved = Boolean(
			scienceBasicsIngredients !== null || scienceBasicsError || scienceBasicsMessage
		);
		const suggestedProductsResolved = Boolean(
			suggestedProducts !== null || suggestedProductsError || suggestedProductsMessage
		);
		if (!scienceBasicsResolved || !suggestedProductsResolved) return;

		setSearchState("done");
	}, [
		searchState,
		canSearch,
		searchingUiDone,
		scienceBasicsLoading,
		suggestedProductsLoading,
		scienceBasicsIngredients,
		scienceBasicsError,
		scienceBasicsMessage,
		suggestedProducts,
		suggestedProductsError,
		suggestedProductsMessage,
	]);

	const onHelpMe = () => {
		if (!canSearch) return;
		closeIngredientModal();
		setScienceBasicsLoading(false);
		setScienceBasicsError(null);
		setScienceBasicsMessage(null);
		setScienceBasicsIngredients(null);
		setSuggestedProductsLoading(false);
		setSuggestedProductsError(null);
		setSuggestedProductsMessage(null);
		setSuggestedProducts(null);
		setSearchState("searching");
	};

	const onReset = () => {
		closeIngredientModal();
		setScienceBasicsLoading(false);
		setScienceBasicsError(null);
		setScienceBasicsMessage(null);
		setScienceBasicsIngredients(null);
		setSuggestedProductsLoading(false);
		setSuggestedProductsError(null);
		setSuggestedProductsMessage(null);
		setSuggestedProducts(null);
		setSearchState("idle");
	};

	const onSelectConcern = (c: SkinConcern) => {
		closeIngredientModal();
		setSelectedConcern(c);
		setScienceBasicsLoading(false);
		setScienceBasicsError(null);
		setScienceBasicsMessage(null);
		setScienceBasicsIngredients(null);
		setSuggestedProductsLoading(false);
		setSuggestedProductsError(null);
		setSuggestedProductsMessage(null);
		setSuggestedProducts(null);
		setSearchState("idle");
	};

	const onSelectSkinType = (t: SkinType) => {
		closeIngredientModal();
		setSelectedSkinType(t);
		setScienceBasicsLoading(false);
		setScienceBasicsError(null);
		setScienceBasicsMessage(null);
		setScienceBasicsIngredients(null);
		setSuggestedProductsLoading(false);
		setSuggestedProductsError(null);
		setSuggestedProductsMessage(null);
		setSuggestedProducts(null);
		setSearchState("idle");
	};

	const searchingCopy = useMemo(() => {
		if (searchStep === 0) return "Searching relevant discussions...";
		if (searchStep === 1) return "Extracting consensus...";
		return "Preparing results...";
	}, [searchStep]);

	const microStatCopy = useMemo(() => {
		if (!selectedConcern || !selectedSkinType) return null;
		return `Selected: ${selectedConcern} - ${selectedSkinType}. Tap "Help me" to continue.`;
	}, [selectedConcern, selectedSkinType]);

	const progressValue = useMemo(() => {
		if (searchState === "idle") return 0;
		if (searchState === "done") return 100;
		if (searchStep === 0) return 33;
		if (searchStep === 1) return 66;
		return 90;
	}, [searchState, searchStep]);

	const resultSectionTitles = useMemo(
		() => [
			"Ingredient Guidance",
			"Community Guidance",
			"Suggested Products",
		],
		[]
	);

	return (
		<div className="max-w-[600px] md:mx-auto my-0 bg-base-100 shadow-md items-center p-3">
			<div className="grid grid-cols-1 mt-6 gap-2">
				<h1 className="text-lg font-bold text-neutral text-center">
					Skincare Intelligence
				</h1>
				<p className="text-xs opacity-70 text-center">
					To help your research. Provide your skin concern and skin type, and we help you understand what ingredients to look for, what the community says, and products you can try. 
				<br />
				<br />
					Our data is sourced from scientific literature and Reddit discussions, transparently displayed for your consideration.
				</p>

				<div className="border-base-300 border rounded-box bg-base-200 p-3 text-center">
					<div className="flex items-center justify-center gap-2">
						<span className="badge badge-warning text-xs whitespace-nowrap shrink-0">
							In development
						</span>
						<p className="text-xs opacity-70">
							This tool is still in development. We welcome any feedback at{" "}
							<a href="mailto:tom@thoroughbeauty.com" className="link link-primary">tom@thoroughbeauty.com</a>.
						</p>
					</div>
				</div>
			</div>

			{searchState === "idle" ? (
				<PickComboCard
					skinConcerns={SKIN_CONCERNS}
					skinTypes={SKIN_TYPES}
					selectedConcern={selectedConcern}
					selectedSkinType={selectedSkinType}
					microStatCopy={microStatCopy}
					canSearch={canSearch}
					searchState={searchState}
					onSelectConcern={onSelectConcern}
					onSelectSkinType={onSelectSkinType}
					onHelpMe={onHelpMe}
					onReset={onReset}
				/>
			) : null}

			{searchState === "searching" ? (
				<SearchingStatusCard
					searchingCopy={searchingCopy}
					progressValue={progressValue}
				/>
			) : null}

			{searchState === "done" && selectedConcern && selectedSkinType ? (
				<div className="mt-6 grid grid-cols-1 gap-4">
					<div className="flex items-center justify-center">
						<button type="button" className="btn btn-soft btn-sm" onClick={onReset}>
							Edit picks
						</button>
					</div>

					<div className="divider m-0"></div>

					{resultSectionTitles.map((title, index) => (
						<div
							key={title}
							className="card bg-base-100 rounded"
						>
							<div className="card-body p-4">
								<h2 className="text-sm font-bold text-neutral text-center">{title}</h2>
								{index === 0 ? (
									scienceBasicsLoading ? (
										<p className="mt-2 text-xs opacity-70 text-center">Loading...</p>
									) : scienceBasicsError ? (
										<p className="mt-2 text-xs opacity-70 text-center">{scienceBasicsError}</p>
									) : scienceBasicsMessage ? (
										<p className="mt-2 text-xs opacity-70 text-center">{scienceBasicsMessage}</p>
									) : scienceBasicsAllIngredients.length > 0 ? (
										<>
											<div className="mt-3 flex flex-wrap items-center justify-center gap-2">
												{scienceBasicsAllIngredients.map((ing) => (
													<button
														key={String(ing.id)}
														type="button"
														onClick={() => openIngredientModal(ing)}
														className={
															ing.effect === "HELPFUL"
																? "badge badge-lg badge-success cursor-pointer rounded-full text-xs"
																: "badge badge-lg badge-error cursor-pointer rounded-full text-xs"
														}
													>
														{ing.name}
													</button>
												))}
											</div>

												<p className="mt-3 text-sm opacity-70 text-center">
													Click an ingredient to learn why it&apos;s helpful (or why to avoid it).
												</p>

											<dialog
												ref={ingredientModalRef}
												className="modal"
											>
												<div className="modal-box bg-base-100">
													<form method="dialog">
														<button
															className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
															aria-label="Close"
															onClick={() => setActiveIngredient(null)}
														>
															✕
														</button>
													</form>

												{activeIngredient ? (
													<>
														<div className="flex items-center justify-between gap-2">
															<h3 className="text-sm font-bold text-neutral">{activeIngredient.name}</h3>
															<span
																className={
																	activeIngredient.effect === "HELPFUL"
																		? "badge badge-sm badge-success"
																		: "badge badge-sm badge-error"
																}
															>
																{activeIngredient.effect === "HELPFUL" ? "Helpful" : "Avoid"}
															</span>
														</div>

													<p className="mt-2 text-xs opacity-70">
														{activeIngredient.description ?? "No description yet."}
													</p>

													{activeIngredient.concernNote || activeIngredient.skinTypeNote ? (
														<ul className="mt-3 list-disc list-outside pl-5 text-xs opacity-70 space-y-1">
															{activeIngredient.concernNote ? (
																<li>
																	<span className="font-bold">
																		{activeIngredient.concernEffect === "AVOID"
																			? `Why you should avoid if you have ${selectedConcern}`
																			: `Why it helps with ${selectedConcern}`}
																	</span>
																	: {activeIngredient.concernNote}
																</li>
															) : null}
															{activeIngredient.skinTypeNote ? (
																<li>
																	<span className="font-bold">
																		{activeIngredient.skinTypeEffect === "AVOID"
																			? `Might be unsuitable for ${selectedSkinType} skin`
																			: `Suitable for ${selectedSkinType} skin`}
																	</span>
																	: {activeIngredient.skinTypeNote}
																</li>
															) : null}
														</ul>
													) : null}
												</>
											) : (
												<p className="text-xs opacity-70">No ingredient selected.</p>
											)}
											</div>
											<form method="dialog" className="modal-backdrop">
												<button aria-label="Close" onClick={() => setActiveIngredient(null)} />
											</form>
										</dialog>
										</>
									) : (
										<p className="mt-2 text-xs opacity-70 text-center">No ingredients found.</p>
									)
								) : index === 2 ? (
									suggestedProductsLoading ? (
										<p className="mt-2 text-xs opacity-70 text-center">Loading...</p>
									) : suggestedProductsError ? (
										<p className="mt-2 text-xs opacity-70 text-center">{suggestedProductsError}</p>
									) : suggestedProductsMessage ? (
										<p className="mt-2 text-xs opacity-70 text-center">{suggestedProductsMessage}</p>
									) : suggestedProducts && suggestedProducts.length > 0 ? (
										<div className="mt-3 grid grid-cols-1 gap-3">
											{suggestedProducts.slice(0, 3).map((p) => (
												<div key={String(p.id)} className="border-base-300 border rounded p-3">
													<p className="text-sm font-bold text-neutral">
														{p.brand ? `${p.brand} — ${p.title}` : p.title}
													</p>

													{p.reviews && p.reviews.length > 0 ? (
														<div className="mt-3 grid grid-cols-1 gap-3">
																	{p.reviews.slice(0, 2).map((r, idx) => {
																		const redditUrl = toRedditUrl(r.review_link);
																		return (
																			<div key={`${String(p.id)}-${idx}`} className="bg-base-200 rounded p-3">
																				<div className="flex items-center justify-between gap-2">
																					<p className="text-xs font-bold text-neutral">Reddit review</p>
																				</div>

																				{r.review_text ? (
																					<p className="mt-1 text-xs opacity-70">{r.review_text}</p>
																				) : null}

																				{redditUrl ? (
																					<a
																						href={redditUrl}
																						target="_blank"
																						rel="noreferrer"
																						className="mt-2 inline-block text-xs link link-primary"
																					>
																						Open thread
																					</a>
																				) : null}
																			</div>
																	);
																})}
														</div>
													) : (
														<p className="mt-2 text-xs opacity-70">No relevant reviews found yet.</p>
													)}
												</div>
											))}
										</div>
									) : (
										<p className="mt-2 text-xs opacity-70 text-center">No products found.</p>
									)
								) : (
									<p className="mt-2 text-xs opacity-70 text-center">Coming soon.</p>
								)}
								{index === 0 && !scienceBasicsLoading && !scienceBasicsError ? (
									<div className="mt-4 border-base-300 border rounded p-3 bg-base-200">
										<p className="text-xs font-bold text-neutral">Sources:</p>
										<ul className="mt-2 list-disc list-outside pl-5 text-xs opacity-70 space-y-1">
											<li>
												<span className="font-bold">coming soon</span>: source 1
											</li>
											<li>
												<span className="font-bold">coming soon</span>: source 2
											</li>
										</ul>
									</div>
								) : null}
						</div>
					</div>
				))}
				</div>
			) : null}
		</div>
	);
}
