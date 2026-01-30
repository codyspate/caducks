import type {
	forum_posts,
	forum_topics,
	forum_votes,
	locations,
} from "./db/schema";

// Infer types directly from Drizzle schema
export type Location = typeof locations.$inferSelect;
export type ForumTopicRow = typeof forum_topics.$inferSelect;
export type ForumPostRow = typeof forum_posts.$inferSelect;
export type ForumVoteRow = typeof forum_votes.$inferSelect;

// Extended types for API responses that include joined data
export interface ForumTopic {
	id?: string;
	slug: string;
	title: string;
	author: string;
	userId?: string;
	voteCount?: number;
	createdAt: string;
	lastActive?: string;
	replies?: number;
	content?: string;
	posts?: ForumPost[];
}

export interface ForumPost {
	id: string;
	author: string;
	userId?: string;
	voteCount?: number;
	createdAt: string;
	content: string;
}
