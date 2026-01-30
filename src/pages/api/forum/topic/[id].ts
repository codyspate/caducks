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
		return new Response(JSON.stringify({ error: "Topic ID required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	const db = drizzle(ctx.locals.runtime.env.DB, { schema });

	// Check ownership
	const topic = await db
		.select({ userId: schema.forum_topics.userId })
		.from(schema.forum_topics)
		.where(eq(schema.forum_topics.id, id))
		.limit(1);

	if (!topic[0]) {
		return new Response(JSON.stringify({ error: "Topic not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	if (topic[0].userId !== user.id) {
		return new Response(JSON.stringify({ error: "Not authorized" }), {
			status: 403,
			headers: { "Content-Type": "application/json" },
		});
	}

	// Delete related votes first
	await db.delete(schema.forum_votes).where(eq(schema.forum_votes.topicId, id));

	// Delete related posts and their votes
	const posts = await db
		.select({ id: schema.forum_posts.id })
		.from(schema.forum_posts)
		.where(eq(schema.forum_posts.topicId, id));

	for (const post of posts) {
		await db
			.delete(schema.forum_votes)
			.where(eq(schema.forum_votes.postId, post.id));
	}

	await db.delete(schema.forum_posts).where(eq(schema.forum_posts.topicId, id));

	// Delete the topic
	await db.delete(schema.forum_topics).where(eq(schema.forum_topics.id, id));

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
