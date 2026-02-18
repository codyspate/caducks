CREATE TABLE `journal_entry` (
	`id` text PRIMARY KEY NOT NULL,
	`hunt_date` integer NOT NULL,
	`num_hunters` integer NOT NULL,
	`location_id` text NOT NULL,
	`notes` text,
	`weather` text,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `location`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `journal_harvest` (
	`id` text PRIMARY KEY NOT NULL,
	`journal_entry_id` text NOT NULL,
	`bird_type` text NOT NULL,
	`count` integer NOT NULL,
	FOREIGN KEY (`journal_entry_id`) REFERENCES `journal_entry`(`id`) ON UPDATE no action ON DELETE no action
);
