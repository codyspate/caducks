import { defineMiddleware } from "astro:middleware";
import { createAuth } from "./lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const env = context.locals.runtime.env;
  const auth = createAuth(env);

  const session = await auth.api.getSession({
    headers: context.request.headers,
  });

  context.locals.user = session?.user ?? null;
  context.locals.session = session?.session ?? null;
  context.locals.env = env;

  const response = await next();
  response.headers.set("Cache-Control", "no-transform");
  return response;
});
