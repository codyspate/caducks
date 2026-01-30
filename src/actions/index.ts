import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { nanoid } from "nanoid";
import * as schema from "../db/schema";

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export const server = {
  forum: {
    createTopic: defineAction({
      accept: "json",
      input: z.object({
        title: z.string().min(5),
        content: z.string().min(10),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        if (!user) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Must be logged in",
          });
        }

        const db = drizzle(context.locals.runtime.env.DB, { schema });
        const slug = `${slugify(input.title)}-${nanoid(4)}`;
        const now = new Date();
        const id = nanoid();

        await db.insert(schema.forum_topics).values({
          id,
          title: input.title,
          slug,
          content: input.content,
          userId: user.id,
          voteCount: 0,
          createdAt: now,
          updatedAt: now,
        });

        return { success: true, slug, id };
      },
    }),

    createPost: defineAction({
      accept: "json",
      input: z.object({
        topicId: z.string(),
        content: z.string().min(10),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        if (!user) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Must be logged in",
          });
        }

        const db = drizzle(context.locals.runtime.env.DB, { schema });
        const now = new Date();
        const id = nanoid();

        await db.insert(schema.forum_posts).values({
          id,
          content: input.content,
          userId: user.id,
          topicId: input.topicId,
          voteCount: 0,
          createdAt: now,
          updatedAt: now,
        });

        await db
          .update(schema.forum_topics)
          .set({ updatedAt: now })
          .where(eq(schema.forum_topics.id, input.topicId));

        return { success: true, id };
      },
    }),

    vote: defineAction({
      accept: "json",
      input: z.object({
        topicId: z.string().optional(),
        postId: z.string().optional(),
        value: z.number().int().min(-1).max(1),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        if (!user) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Must be logged in",
          });
        }

        if (!input.topicId && !input.postId) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: "topicId or postId required",
          });
        }

        const db = drizzle(context.locals.runtime.env.DB, { schema });

        const conditions = [eq(schema.forum_votes.userId, user.id)];
        if (input.topicId) {
          conditions.push(eq(schema.forum_votes.topicId, input.topicId));
        }
        if (input.postId) {
          conditions.push(eq(schema.forum_votes.postId, input.postId));
        }

        const existingVote = await db
          .select()
          .from(schema.forum_votes)
          .where(and(...conditions))
          .limit(1);

        const oldValue = existingVote[0]?.value ?? 0;
        const valueDiff = input.value - oldValue;

        if (valueDiff === 0) {
          return { success: true, voteCount: null, userVote: input.value };
        }

        if (existingVote[0]) {
          if (input.value === 0) {
            await db
              .delete(schema.forum_votes)
              .where(eq(schema.forum_votes.id, existingVote[0].id));
          } else {
            await db
              .update(schema.forum_votes)
              .set({ value: input.value })
              .where(eq(schema.forum_votes.id, existingVote[0].id));
          }
        } else if (input.value !== 0) {
          await db.insert(schema.forum_votes).values({
            id: nanoid(),
            userId: user.id,
            topicId: input.topicId ?? null,
            postId: input.postId ?? null,
            value: input.value,
            createdAt: new Date(),
          });
        }

        let newVoteCount: number;
        if (input.topicId) {
          await db
            .update(schema.forum_topics)
            .set({
              voteCount: sql`${schema.forum_topics.voteCount} + ${valueDiff}`,
            })
            .where(eq(schema.forum_topics.id, input.topicId));

          const updated = await db
            .select({ voteCount: schema.forum_topics.voteCount })
            .from(schema.forum_topics)
            .where(eq(schema.forum_topics.id, input.topicId))
            .limit(1);
          newVoteCount = updated[0]?.voteCount ?? 0;
        } else if (input.postId) {
          await db
            .update(schema.forum_posts)
            .set({
              voteCount: sql`${schema.forum_posts.voteCount} + ${valueDiff}`,
            })
            .where(eq(schema.forum_posts.id, input.postId));

          const updated = await db
            .select({ voteCount: schema.forum_posts.voteCount })
            .from(schema.forum_posts)
            .where(eq(schema.forum_posts.id, input.postId))
            .limit(1);
          newVoteCount = updated[0]?.voteCount ?? 0;
        } else {
          newVoteCount = 0;
        }

        return {
          success: true,
          voteCount: newVoteCount,
          userVote: input.value,
        };
      },
    }),

    deleteTopic: defineAction({
      accept: "json",
      input: z.object({
        topicId: z.string(),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        if (!user) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Must be logged in",
          });
        }

        const db = drizzle(context.locals.runtime.env.DB, { schema });

        const topic = await db
          .select({ userId: schema.forum_topics.userId })
          .from(schema.forum_topics)
          .where(eq(schema.forum_topics.id, input.topicId))
          .limit(1);

        if (!topic[0]) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Topic not found",
          });
        }

        if (topic[0].userId !== user.id) {
          throw new ActionError({
            code: "FORBIDDEN",
            message: "Not authorized to delete this topic",
          });
        }

        await db
          .delete(schema.forum_votes)
          .where(eq(schema.forum_votes.topicId, input.topicId));

        const posts = await db
          .select({ id: schema.forum_posts.id })
          .from(schema.forum_posts)
          .where(eq(schema.forum_posts.topicId, input.topicId));

        for (const post of posts) {
          await db
            .delete(schema.forum_votes)
            .where(eq(schema.forum_votes.postId, post.id));
        }

        await db
          .delete(schema.forum_posts)
          .where(eq(schema.forum_posts.topicId, input.topicId));

        await db
          .delete(schema.forum_topics)
          .where(eq(schema.forum_topics.id, input.topicId));

        return { success: true };
      },
    }),

    updateTopic: defineAction({
      accept: "json",
      input: z.object({
        topicId: z.string(),
        title: z.string(),
        content: z.string(),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        if (!user) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Must be logged in",
          });
        }

        const db = drizzle(context.locals.runtime.env.DB, { schema });

        const topic = await db
          .select({ userId: schema.forum_topics.userId })
          .from(schema.forum_topics)
          .where(eq(schema.forum_topics.id, input.topicId))
          .limit(1);

        if (!topic[0]) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Topic not found",
          });
        }

        if (topic[0].userId !== user.id) {
          throw new ActionError({
            code: "FORBIDDEN",
            message: "Not authorized to update this topic",
          });
        }

        await db
          .update(schema.forum_topics)
          .set({
            title: input.title,
            content: input.content,
            updatedAt: new Date(),
          })
          .where(eq(schema.forum_topics.id, input.topicId));

        return { success: true };
      },
    }),

    deletePost: defineAction({
      accept: "json",
      input: z.object({
        postId: z.string(),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        if (!user) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Must be logged in",
          });
        }

        const db = drizzle(context.locals.runtime.env.DB, { schema });

        const post = await db
          .select({ userId: schema.forum_posts.userId })
          .from(schema.forum_posts)
          .where(eq(schema.forum_posts.id, input.postId))
          .limit(1);

        if (!post[0]) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }

        if (post[0].userId !== user.id) {
          throw new ActionError({
            code: "FORBIDDEN",
            message: "Not authorized to delete this post",
          });
        }

        await db
          .delete(schema.forum_votes)
          .where(eq(schema.forum_votes.postId, input.postId));

        await db
          .delete(schema.forum_posts)
          .where(eq(schema.forum_posts.id, input.postId));

        return { success: true };
      },
    }),

    updatePost: defineAction({
      accept: "json",
      input: z.object({
        postId: z.string(),
        content: z.string(),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        if (!user) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Must be logged in",
          });
        }

        const db = drizzle(context.locals.runtime.env.DB, { schema });

        const post = await db
          .select({ userId: schema.forum_posts.userId })
          .from(schema.forum_posts)
          .where(eq(schema.forum_posts.id, input.postId))
          .limit(1);

        if (!post[0]) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }

        if (post[0].userId !== user.id) {
          throw new ActionError({
            code: "FORBIDDEN",
            message: "Not authorized to update this post",
          });
        }

        await db
          .update(schema.forum_posts)
          .set({
            content: input.content,
            updatedAt: new Date(),
          })
          .where(eq(schema.forum_posts.id, input.postId));

        return { success: true };
      },
    }),
  },

  locations: {
    create: defineAction({
      accept: "json",
      input: z.object({
        name: z.string().min(1),
        content: z.string().min(1),
        description: z.string().optional(),
        contact_phone: z.string().optional(),
        contact_email: z.string().optional(),
        contact_website: z.string().optional(),
        latitude: z.union([z.string(), z.number()]).optional(),
        longitude: z.union([z.string(), z.number()]).optional(),
        isPublicLand: z.union([z.string(), z.boolean(), z.null()]).optional(),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        if (!user) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Must be logged in",
          });
        }

        const db = drizzle(context.locals.runtime.env.DB, { schema });
        const slug = `${slugify(input.name)}-${nanoid(4)}`;
        const now = new Date();
        const id = nanoid();

        const latitude = input.latitude
          ? typeof input.latitude === "string"
            ? parseFloat(input.latitude)
            : input.latitude
          : null;
        const longitude = input.longitude
          ? typeof input.longitude === "string"
            ? parseFloat(input.longitude)
            : input.longitude
          : null;
        const isPublicLand =
          input.isPublicLand === "" || input.isPublicLand === null
            ? null
            : input.isPublicLand === true || input.isPublicLand === "true";

        await db.insert(schema.locations).values({
          id,
          name: input.name,
          slug,
          description: input.description || null,
          content: input.content,
          contact_phone: input.contact_phone || null,
          contact_email: input.contact_email || null,
          contact_website: input.contact_website || null,
          latitude,
          longitude,
          isPublicLand,
          userId: user.id,
          lastUpdatedByUserId: user.id,
          createdAt: now,
          updatedAt: now,
          verified_count: 0,
        });

        return { success: true, slug, id };
      },
    }),

    update: defineAction({
      accept: "json",
      input: z.object({
        id: z.string(),
        name: z.string().min(1),
        content: z.string().min(1),
        description: z.string().optional(),
        contact_phone: z.string().optional(),
        contact_email: z.string().optional(),
        contact_website: z.string().optional(),
        latitude: z.union([z.string(), z.number()]).optional(),
        longitude: z.union([z.string(), z.number()]).optional(),
        isPublicLand: z.union([z.string(), z.boolean(), z.null()]).optional(),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        if (!user) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Must be logged in",
          });
        }

        const db = drizzle(context.locals.runtime.env.DB, { schema });

        const existingLocation = await db
          .select({
            id: schema.locations.id,
            content: schema.locations.content,
            slug: schema.locations.slug,
          })
          .from(schema.locations)
          .where(eq(schema.locations.id, input.id))
          .limit(1);

        if (!existingLocation[0]) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Location not found",
          });
        }

        const now = new Date();
        const oldContent = existingLocation[0].content;

        const latitude = input.latitude
          ? typeof input.latitude === "string"
            ? parseFloat(input.latitude)
            : input.latitude
          : null;
        const longitude = input.longitude
          ? typeof input.longitude === "string"
            ? parseFloat(input.longitude)
            : input.longitude
          : null;
        const isPublicLand =
          input.isPublicLand === "" || input.isPublicLand === null
            ? null
            : input.isPublicLand === true || input.isPublicLand === "true";

        await db
          .update(schema.locations)
          .set({
            name: input.name,
            description: input.description || null,
            content: input.content,
            contact_phone: input.contact_phone || null,
            contact_email: input.contact_email || null,
            contact_website: input.contact_website || null,
            latitude,
            longitude,
            isPublicLand,
            lastUpdatedByUserId: user.id,
            updatedAt: now,
          })
          .where(eq(schema.locations.id, input.id));

        if (oldContent !== input.content) {
          await db.insert(schema.location_edits).values({
            id: nanoid(),
            locationId: input.id,
            userId: user.id,
            oldContent: oldContent,
            newContent: input.content,
            editTimestamp: now,
          });
        }

        return { success: true, slug: existingLocation[0].slug };
      },
    }),

    delete: defineAction({
      accept: "json",
      input: z.object({
        id: z.string(),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        if (!user) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Must be logged in",
          });
        }

        const db = drizzle(context.locals.runtime.env.DB, { schema });

        const location = await db
          .select({ userId: schema.locations.userId })
          .from(schema.locations)
          .where(eq(schema.locations.id, input.id))
          .limit(1);

        if (!location[0]) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Location not found",
          });
        }

        if (location[0].userId !== user.id) {
          throw new ActionError({
            code: "FORBIDDEN",
            message: "Not authorized to delete this location",
          });
        }

        await db
          .delete(schema.location_votes)
          .where(eq(schema.location_votes.locationId, input.id));

        await db
          .delete(schema.location_edits)
          .where(eq(schema.location_edits.locationId, input.id));

        await db
          .delete(schema.locations)
          .where(eq(schema.locations.id, input.id));

        return { success: true };
      },
    }),

    vote: defineAction({
      accept: "json",
      input: z.object({
        locationId: z.string(),
        value: z.number().int().min(-1).max(1),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        if (!user) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Must be logged in",
          });
        }

        const db = drizzle(context.locals.runtime.env.DB, { schema });

        const existingVote = await db
          .select()
          .from(schema.location_votes)
          .where(
            and(
              eq(schema.location_votes.userId, user.id),
              eq(schema.location_votes.locationId, input.locationId),
            ),
          )
          .limit(1);

        const oldValue = existingVote[0]?.value ?? 0;
        const valueDiff = input.value - oldValue;

        if (valueDiff === 0) {
          return { success: true, voteCount: null, userVote: input.value };
        }

        if (existingVote[0]) {
          if (input.value === 0) {
            await db
              .delete(schema.location_votes)
              .where(eq(schema.location_votes.id, existingVote[0].id));
          } else {
            await db
              .update(schema.location_votes)
              .set({ value: input.value })
              .where(eq(schema.location_votes.id, existingVote[0].id));
          }
        } else if (input.value !== 0) {
          await db.insert(schema.location_votes).values({
            id: nanoid(),
            userId: user.id,
            locationId: input.locationId,
            value: input.value,
            createdAt: new Date(),
          });
        }

        await db
          .update(schema.locations)
          .set({
            verified_count: sql`${schema.locations.verified_count} + ${valueDiff}`,
          })
          .where(eq(schema.locations.id, input.locationId));

        const updated = await db
          .select({ verified_count: schema.locations.verified_count })
          .from(schema.locations)
          .where(eq(schema.locations.id, input.locationId))
          .limit(1);

        const newVoteCount = updated[0]?.verified_count ?? 0;

        return {
          success: true,
          voteCount: newVoteCount,
          userVote: input.value,
        };
      },
    }),
  },
};
