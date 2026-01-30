import { passkeyClient } from "@better-auth/passkey/client";
import {
  inferAdditionalFields,
  twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { createAuth } from "./auth";

type Auth = ReturnType<typeof createAuth>;

export const authClient = createAuthClient({
  plugins: [twoFactorClient(), passkeyClient(), inferAdditionalFields<Auth>()],
});
