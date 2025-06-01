import React from "react";
import { Discussion } from "../types";

type DiscussionsBoxProps = {
    discussion_data: Discussion[];
    };

const DiscussionsBox: React.FC<DiscussionsBoxProps> = ({ discussion_data }) => (
    <div tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border shadow-lg mb-4">
        <input type="checkbox" defaultChecked />
        <div className="collapse-title font-semibold">
            Discussions Analyzed
        </div>
        <div className="collapse-content">
            <ul className="text-xs mt-2">
                {discussion_data.map((discussion, index) => (
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
