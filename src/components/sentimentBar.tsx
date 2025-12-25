export function SentimentBar({
  positiveMentions,
  neutralMentions,
  negativeMentions,
  className,
  variant = "bar",
}: {
  positiveMentions: number;
  neutralMentions: number;
  negativeMentions: number;
  className?: string;
  variant?: "bar" | "summary";
}) {
  const totalMentions = positiveMentions + neutralMentions + negativeMentions;

  const getVerdict = () => {
    if (!totalMentions) return "No mentions yet";
    const positiveShare = positiveMentions / totalMentions;
    const negativeShare = negativeMentions / totalMentions;

    if (positiveShare >= 0.6) return `Mostly positive (${positiveMentions}/${totalMentions})`;
    if (negativeShare >= 0.6) return `Mostly negative (${negativeMentions}/${totalMentions})`;
    if (positiveMentions === negativeMentions && neutralMentions > 0) return `Mixed (${totalMentions} mentions)`;
    return `Mixed (${positiveMentions}/${totalMentions} positive)`;
  };

  if (variant === "summary") {
    return (
      <div className={className ?? "mt-2"}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[10px] text-gray-500 uppercase tracking-wide">
              Mentions
            </div>
            <div className="text-xs text-gray-700 font-semibold leading-tight">
              {getVerdict()}
            </div>
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wide whitespace-nowrap">
            {totalMentions} total
          </div>
        </div>

        <div className="mt-1 flex flex-wrap gap-1">
          <span className="badge badge-sm badge-soft badge-success">+{positiveMentions}</span>
          <span className="badge badge-sm badge-soft badge-warning">•{neutralMentions}</span>
          <span className="badge badge-sm badge-soft badge-error">−{negativeMentions}</span>
        </div>
      </div>
    );
  }

  const positivePercent = totalMentions
    ? (positiveMentions / totalMentions) * 100
    : 0;
  const neutralPercent = totalMentions
    ? (neutralMentions / totalMentions) * 100
    : 0;
  const negativePercent = totalMentions
    ? (negativeMentions / totalMentions) * 100
    : 0;

  return (
    <div className={className ?? "mt-2"}>
      <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-wide mb-1">
        <span>Sentiment</span>
        <span>{totalMentions} mentions</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden bg-base-200 flex">
        <div
          className="h-full bg-green-500"
          style={{ width: `${positivePercent}%` }}
        />
        <div
          className="h-full bg-yellow-400"
          style={{ width: `${neutralPercent}%` }}
        />
        <div
          className="h-full bg-red-500"
          style={{ width: `${negativePercent}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-600 mt-1">
        <span>{positiveMentions} positive</span>
        <span>{neutralMentions} neutral</span>
        <span>{negativeMentions} negative</span>
      </div>
    </div>
  );
}
