import React from "react";
import { Discussion } from "../types";

type DiscussionsBoxProps = {
    discussion_data: Discussion[];
    };

const DiscussionsBox: React.FC<DiscussionsBoxProps> = ({ discussion_data }) => (
    <div tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border shadow-lg mb-4">
        <input type="checkbox" defaultChecked={false} />
        <div className="collapse-title text-sm">
            <span className="font-bold">{Array.isArray(discussion_data) ? discussion_data.length : 0}</span> discussions analyzed
            <div>...</div>
        </div>
        <div className="collapse-content">
            <ul className="text-xs mt-2">
                {[...discussion_data]
                    .sort((a, b) => {
                        const subredditA = a.Subreddit || "";
                        const subredditB = b.Subreddit || "";
                        const subredditCompare = subredditA.localeCompare(subredditB);
                        if (subredditCompare !== 0) return subredditCompare;

                        // Parse dates for comparison
                        const parseDate = (dateValue: string) => {
                            // Match YYYY-MM-DD
                            if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
                                return new Date(dateValue).getTime();
                            }
                            // Match YY-MM-DD (assume 20YY)
                            if (/^\d{2}-\d{2}-\d{2}$/.test(dateValue)) {
                                const [yy, mm, dd] = dateValue.split("-");
                                const fullYear = Number(yy) < 50 ? `20${yy}` : `19${yy}`;
                                return new Date(`${fullYear}-${mm}-${dd}`).getTime();
                            }
                            // Unix timestamp
                            if (!isNaN(Number(dateValue))) {
                                return parseFloat(dateValue) * 1000;
                            }
                            return 0;
                        };

                        return parseDate(b.date) - parseDate(a.date); // Descending by date
                    })
                    .map((discussion, index) => (
                        <li key={index} className="mb-1 line-clamp-1">
                            <a
                                href={discussion.thread_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link link-hover"
                            >
                                R/{discussion.Subreddit}: {discussion.thread_title}
                                <span className="text-gray-400">
                                    {" "}
                                    {(() => {
                                        const dateValue = discussion.date;
                                        let dateObj;
                                        if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
                                            // YYYY-MM-DD
                                            dateObj = new Date(dateValue);
                                        } else if (/^\d{2}-\d{2}-\d{2}$/.test(dateValue)) {
                                            // YY-MM-DD (assume 20YY for <50, 19YY otherwise)
                                            const [yy, mm, dd] = dateValue.split("-");
                                            const fullYear = Number(yy) < 50 ? `20${yy}` : `19${yy}`;
                                            dateObj = new Date(`${fullYear}-${mm}-${dd}`);
                                        } else if (!isNaN(Number(dateValue))) {
                                            // Unix timestamp
                                            dateObj = new Date(parseFloat(dateValue) * 1000);
                                        } else {
                                            return "Invalid date";
                                        }
                                        return dateObj.toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        });
                                    })()}
                                </span>
                            </a>
                        </li>
                    ))}
            </ul>
        </div>
    </div>
);

export default DiscussionsBox;
