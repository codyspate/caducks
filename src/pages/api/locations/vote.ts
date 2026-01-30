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
		const { locationId, value } = body as {
			locationId: string;
			value: number;
		};

		// Validate input
		if (!locationId) {
			return new Response(JSON.stringify({ error: "locationId required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		if (value !== 1 && value !== -1 && value !== 0) {
			return new Response(
				JSON.stringify({ error: "value must be 1, -1, or 0" }),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		// Find existing vote
		const existingVote = await db
			.select()
			.from(schema.location_votes)
			.where(
				and(
					eq(schema.location_votes.userId, user.id),
					eq(schema.location_votes.locationId, locationId),
				),
			)
			.limit(1);

		const oldValue = existingVote[0]?.value ?? 0;
		const valueDiff = value - oldValue;

		if (valueDiff === 0) {
			// No change needed
			return new Response(
				JSON.stringify({ success: true, voteCount: null, userVote: value }),
				{
					status: 200,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		// Update or insert vote
		if (existingVote[0]) {
			if (value === 0) {
				// Remove vote
				await db
					.delete(schema.location_votes)
					.where(eq(schema.location_votes.id, existingVote[0].id));
			} else {
				// Update vote
				await db
					.update(schema.location_votes)
					.set({ value })
					.where(eq(schema.location_votes.id, existingVote[0].id));
			}
		} else if (value !== 0) {
			// Insert new vote
			await db.insert(schema.location_votes).values({
				id: nanoid(),
				userId: user.id,
				locationId,
				value,
				createdAt: new Date(),
			});
		}

		// Update verified_count on location
		await db
			.update(schema.locations)
			.set({
				verified_count: sql`${schema.locations.verified_count} + ${valueDiff}`,
			})
			.where(eq(schema.locations.id, locationId));

		const updated = await db
			.select({ verified_count: schema.locations.verified_count })
			.from(schema.locations)
			.where(eq(schema.locations.id, locationId))
			.limit(1);

		const newVoteCount = updated[0]?.verified_count ?? 0;

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
