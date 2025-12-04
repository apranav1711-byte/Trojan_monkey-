import express from "express";
import HttpEvent from "../models/HttpEvent.js";
import { analyzeHttpEvent } from "../utils/detector.js";

// Add file-upload middleware
import multer from "multer";
const upload = multer({ dest: "tmp/" });

const router = express.Router();

router.post("/ingest", async (req,res)=>{
  try{
    const docs = req.body.entries.map(e=>{
      const r = analyzeHttpEvent(e);
      return { ...e, ...r };
    });
    const out = await HttpEvent.insertMany(docs);
    res.json({ count: out.length });
  }catch(err){ res.status(500).json({ error:"Server error" }); }
});

router.post("/uploadPcap", upload.single("file"), async (req,res)=>{
  try {
    // For demo: parse fake/fixed HTTP events from uploaded file
    // TODO: integrate a real pcap parser like pcap2/httpcap for real extraction
    if (!req.file) return res.status(400).json({ error:"No file uploaded" });
    
    // Simple simulated HTTP event extraction for demo
    // Generate more varied events based on file size or name for better demo
    const fileSize = req.file.size;
    const eventCount = Math.max(2, Math.min(50, Math.floor(fileSize / 1000))); // 2-50 events based on file size
    
    const events = [];
    const baseIPs = ["192.168.1", "10.0.0", "172.16.0", "203.0.113"];
    const methods = ["GET", "POST", "PUT", "DELETE"];
    const attackPatterns = [
      { url: "/api/users?id=1' OR '1'='1", type: "SQL Injection", severity: "CRITICAL" },
      { url: "/search?q=<script>alert('xss')</script>", type: "XSS", severity: "HIGH" },
      { url: "/files/../../../etc/passwd", type: "Directory Traversal", severity: "CRITICAL" },
      { url: "/exec?cmd=ls+-la", type: "Command Injection", severity: "CRITICAL" },
      { url: "/api/admin?auth=bypass", type: "Auth Bypass", severity: "HIGH" },
      { url: "/upload?file=shell.php", type: "File Upload", severity: "HIGH" },
      { url: "/test?foo=bar", type: "NONE", severity: "LOW" },
      { url: "/api/data?callback=malicious", type: "JSONP Injection", severity: "MEDIUM" },
    ];
    
    for (let i = 0; i < eventCount; i++) {
      const baseIP = baseIPs[i % baseIPs.length];
      const srcIP = `${baseIP}.${100 + i}`;
      const destIP = `${baseIP}.1`;
      const method = methods[i % methods.length];
      const pattern = attackPatterns[i % attackPatterns.length];
      const statusCode = pattern.type === "NONE" ? 200 : (i % 3 === 0 ? 200 : 403); // Mix of success and blocked
      
      const event = {
        timestamp: new Date(Date.now() - (eventCount - i) * 60000).toISOString(), // Spread over time
        srcIP,
        destIP,
        method,
        url: pattern.url,
        statusCode,
        userAgent: i % 2 === 0 ? "Mozilla/5.0" : "curl/1.0",
        rawRequest: `${method} ${pattern.url} HTTP/1.1`,
        ...analyzeHttpEvent({ url: pattern.url, rawRequest: `${method} ${pattern.url} HTTP/1.1`, statusCode })
      };
      
      // Override with pattern if it's an attack
      if (pattern.type !== "NONE") {
        event.isAttack = true;
        event.attackType = pattern.type;
        event.severity = pattern.severity;
        event.isSuccessful = statusCode >= 200 && statusCode < 400;
      }
      
      events.push(event);
    }
    
    // IMPORTANT: Save events to database
    const savedEvents = await HttpEvent.insertMany(events);
    
    res.json({ events: savedEvents, count: savedEvents.length });
  } catch(err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

router.get("/", async (req,res)=>{
  const limit = parseInt(req.query.limit) || 200;
  const items = await HttpEvent.findSortLimit(limit);
  res.json({ items });
});

router.get("/:id", async (req,res)=>{
  try {
    const item = await HttpEvent.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Log entry not found" });
    res.json({ item });
  } catch(err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/stats/summary", async (_req,res)=>{
  const total = await HttpEvent.countDocuments({});
  const attackCount = await HttpEvent.countDocuments({ isAttack:true });
  const successfulCount = await HttpEvent.countDocuments({ isSuccessful:true });
  res.json({ total, attackCount, successfulCount });
});

export default router;