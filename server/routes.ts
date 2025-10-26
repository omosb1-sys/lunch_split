import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import {
  insertVoteRoomSchema,
  insertVoteSchema,
  insertBillSplitSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    ws.on("message", (message) => {
      console.log("Received:", message.toString());
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });

  function broadcastVoteUpdate(roomId: string) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "vote-update",
            roomId,
          })
        );
      }
    });
  }

  app.post("/api/vote-rooms", async (req, res) => {
    try {
      const data = insertVoteRoomSchema.parse(req.body);
      const room = await storage.createVoteRoom(data);
      res.json(room);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create vote room" });
      }
    }
  });

  app.get("/api/vote-rooms", async (req, res) => {
    try {
      const rooms = await storage.getAllVoteRooms();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vote rooms" });
    }
  });

  app.get("/api/vote-rooms/:id", async (req, res) => {
    try {
      const room = await storage.getVoteRoom(req.params.id);
      if (!room) {
        res.status(404).json({ error: "Vote room not found" });
        return;
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vote room" });
    }
  });

  app.post("/api/votes", async (req, res) => {
    try {
      const data = insertVoteSchema.parse(req.body);
      const vote = await storage.createVote(data);
      
      broadcastVoteUpdate(data.roomId);
      
      res.json(vote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create vote" });
      }
    }
  });

  app.get("/api/votes/:roomId", async (req, res) => {
    try {
      const votes = await storage.getVotesByRoomId(req.params.roomId);
      res.json(votes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch votes" });
    }
  });

  app.post("/api/bill-splits", async (req, res) => {
    try {
      const data = insertBillSplitSchema.parse(req.body);
      const billSplit = await storage.createBillSplit(data);
      res.json(billSplit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create bill split" });
      }
    }
  });

  app.get("/api/bill-splits", async (req, res) => {
    try {
      const billSplits = await storage.getAllBillSplits();
      res.json(billSplits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bill splits" });
    }
  });

  app.get("/api/bill-splits/:id", async (req, res) => {
    try {
      const billSplit = await storage.getBillSplit(req.params.id);
      if (!billSplit) {
        res.status(404).json({ error: "Bill split not found" });
        return;
      }
      res.json(billSplit);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bill split" });
    }
  });

  return httpServer;
}
