// lib/types/dashboard.ts

export interface Metrics {
  totalRequests: number;
  requestsPerSecond: number;
  botRequests: number;
  botPercentage: number;
  averageResponseTime: number;
  uptime: number;
}

export interface Backend {
  id: string;
  name: string;
  url: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  activeConnections: number;
  weight: number;
  lastCheck: Date;
}

export interface RequestLog {
  id: string;
  timestamp: Date;
  method: string;
  path: string;
  ip: string;
  userAgent: string;
  backend: string;
  responseTime: number;
  statusCode: number;
  isBot: boolean;
  botScore?: number;
  blocked: boolean;
}

export interface TrafficData {
  timestamp: Date;
  legitimate: number;
  bot: number;
  total: number;
}

export interface BotDetectionStats {
  totalDetected: number;
  blocked: number;
  allowed: number;
  topSources: Array<{
    ip: string;
    count: number;
  }>;
  detectionMethods: Array<{
    method: string;
    count: number;
  }>;
}

export interface RoutingPolicy {
  id: string;
  name: string;
  type: 'round-robin' | 'weighted' | 'least-connections' | 'health-aware';
  enabled: boolean;
}