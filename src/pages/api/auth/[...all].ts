import type { APIRoute } from "astro";
import { createAuth } from "../../../lib/auth";

// export const GET: APIRoute = async (ctx) => {
//   const auth = createAuth(ctx.locals.runtime.env);
//   return auth.handler(ctx.request);
// };

// export const POST: APIRoute = async (ctx) => {
//   const auth = createAuth(ctx.locals.runtime.env);
//   return auth.handler(ctx.request);
// };

export const ALL: APIRoute = async (ctx) => {
	// If you want to use rate limiting, make sure to set the 'x-forwarded-for' header to the request headers from the context
	// ctx.request.headers.set("x-forwarded-for", ctx.clientAddress);
	const auth = createAuth(ctx.locals.runtime.env);
	return auth.handler(ctx.request);
};
