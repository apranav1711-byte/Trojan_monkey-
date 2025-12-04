import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types
export interface HttpEvent {
  _id?: string;
  timestamp: string;
  srcIP: string;
  destIP: string;
  method: string;
  url: string;
  statusCode: number;
  userAgent: string;
  rawRequest?: string;
  isAttack: boolean;
  attackType: string;
  severity: "LOW" | "HIGH" | "CRITICAL";
  isSuccessful: boolean;
  detectionReasons?: string[];
}

export interface StatsSummary {
  total: number;
  attackCount: number;
  successfulCount: number;
  uniqueIPs?: number;
}

export interface AttackStats {
  attacksByType: Record<string, number>;
  severityCount: Record<string, number>;
  timeBins: Record<string, number>;
}

// API functions
export const uploadPcap = async (file: File): Promise<{ events: HttpEvent[] }> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/logs/uploadPcap", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getLogs = async (limit = 200): Promise<{ items: HttpEvent[] }> => {
  const response = await api.get(`/logs?limit=${limit}`);
  return response.data;
};

export const getLogById = async (id: string): Promise<{ item: HttpEvent }> => {
  const response = await api.get(`/logs/${id}`);
  return response.data;
};

export const getStats = async (): Promise<StatsSummary> => {
  const response = await api.get("/logs/stats/summary");
  return response.data;
};

export const getAttackStats = async (): Promise<AttackStats> => {
  const { items } = await getLogs(1000);
  
  const attacksByType: Record<string, number> = {};
  const severityCount: Record<string, number> = { LOW: 0, HIGH: 0, CRITICAL: 0 };
  const timeBins: Record<string, number> = {};
  
  items.forEach((event) => {
    if (event.isAttack) {
      attacksByType[event.attackType] = (attacksByType[event.attackType] || 0) + 1;
    }
    if (severityCount[event.severity] !== undefined) {
      severityCount[event.severity]++;
    }
    const t = new Date(event.timestamp).toISOString().slice(0, 13) + "h";
    timeBins[t] = (timeBins[t] || 0) + 1;
  });
  
  return { attacksByType, severityCount, timeBins };
};

export const getUniqueIPs = async (): Promise<number> => {
  const { items } = await getLogs(1000);
  const uniqueIPs = new Set(items.map((e) => e.srcIP));
  return uniqueIPs.size;
};

