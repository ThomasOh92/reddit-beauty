import React from "react";
import { Discussion } from "../types";

type DiscussionsBoxProps = {
  discussion_data?: Discussion[]; // ✅ optional, safer
};

const DiscussionsBox: React.FC<DiscussionsBoxProps> = ({ discussion_data }) => {
  const safeDiscussions = Array.isArray(discussion_data) ? discussion_data : [];

  return (
    <div
      tabIndex={0}
      className="collapse collapse-arrow bg-base-100 border-base-300 border shadow-lg mb-2"
    >
      <input type="checkbox" defaultChecked={false} />
      <div className="collapse-title text-sm">
        <span className="font-bold">{safeDiscussions.length}</span> discussions analyzed
      </div>
      <div className="collapse-content">
        <ul className="text-xs mt-2">
          {[...safeDiscussions]
            .sort((a, b) => {
              const subredditA = a.Subreddit || "";
              const subredditB = b.Subreddit || "";
              const subredditCompare = subredditA.localeCompare(subredditB);
              if (subredditCompare !== 0) return subredditCompare;

              const parseDate = (dateValue: string) => {
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
                  return new Date(dateValue).getTime();
                }
                if (/^\d{2}-\d{2}-\d{2}$/.test(dateValue)) {
                  const [yy, mm, dd] = dateValue.split("-");
                  const fullYear = Number(yy) < 50 ? `20${yy}` : `19${yy}`;
                  return new Date(`${fullYear}-${mm}-${dd}`).getTime();
                }
                if (!isNaN(Number(dateValue))) {
                  return parseFloat(dateValue) * 1000;
                }
                return 0;
              };

              return parseDate(b.date) - parseDate(a.date);
            })
            .map((discussion, index) => (
              <li key={index} className="mb-1 line-clamp-1">
                <a
                  href={`https://reddit.com${discussion.permalink}`}
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
                      } else if (/^\d{2}-\d{2}-\d{2}$/.test(dateValue)) {
                        const [yy, mm, dd] = dateValue.split("-");
                        const fullYear = Number(yy) < 50 ? `20${yy}` : `19${yy}`;
                        dateObj = new Date(`${fullYear}-${mm}-${dd}`);
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
};

export default DiscussionsBox;
