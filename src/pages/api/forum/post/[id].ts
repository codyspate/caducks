import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../../../db/schema";

export const DELETE: APIRoute = async (ctx) => {
	const user = ctx.locals.user;
	if (!user) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	const { id } = ctx.params;
	if (!id) {
		return new Response(JSON.stringify({ error: "Post ID required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	const db = drizzle(ctx.locals.runtime.env.DB, { schema });

	// Check ownership
	const post = await db
		.select({ userId: schema.forum_posts.userId })
		.from(schema.forum_posts)
		.where(eq(schema.forum_posts.id, id))
		.limit(1);

	if (!post[0]) {
		return new Response(JSON.stringify({ error: "Post not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	if (post[0].userId !== user.id) {
		return new Response(JSON.stringify({ error: "Not authorized" }), {
			status: 403,
			headers: { "Content-Type": "application/json" },
		});
	}

	// Delete related votes first
	await db.delete(schema.forum_votes).where(eq(schema.forum_votes.postId, id));

	// Delete the post
	await db.delete(schema.forum_posts).where(eq(schema.forum_posts.id, id));

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
