import { actions } from "astro:actions";
import { useEffect, useRef, useState } from "react";

interface VoteComponentProps {
  locationId: string;
  initialCount: number;
  initialUserVote: number;
  isLoggedIn: boolean;
}

export default function VoteComponent({
  locationId,
  initialCount,
  initialUserVote,
  isLoggedIn,
}: VoteComponentProps) {
  const [voteCount, setVoteCount] = useState(initialCount);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  const vote = async (value: number) => {
    if (!isLoggedIn || isLoading) return;

    const newValue = userVote === value ? 0 : value;

    setIsLoading(true);

    const { data, error } = await actions.locations.vote({
      locationId,
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
    <div className="flex items-center gap-1 bg-neutral-900 rounded-lg p-1.5 border border-neutral-800 shadow-sm">
      <div className="relative flex items-center" ref={tooltipRef}>
        <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider mr-1 ml-2">
          Verify
        </span>
        <button
          type="button"
          onClick={() => setShowTooltip(!showTooltip)}
          className="text-neutral-500 hover:text-neutral-300 transition-colors p-0.5"
          aria-label="What is verification?"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        {showTooltip && (
          <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-50 text-sm">
            <p className="text-neutral-200 font-medium mb-1">
              Help others find reliable info
            </p>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Upvote locations with accurate, up-to-date information. Downvote
              outdated or incorrect listings. High-rated locations appear more
              trustworthy to fellow hunters.
            </p>
            <div className="absolute -top-1.5 left-4 w-3 h-3 bg-neutral-800 border-l border-t border-neutral-700 rotate-45" />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => vote(1)}
        disabled={!isLoggedIn || isLoading}
        className={`p-1 rounded transition-colors ${
          userVote === 1
            ? "text-amber-500 bg-amber-500/10"
            : "text-neutral-400 hover:text-amber-400 hover:bg-neutral-800"
        } ${!isLoggedIn ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        title={isLoggedIn ? "Upvote" : "Sign in to vote"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>

      <span
        className={`font-bold min-w-6 text-center text-sm ${
          voteCount > 0
            ? "text-amber-500"
            : voteCount < 0
              ? "text-red-500"
              : "text-neutral-300"
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
            ? "text-red-500 bg-red-500/10"
            : "text-neutral-400 hover:text-red-400 hover:bg-neutral-800"
        } ${!isLoggedIn ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        title={isLoggedIn ? "Downvote" : "Sign in to vote"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  );
}
