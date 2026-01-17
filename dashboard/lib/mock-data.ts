// lib/mock-data.ts

import { Metrics, Backend, RequestLog, TrafficData, BotDetectionStats } from './types/dashboard';

export function generateMockMetrics(): Metrics {
  return {
    totalRequests: Math.floor(Math.random() * 100000) + 50000,
    requestsPerSecond: Math.floor(Math.random() * 500) + 100,
    botRequests: Math.floor(Math.random() * 20000) + 5000,
    botPercentage: Math.floor(Math.random() * 30) + 10,
    averageResponseTime: Math.floor(Math.random() * 200) + 50,
    uptime: 99.9,
  };
}

export function generateMockBackends(): Backend[] {
  return [
    {
      id: '1',
      name: 'Backend 1',
      url: 'https://backend1.example.com',
      status: 'healthy',
      responseTime: 45,
      activeConnections: 156,
      weight: 1,
      lastCheck: new Date(),
    },
    {
      id: '2',
      name: 'Backend 2',
      url: 'https://backend2.example.com',
      status: 'healthy',
      responseTime: 52,
      activeConnections: 143,
      weight: 1,
      lastCheck: new Date(),
    },
    {
      id: '3',
      name: 'Backend 3',
      url: 'https://backend3.example.com',
      status: 'degraded',
      responseTime: 189,
      activeConnections: 78,
      weight: 0.5,
      lastCheck: new Date(),
    },
  ];
}

export function generateMockRequestLogs(count: number = 20): RequestLog[] {
  const methods = ['GET', 'POST', 'PUT', 'DELETE'];
  const paths = ['/api/users', '/api/products', '/api/orders', '/health', '/api/auth'];
  const statusCodes = [200, 201, 400, 404, 500];
  const backends = ['Backend 1', 'Backend 2', 'Backend 3'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `req-${i}`,
    timestamp: new Date(Date.now() - Math.random() * 3600000),
    method: methods[Math.floor(Math.random() * methods.length)],
    path: paths[Math.floor(Math.random() * paths.length)],
    ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    userAgent: Math.random() > 0.7 ? 'Bot/1.0' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    backend: backends[Math.floor(Math.random() * backends.length)],
    responseTime: Math.floor(Math.random() * 300) + 20,
    statusCode: statusCodes[Math.floor(Math.random() * statusCodes.length)],
    isBot: Math.random() > 0.7,
    botScore: Math.random() > 0.7 ? Math.random() * 0.5 + 0.5 : undefined,
    blocked: Math.random() > 0.8,
  }));
}

export function generateMockTrafficData(points: number = 24): TrafficData[] {
  return Array.from({ length: points }, (_, i) => {
    const total = Math.floor(Math.random() * 1000) + 500;
    const bot = Math.floor(total * (Math.random() * 0.3 + 0.1));
    return {
      timestamp: new Date(Date.now() - (points - i) * 3600000),
      legitimate: total - bot,
      bot,
      total,
    };
  });
}

export function generateMockBotStats(): BotDetectionStats {
  return {
    totalDetected: 15420,
    blocked: 12350,
    allowed: 3070,
    topSources: [
      { ip: '192.168.1.100', count: 523 },
      { ip: '10.0.0.45', count: 412 },
      { ip: '172.16.0.99', count: 387 },
      { ip: '203.0.113.42', count: 256 },
      { ip: '198.51.100.15', count: 189 },
    ],
    detectionMethods: [
      { method: 'ML Model', count: 8934 },
      { method: 'Rate Limiting', count: 3821 },
      { method: 'User Agent', count: 1876 },
      { method: 'Behavior Analysis', count: 789 },
    ],
  };
}