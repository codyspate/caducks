import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../../db/schema";
import { getAllTopics } from "../../../lib/data";

export const GET: APIRoute = async (ctx) => {
	const db = drizzle(ctx.locals.runtime.env.DB, { schema });
	try {
		const topics = await getAllTopics(db);

		return new Response(JSON.stringify(topics), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Error fetching forum topics:", error);
		return new Response(JSON.stringify({ error: "Internal Server Error" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
};
