import { and, count, desc, eq, gt, like, or } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import type { ForumPost, ForumTopic, Location } from "../types";

const { locations, forum_topics, forum_posts, forum_votes, user } = schema;

const VOTE_THRESHOLD = -3;
export const DEFAULT_PAGE_SIZE = 10;

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  searchQuery?: string;
}

// --- Locations Helpers ---

export async function getAllLocations(
  db: DrizzleD1Database<typeof schema>,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  search?: string,
): Promise<PaginatedResult<Location>> {
  const offset = (page - 1) * pageSize;

  // Build where conditions
  const baseCondition = gt(locations.verified_count, VOTE_THRESHOLD);
  const searchPattern = search ? `%${search}%` : null;
  const whereCondition = searchPattern
    ? and(
        baseCondition,
        or(
          like(locations.name, searchPattern),
          like(locations.description, searchPattern),
        ),
      )
    : baseCondition;

  // Get total count
  const countResult = await db
    .select({ count: count() })
    .from(locations)
    .where(whereCondition);
  const totalItems = countResult[0]?.count ?? 0;

  // Get paginated results
  const results = await db
    .select()
    .from(locations)
    .where(whereCondition)
    .orderBy(desc(locations.createdAt))
    .limit(pageSize)
    .offset(offset);

  const items = results.map((location) => ({
    ...location,
    contact_phone: location.contact_phone ?? null,
    contact_email: location.contact_email ?? null,
    contact_website: location.contact_website ?? null,
    description: location.description ?? "",
  }));

  return {
    items,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    currentPage: page,
    pageSize,
    searchQuery: search,
  };
}

export async function getLocationBySlug(
  db: DrizzleD1Database<typeof schema>,
  slug: string,
): Promise<(Location & { lastUpdatedByName?: string | null }) | undefined> {
  const result = await db
    .select({
      location: locations,
      lastUpdatedByName: user.displayName,
      lastUpdatedByUserName: user.name,
    })
    .from(locations)
    .leftJoin(user, eq(locations.lastUpdatedByUserId, user.id))
    .where(
      and(
        eq(locations.slug, slug),
        gt(locations.verified_count, VOTE_THRESHOLD),
      ),
    )
    .limit(1);
  if (!result[0]) return undefined;

  const { location, lastUpdatedByName, lastUpdatedByUserName } = result[0];
  return {
    ...location,
    contact_phone: location.contact_phone ?? null,
    contact_email: location.contact_email ?? null,
    contact_website: location.contact_website ?? null,
    description: location.description ?? "",
    lastUpdatedByName: lastUpdatedByName || lastUpdatedByUserName || null,
  };
}

// --- Forum Helpers ---

export async function getAllTopics(
  db: DrizzleD1Database<typeof schema>,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  search?: string,
): Promise<PaginatedResult<ForumTopic>> {
  const offset = (page - 1) * pageSize;

  // Build where conditions
  const baseCondition = gt(forum_topics.voteCount, VOTE_THRESHOLD);
  const searchPattern = search ? `%${search}%` : null;
  const whereCondition = searchPattern
    ? and(
        baseCondition,
        or(
          like(forum_topics.title, searchPattern),
          like(forum_topics.content, searchPattern),
        ),
      )
    : baseCondition;

  // Get total count
  const countResult = await db
    .select({ count: count() })
    .from(forum_topics)
    .where(whereCondition);
  const totalItems = countResult[0]?.count ?? 0;

  // Get paginated results
  const results = await db
    .select({
      id: forum_topics.id,
      slug: forum_topics.slug,
      title: forum_topics.title,
      authorName: user.name,
      authorDisplayName: user.displayName,
      userId: forum_topics.userId,
      createdAt: forum_topics.createdAt,
      lastActive: forum_topics.updatedAt,
      content: forum_topics.content,
      voteCount: forum_topics.voteCount,
      replies: count(forum_posts.id),
    })
    .from(forum_topics)
    .leftJoin(user, eq(forum_topics.userId, user.id))
    .leftJoin(forum_posts, eq(forum_topics.id, forum_posts.topicId))
    .where(whereCondition)
    .groupBy(
      forum_topics.id,
      forum_topics.slug,
      forum_topics.title,
      user.name,
      user.displayName,
      forum_topics.userId,
      forum_topics.createdAt,
      forum_topics.updatedAt,
      forum_topics.content,
      forum_topics.voteCount,
    )
    .orderBy(desc(forum_topics.updatedAt))
    .limit(pageSize)
    .offset(offset);

  const items = results.map((topic) => ({
    id: topic.id,
    slug: topic.slug,
    title: topic.title,
    author: topic.authorDisplayName || topic.authorName || "Unknown",
    userId: topic.userId,
    voteCount: topic.voteCount,
    createdAt: topic.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    lastActive: topic.lastActive.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    replies: topic.replies,
    posts: [],
  }));

  return {
    items,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    currentPage: page,
    pageSize,
    searchQuery: search,
  };
}

export async function getTopicBySlug(
  db: DrizzleD1Database<typeof schema>,
  slug: string,
): Promise<ForumTopic | undefined> {
  const topicResult = await db
    .select({
      id: forum_topics.id,
      slug: forum_topics.slug,
      title: forum_topics.title,
      content: forum_topics.content,
      authorName: user.name,
      authorDisplayName: user.displayName,
      userId: forum_topics.userId,
      voteCount: forum_topics.voteCount,
      createdAt: forum_topics.createdAt,
      updatedAt: forum_topics.updatedAt,
    })
    .from(forum_topics)
    .leftJoin(user, eq(forum_topics.userId, user.id))
    .where(
      and(
        eq(forum_topics.slug, slug),
        gt(forum_topics.voteCount, VOTE_THRESHOLD),
      ),
    )
    .limit(1);

  if (!topicResult.length) {
    return undefined;
  }

  const topicData = topicResult[0];

  // Filter out posts with vote count <= threshold
  const postsResult = await db
    .select({
      id: forum_posts.id,
      content: forum_posts.content,
      createdAt: forum_posts.createdAt,
      authorName: user.name,
      authorDisplayName: user.displayName,
      userId: forum_posts.userId,
      voteCount: forum_posts.voteCount,
    })
    .from(forum_posts)
    .leftJoin(user, eq(forum_posts.userId, user.id))
    .where(
      and(
        eq(forum_posts.topicId, topicData.id),
        gt(forum_posts.voteCount, VOTE_THRESHOLD),
      ),
    )
    .orderBy(forum_posts.createdAt);

  const posts: ForumPost[] = postsResult.map((p) => ({
    id: p.id,
    author: p.authorDisplayName || p.authorName || "Unknown",
    userId: p.userId,
    voteCount: p.voteCount,
    createdAt: p.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    content: p.content,
  }));

  return {
    id: topicData.id,
    slug: topicData.slug,
    title: topicData.title,
    content: topicData.content,
    author: topicData.authorDisplayName || topicData.authorName || "Unknown",
    userId: topicData.userId,
    voteCount: topicData.voteCount,
    createdAt: topicData.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    lastActive: topicData.updatedAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    replies: posts.length,
    posts: posts,
  };
}

// --- Voting Helpers ---

export async function getUserVote(
  db: DrizzleD1Database<typeof schema>,
  userId: string,
  topicId?: string,
  postId?: string,
): Promise<number> {
  const conditions = [eq(forum_votes.userId, userId)];
  if (topicId) {
    conditions.push(eq(forum_votes.topicId, topicId));
  }
  if (postId) {
    conditions.push(eq(forum_votes.postId, postId));
  }

  const result = await db
    .select({ value: forum_votes.value })
    .from(forum_votes)
    .where(and(...conditions))
    .limit(1);

  return result[0]?.value ?? 0;
}

export async function getUserVotesForTopic(
  db: DrizzleD1Database<typeof schema>,
  userId: string,
  topicId: string,
  postIds: string[],
): Promise<Map<string, number>> {
  const votes = new Map<string, number>();

  // Get vote for topic
  const topicVote = await db
    .select({ value: forum_votes.value })
    .from(forum_votes)
    .where(
      and(eq(forum_votes.userId, userId), eq(forum_votes.topicId, topicId)),
    )
    .limit(1);

  if (topicVote[0]) {
    votes.set(`topic:${topicId}`, topicVote[0].value);
  }

  // Get votes for posts
  if (postIds.length > 0) {
    for (const postId of postIds) {
      const postVote = await db
        .select({ value: forum_votes.value })
        .from(forum_votes)
        .where(
          and(eq(forum_votes.userId, userId), eq(forum_votes.postId, postId)),
        )
        .limit(1);

      if (postVote[0]) {
        votes.set(`post:${postId}`, postVote[0].value);
      }
    }
  }

  return votes;
}

export async function getUserLocationVote(
  db: DrizzleD1Database<typeof schema>,
  userId: string,
  locationId: string,
): Promise<number> {
  const result = await db
    .select({ value: schema.location_votes.value })
    .from(schema.location_votes)
    .where(
      and(
        eq(schema.location_votes.userId, userId),
        eq(schema.location_votes.locationId, locationId),
      ),
    )
    .limit(1);

  return result[0]?.value ?? 0;
}

export async function getForumPostById(
  db: DrizzleD1Database<typeof schema>,
  postId: string,
) {
  const result = await db
    .select()
    .from(forum_posts)
    .where(eq(forum_posts.id, postId))
    .limit(1);

  return result[0];
}

// --- Journal Helpers ---

export async function getAllJournalEntries(
  db: DrizzleD1Database<typeof schema>,
  userId: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<
  PaginatedResult<{
    id: string;
    huntDate: Date;
    numHunters: number;
    locationId: string;
    notes: string | null;
    weather: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    locationName: string | null;
    author: string;
    harvests: (typeof schema.journal_harvests.$inferSelect)[];
  }>
> {
  const offset = (page - 1) * pageSize;

  // Get total count
  const countResult = await db
    .select({ count: count() })
    .from(schema.journal_entries)
    .where(eq(schema.journal_entries.userId, userId));
  const totalItems = countResult[0]?.count ?? 0;

  // Get paginated results
  const results = await db
    .select({
      entry: schema.journal_entries,
      locationName: schema.locations.name,
      authorName: user.name,
      authorDisplayName: user.displayName,
    })
    .from(schema.journal_entries)
    .leftJoin(schema.locations, eq(schema.journal_entries.locationId, schema.locations.id))
    .leftJoin(user, eq(schema.journal_entries.userId, user.id))
    .where(eq(schema.journal_entries.userId, userId))
    .orderBy(desc(schema.journal_entries.huntDate))
    .limit(pageSize)
    .offset(offset);

  const items = await Promise.all(
    results.map(async (row) => {
      const harvests = await db
        .select()
        .from(schema.journal_harvests)
        .where(eq(schema.journal_harvests.journalEntryId, row.entry.id));

      return {
        ...row.entry,
        locationName: row.locationName,
        author: row.authorDisplayName || row.authorName || "Unknown",
        harvests: harvests,
      };
    }),
  );

  return {
    items,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    currentPage: page,
    pageSize,
  };
}

export async function getJournalEntryById(
  db: DrizzleD1Database<typeof schema>,
  entryId: string,
): Promise<
  | {
      id: string;
      huntDate: Date;
      numHunters: number;
      locationId: string;
      notes: string | null;
      weather: string | null;
      userId: string;
      createdAt: Date;
      updatedAt: Date;
      locationName: string | null;
      author: string;
      harvests: (typeof schema.journal_harvests.$inferSelect)[];
    }
  | undefined
> {
  const result = await db
    .select({
      entry: schema.journal_entries,
      locationName: schema.locations.name,
      authorName: user.name,
      authorDisplayName: user.displayName,
    })
    .from(schema.journal_entries)
    .leftJoin(schema.locations, eq(schema.journal_entries.locationId, schema.locations.id))
    .leftJoin(user, eq(schema.journal_entries.userId, user.id))
    .where(eq(schema.journal_entries.id, entryId))
    .limit(1);

  if (!result[0]) return undefined;

  const harvests = await db
    .select()
    .from(schema.journal_harvests)
    .where(eq(schema.journal_harvests.journalEntryId, entryId));

  return {
    ...result[0].entry,
    locationName: result[0].locationName,
    author: result[0].authorDisplayName || result[0].authorName || "Unknown",
    harvests,
  };
}
