import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../../db/schema";
import { getAllLocations } from "../../../lib/data";

export const GET: APIRoute = async (ctx) => {
	const db = drizzle(ctx.locals.runtime.env.DB, { schema });
	try {
		const locations = await getAllLocations(db);

		return new Response(JSON.stringify(locations), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Error fetching locations:", error);
		return new Response(JSON.stringify({ error: "Internal Server Error" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
};
