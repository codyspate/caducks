import { useState } from "react";
import { authClient } from "../lib/auth-client";

interface UserWithDisplayName {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  displayName?: string | null;
}

interface Props {
  initialUser?: UserWithDisplayName | null;
}

export default function UserMenu({ initialUser }: Props) {
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const user = (
    isPending ? initialUser : session?.user
  ) as UserWithDisplayName | null;
  const isLoading = isPending && !initialUser;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await authClient.signOut();
    window.location.href = "/";
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 min-w-15">
        <div className="h-9 w-9 rounded-full bg-neutral-800 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4 min-w-15">
        <a
          href="/signin"
          className="text-neutral-300 hover:text-amber-400 font-medium transition-colors text-sm"
        >
          Sign In
        </a>
      </div>
    );
  }

  const displayName = user.displayName || user.name;

  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:flex flex-col items-end">
        <span className="text-sm font-bold text-neutral-200">
          {displayName}
        </span>
        <span className="text-xs text-neutral-500">{user.email}</span>
      </div>
      <div className="relative group">
        {user.image ? (
          <img
            src={user.image}
            alt={displayName}
            className="h-9 w-9 rounded-full border border-neutral-700 bg-neutral-800 object-cover cursor-pointer"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-amber-900/50 border border-amber-700/50 flex items-center justify-center text-amber-400 font-bold cursor-pointer">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute right-0 top-full mt-2 w-32 bg-neutral-900 border border-neutral-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-amber-400 transition-colors"
          >
            Profile
          </a>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-amber-400 transition-colors"
          >
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </div>
  );
}
