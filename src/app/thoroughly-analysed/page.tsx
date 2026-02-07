import Image from "next/image";
import Link from "next/link";
import { thoroughlyAnalysedProducts } from "./data";

export default function ThoroughlyAnalysedIndexPage() {
	return (
		<div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md p-4">
			<section className="rounded-2xl border border-base-200 bg-[linear-gradient(125deg,#f8fafc,#fff7ed)] p-4">
				<div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
					Thoroughly Analysed
				</div>
				<h1 className="mt-1 text-xl font-bold text-neutral-900">
					Deep Reads
				</h1>
				<p className="mt-2 text-sm text-neutral-600">
					I surface valuable reviews from Reddit and include links to high-trust sources about the product.
				</p>
				<p className="mt-2 text-xs text-neutral-500">
					(more coming...)
				</p>
			</section>

			<div className="mt-4 grid gap-4">
				{thoroughlyAnalysedProducts.map((product) => (
					<Link
						key={product.slug}
						href={`/thoroughly-analysed/${product.slug}`}
						className="group rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm transition hover:border-neutral-300"
					>
						<div className="flex flex-col gap-4 md:flex-row md:items-center">
							<div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm">
								<Image
									src={product.imageUrl}
									alt={product.name}
									fill
									sizes="96px"
									className="object-contain p-2"
								/>
							</div>
							<div className="flex-1">
								<div className="text-xs font-semibold text-neutral-900">
									{product.name}
								</div>
								<p className="mt-1 text-xs text-neutral-500">
									Category: {product.category}
								</p>
								<div className="mt-3 flex flex-wrap gap-2 text-[11px] text-neutral-500">
									<span>Checked {product.lastChecked}</span>
								</div>
							</div>
							<div className="text-xs font-semibold text-primary transition group-hover:translate-x-1">
								View analysis
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
