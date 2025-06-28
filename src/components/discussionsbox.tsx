import React from "react";
import { Discussion } from "../types";

type DiscussionsBoxProps = {
    discussion_data: Discussion[];
    };

const DiscussionsBox: React.FC<DiscussionsBoxProps> = ({ discussion_data }) => (
    <div tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border shadow-lg mb-4">
        <input type="checkbox" defaultChecked={false} />
        <div className="collapse-title text-sm">
            <span className="font-bold">{discussion_data.length}</span> discussions analyzed
            <div>...</div>
        </div>
        <div className="collapse-content">
            <ul className="text-xs mt-2">
                {[...discussion_data]
                    .sort((a, b) => {
                        const subredditCompare = a.Subreddit.localeCompare(b.Subreddit);
                        if (subredditCompare !== 0) return subredditCompare;

                        // Parse dates for comparison
                        const parseDate = (dateValue: string) => {
                            if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
                                return new Date(dateValue).getTime();
                            } else if (!isNaN(Number(dateValue))) {
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
                                            dateObj = new Date(dateValue);
                                        } else if (!isNaN(Number(dateValue))) {
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
