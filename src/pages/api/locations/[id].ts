import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../../db/schema";

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
		return new Response(JSON.stringify({ error: "Location ID required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	const db = drizzle(ctx.locals.runtime.env.DB, { schema });

	// Check ownership
	const location = await db
		.select({ userId: schema.locations.userId })
		.from(schema.locations)
		.where(eq(schema.locations.id, id))
		.limit(1);

	if (!location[0]) {
		return new Response(JSON.stringify({ error: "Location not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	if (location[0].userId !== user.id) {
		return new Response(JSON.stringify({ error: "Not authorized" }), {
			status: 403,
			headers: { "Content-Type": "application/json" },
		});
	}

	// Delete related votes first
	await db
		.delete(schema.location_votes)
		.where(eq(schema.location_votes.locationId, id));

	// Delete related edits
	await db
		.delete(schema.location_edits)
		.where(eq(schema.location_edits.locationId, id));

	// Delete the location
	await db.delete(schema.locations).where(eq(schema.locations.id, id));

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
