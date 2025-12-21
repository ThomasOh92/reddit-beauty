export function SentimentBar({
  positiveMentions,
  neutralMentions,
  negativeMentions,
}: {
  positiveMentions: number;
  neutralMentions: number;
  negativeMentions: number;
}) {
  const totalMentions = positiveMentions + neutralMentions + negativeMentions;

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
    <div className="mt-2">
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
