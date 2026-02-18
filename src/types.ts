import type {
  forum_posts,
  forum_topics,
  forum_votes,
  locations,
  journal_entries,
  journal_harvests,
} from "./db/schema";

// Infer types directly from Drizzle schema
export type Location = typeof locations.$inferSelect;
export type ForumTopicRow = typeof forum_topics.$inferSelect;
export type ForumPostRow = typeof forum_posts.$inferSelect;
export type ForumVoteRow = typeof forum_votes.$inferSelect;
export type JournalEntryRow = typeof journal_entries.$inferSelect;
export type JournalHarvestRow = typeof journal_harvests.$inferSelect;

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

export interface JournalEntry {
  id: string;
  huntDate: Date;
  numHunters: number;
  locationId: string;
  locationName?: string;
  notes?: string | null;
  weather?: string | null;
  userId: string;
  author?: string;
  createdAt: Date;
  updatedAt: Date;
  harvests?: JournalHarvest[];
}

export interface JournalHarvest {
  id: string;
  journalEntryId: string;
  birdType: string;
  count: number;
}
