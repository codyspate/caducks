import type { APIRoute } from "astro";
import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { nanoid } from "nanoid";
import * as schema from "../../../db/schema";

export const POST: APIRoute = async (ctx) => {
	const user = ctx.locals.user;
	if (!user) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	const db = drizzle(ctx.locals.runtime.env.DB, { schema });

	try {
		const body = await ctx.request.json();
		const { topicId, postId, value } = body as {
			topicId?: string;
			postId?: string;
			value: number;
		};

		// Validate input
		if (!topicId && !postId) {
			return new Response(
				JSON.stringify({ error: "topicId or postId required" }),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		if (value !== 1 && value !== -1 && value !== 0) {
			return new Response(
				JSON.stringify({ error: "value must be 1, -1, or 0" }),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		// Build conditions for finding existing vote
		const conditions = [eq(schema.forum_votes.userId, user.id)];
		if (topicId) {
			conditions.push(eq(schema.forum_votes.topicId, topicId));
		}
		if (postId) {
			conditions.push(eq(schema.forum_votes.postId, postId));
		}

		// Find existing vote
		const existingVote = await db
			.select()
			.from(schema.forum_votes)
			.where(and(...conditions))
			.limit(1);

		const oldValue = existingVote[0]?.value ?? 0;
		const valueDiff = value - oldValue;

		if (valueDiff === 0) {
			// No change needed
			return new Response(JSON.stringify({ success: true, voteCount: null }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		}

		// Update or insert vote
		if (existingVote[0]) {
			if (value === 0) {
				// Remove vote
				await db
					.delete(schema.forum_votes)
					.where(eq(schema.forum_votes.id, existingVote[0].id));
			} else {
				// Update vote
				await db
					.update(schema.forum_votes)
					.set({ value })
					.where(eq(schema.forum_votes.id, existingVote[0].id));
			}
		} else if (value !== 0) {
			// Insert new vote
			await db.insert(schema.forum_votes).values({
				id: nanoid(),
				userId: user.id,
				topicId: topicId ?? null,
				postId: postId ?? null,
				value,
				createdAt: new Date(),
			});
		}

		// Update vote count on topic or post
		let newVoteCount: number;
		if (topicId) {
			await db
				.update(schema.forum_topics)
				.set({
					voteCount: sql`${schema.forum_topics.voteCount} + ${valueDiff}`,
				})
				.where(eq(schema.forum_topics.id, topicId));

			const updated = await db
				.select({ voteCount: schema.forum_topics.voteCount })
				.from(schema.forum_topics)
				.where(eq(schema.forum_topics.id, topicId))
				.limit(1);
			newVoteCount = updated[0]?.voteCount ?? 0;
		} else if (postId) {
			await db
				.update(schema.forum_posts)
				.set({
					voteCount: sql`${schema.forum_posts.voteCount} + ${valueDiff}`,
				})
				.where(eq(schema.forum_posts.id, postId));

			const updated = await db
				.select({ voteCount: schema.forum_posts.voteCount })
				.from(schema.forum_posts)
				.where(eq(schema.forum_posts.id, postId))
				.limit(1);
			newVoteCount = updated[0]?.voteCount ?? 0;
		} else {
			newVoteCount = 0;
		}

		return new Response(
			JSON.stringify({
				success: true,
				voteCount: newVoteCount,
				userVote: value,
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	} catch (error) {
		console.error("Vote error:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};
