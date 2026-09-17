export interface APIResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
}

export interface HealthCheckData {
  status: 'healthy' | 'degraded';
  app_name: string;
  environment: string;
  version: string;
  database_connected: boolean;
}
