"use client";

import type { SkinConcern, SkinType, SearchState } from "../types";

type Props = {
	skinConcerns: SkinConcern[];
	skinTypes: SkinType[];
	selectedConcern: SkinConcern | null;
	selectedSkinType: SkinType | null;
	microStatCopy: string | null;
	canSearch: boolean;
	searchState: SearchState;
	onSelectConcern: (c: SkinConcern) => void;
	onSelectSkinType: (t: SkinType) => void;
	onHelpMe: () => void;
	onReset: () => void;
};

export function PickComboCard({
	skinConcerns,
	skinTypes,
	selectedConcern,
	selectedSkinType,
	microStatCopy,
	canSearch,
	searchState,
	onSelectConcern,
	onSelectSkinType,
	onHelpMe,
	onReset,
}: Props) {
	return (
		<div className="mt-6 card bg-base-100 shadow-lg rounded border-base-300 border">
			<div className="card-body p-4">
				<div className="mt-4 grid grid-cols-2 gap-4">
					<div>
						<div className="flex flex-col items-start gap-1">
							<h3 className="text-xs font-bold text-neutral">Skin concern</h3>
							{selectedConcern ? (
								<span className="badge badge-sm badge-soft badge-secondary">{selectedConcern}</span>
							) : (
								<span className="badge badge-sm badge-soft badge-neutral">Choose 1</span>
							)}
						</div>

						<div className="mt-3 flex flex-col gap-2">
							{skinConcerns.map((c) => (
								<button
									key={c}
									type="button"
									className={
										selectedConcern === c
											? "btn btn-sm min-h-10 btn-secondary justify-start text-left whitespace-normal"
											: "btn btn-sm min-h-10 btn-soft btn-secondary justify-start text-left whitespace-normal"
									}
									onClick={() => onSelectConcern(c)}
								>
									{c}
								</button>
							))}
						</div>
					</div>

					<div>
						<div className="flex flex-col items-start gap-1">
							<h3 className="text-xs font-bold text-neutral">Skin type</h3>
							{selectedSkinType ? (
								<span className="badge badge-sm badge-soft badge-secondary">{selectedSkinType}</span>
							) : (
								<span className="badge badge-sm badge-soft badge-neutral">Choose 1</span>
							)}
						</div>

						<div className="mt-3 flex flex-col gap-2">
							{skinTypes.map((t) => (
								<button
									key={t}
									type="button"
									className={
										selectedSkinType === t
											? "btn btn-sm min-h-10 btn-secondary justify-start text-left whitespace-normal"
											: "btn btn-sm min-h-10 btn-soft btn-secondary justify-start text-left whitespace-normal"
									}
									onClick={() => onSelectSkinType(t)}
								>
									{t}
								</button>
							))}
						</div>
					</div>
				</div>

				{microStatCopy ? (
					<p className="mt-3 text-xs opacity-70 text-center">{microStatCopy}</p>
				) : null}

				<div className="mt-5 flex items-center justify-center gap-2">
					<button
						type="button"
						className="btn btn-primary"
						disabled={!canSearch || searchState === "searching"}
						onClick={onHelpMe}
					>
						Help me
					</button>
					{searchState !== "idle" ? (
						<button type="button" className="btn btn-soft" onClick={onReset}>
							Edit picks
						</button>
					) : null}
				</div>
			</div>
		</div>
	);
}
