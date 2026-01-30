import {
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  displayName: text("display_name"),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  twoFactorEnabled: integer("two_factor_enabled", { mode: "boolean" }),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const twoFactor = sqliteTable("two_factor", {
  id: text("id").primaryKey(),
  secret: text("secret").notNull(),
  backupCodes: text("backup_codes").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const passkey = sqliteTable("passkey", {
  id: text("id").primaryKey(),
  name: text("name"),
  publicKey: text("public_key").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  credentialID: text("credential_i_d").notNull(),
  counter: integer("counter").notNull(),
  deviceType: text("device_type").notNull(),
  backedUp: integer("backed_up", { mode: "boolean" }).notNull(),
  transports: text("transports"),
  createdAt: integer("created_at", { mode: "timestamp" }),
  aaguid: text("aaguid"),
});

export const locations = sqliteTable("location", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  content: text("content").notNull(),
  contact_phone: text("contact_phone"),
  contact_email: text("contact_email"),
  contact_website: text("contact_website"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  isPublicLand: integer("is_public_land", { mode: "boolean" }),
  verified_count: integer("verified_count").notNull().default(0),
  userId: text("user_id").references(() => user.id), // Foreign key to user who created the location
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const forum_topics = sqliteTable("forum_topic", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  voteCount: integer("vote_count").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const forum_posts = sqliteTable("forum_post", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  topicId: text("topic_id")
    .notNull()
    .references(() => forum_topics.id),
  voteCount: integer("vote_count").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Tracks individual user votes on topics and posts
export const forum_votes = sqliteTable(
  "forum_vote",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    // Either topicId or postId will be set, not both
    topicId: text("topic_id").references(() => forum_topics.id),
    postId: text("post_id").references(() => forum_posts.id),
    // 1 for upvote, -1 for downvote
    value: integer("value").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    // Prevent duplicate votes on topics
    uniqueIndex("forum_vote_user_topic_idx").on(table.userId, table.topicId),
    // Prevent duplicate votes on posts
    uniqueIndex("forum_vote_user_post_idx").on(table.userId, table.postId),
  ],
);

// Tracks individual user votes on locations (verification)
export const location_votes = sqliteTable(
  "location_vote",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    locationId: text("location_id")
      .notNull()
      .references(() => locations.id),
    // 1 for upvote, -1 for downvote
    value: integer("value").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    // Prevent duplicate votes on locations
    uniqueIndex("location_vote_user_location_idx").on(
      table.userId,
      table.locationId,
    ),
  ],
);

export const location_edits = sqliteTable("location_edit", {
  id: text("id").primaryKey(),
  locationId: text("location_id")
    .notNull()
    .references(() => locations.id),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  oldContent: text("old_content").notNull(),
  newContent: text("new_content").notNull(),
  editTimestamp: integer("edit_timestamp", { mode: "timestamp" }).notNull(),
});
