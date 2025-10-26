import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Vote Room Schema
export const voteRooms = pgTable("vote_rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  menuOptions: text("menu_options").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVoteRoomSchema = createInsertSchema(voteRooms).omit({
  id: true,
  createdAt: true,
});

export type InsertVoteRoom = z.infer<typeof insertVoteRoomSchema>;
export type VoteRoom = typeof voteRooms.$inferSelect;

// Vote Schema
export const votes = pgTable("votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: varchar("room_id").notNull(),
  menuOption: text("menu_option").notNull(),
  voterName: text("voter_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  createdAt: true,
});

export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votes.$inferSelect;

// Bill Split Schema
export const billSplits = pgTable("bill_splits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalAmount: integer("total_amount").notNull(),
  people: text("people").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBillSplitSchema = createInsertSchema(billSplits).omit({
  id: true,
  createdAt: true,
});

export type InsertBillSplit = z.infer<typeof insertBillSplitSchema>;
export type BillSplit = typeof billSplits.$inferSelect;

// User Schema (keeping existing for compatibility)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
