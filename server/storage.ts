import {
  type User,
  type InsertUser,
  type VoteRoom,
  type InsertVoteRoom,
  type Vote,
  type InsertVote,
  type BillSplit,
  type InsertBillSplit,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createVoteRoom(room: InsertVoteRoom): Promise<VoteRoom>;
  getVoteRoom(id: string): Promise<VoteRoom | undefined>;
  getAllVoteRooms(): Promise<VoteRoom[]>;

  createVote(vote: InsertVote): Promise<Vote>;
  getVotesByRoomId(roomId: string): Promise<Vote[]>;
  getAllVotes(): Promise<Vote[]>;

  createBillSplit(billSplit: InsertBillSplit): Promise<BillSplit>;
  getBillSplit(id: string): Promise<BillSplit | undefined>;
  getAllBillSplits(): Promise<BillSplit[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private voteRooms: Map<string, VoteRoom>;
  private votes: Map<string, Vote>;
  private billSplits: Map<string, BillSplit>;

  constructor() {
    this.users = new Map();
    this.voteRooms = new Map();
    this.votes = new Map();
    this.billSplits = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createVoteRoom(insertRoom: InsertVoteRoom): Promise<VoteRoom> {
    const id = randomUUID();
    const room: VoteRoom = {
      ...insertRoom,
      id,
      createdAt: new Date(),
    };
    this.voteRooms.set(id, room);
    return room;
  }

  async getVoteRoom(id: string): Promise<VoteRoom | undefined> {
    return this.voteRooms.get(id);
  }

  async getAllVoteRooms(): Promise<VoteRoom[]> {
    return Array.from(this.voteRooms.values());
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    const id = randomUUID();
    const vote: Vote = {
      ...insertVote,
      id,
      createdAt: new Date(),
    };
    this.votes.set(id, vote);
    return vote;
  }

  async getVotesByRoomId(roomId: string): Promise<Vote[]> {
    return Array.from(this.votes.values()).filter(
      (vote) => vote.roomId === roomId
    );
  }

  async getAllVotes(): Promise<Vote[]> {
    return Array.from(this.votes.values());
  }

  async createBillSplit(insertBillSplit: InsertBillSplit): Promise<BillSplit> {
    const id = randomUUID();
    const billSplit: BillSplit = {
      ...insertBillSplit,
      id,
      createdAt: new Date(),
    };
    this.billSplits.set(id, billSplit);
    return billSplit;
  }

  async getBillSplit(id: string): Promise<BillSplit | undefined> {
    return this.billSplits.get(id);
  }

  async getAllBillSplits(): Promise<BillSplit[]> {
    return Array.from(this.billSplits.values());
  }
}

export const storage = new MemStorage();
