import { actions } from "astro:actions";
import { useState } from "react";

interface ForumVoteProps {
  topicId?: string;
  postId?: string;
  initialVoteCount: number;
  initialUserVote: number;
  isLoggedIn: boolean;
}

export default function ForumVote({
  topicId,
  postId,
  initialVoteCount,
  initialUserVote,
  isLoggedIn,
}: ForumVoteProps) {
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [isLoading, setIsLoading] = useState(false);

  const vote = async (value: number) => {
    if (!isLoggedIn || isLoading) return;

    const newValue = userVote === value ? 0 : value;

    setIsLoading(true);

    const { data, error } = await actions.forum.vote({
      topicId,
      postId,
      value: newValue,
    });

    setIsLoading(false);

    if (error) {
      console.error("Vote failed:", error);
      return;
    }

    if (data?.success) {
      if (data.voteCount !== null) {
        setVoteCount(data.voteCount);
      }
      setUserVote(data.userVote);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => vote(1)}
        disabled={!isLoggedIn || isLoading}
        className={`p-1 rounded transition-colors ${
          userVote === 1
            ? "text-amber-500"
            : "text-neutral-500 hover:text-neutral-300"
        } ${!isLoggedIn ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        title={isLoggedIn ? "Upvote" : "Sign in to vote"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <span
        className={`text-sm font-medium min-w-[2ch] text-center ${
          voteCount > 0
            ? "text-amber-500"
            : voteCount < 0
              ? "text-red-500"
              : "text-neutral-400"
        }`}
      >
        {voteCount}
      </span>
      <button
        type="button"
        onClick={() => vote(-1)}
        disabled={!isLoggedIn || isLoading}
        className={`p-1 rounded transition-colors ${
          userVote === -1
            ? "text-red-500"
            : "text-neutral-500 hover:text-neutral-300"
        } ${!isLoggedIn ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        title={isLoggedIn ? "Downvote" : "Sign in to vote"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
