"use client";

import { Terminal } from "lucide-react";

type Props = {
	searchingCopy: string;
	progressValue: number;
};

export function SearchingStatusCard({
	searchingCopy,
	progressValue,
}: Props) {
	return (
		<div className="mt-4 card bg-base-200 shadow-sm border border-base-300">
			<div className="card-body p-4">
				<div className="flex items-start gap-3">
					<div className="mt-0.5">
						<Terminal className="size-4" aria-hidden="true" />
					</div>
					<div className="flex-1">
						<div className="text-xs font-mono font-semibold">{searchingCopy}</div>
						<div className="mt-2 flex items-center gap-3">
							<progress
								className="progress progress-primary w-56"
								value={progressValue}
								max={100}
							/>
							<span className="text-[0.7rem] font-mono opacity-70">{progressValue}%</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
