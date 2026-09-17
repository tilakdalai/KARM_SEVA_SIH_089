import { apiClient } from './api';

export type NotificationType =
  | 'JOB_REQUEST'
  | 'JOB_ACCEPTED'
  | 'WORKER_ON_THE_WAY'
  | 'WORKER_ARRIVED'
  | 'JOB_COMPLETED'
  | 'PAYMENT'
  | 'REPLACEMENT'
  | 'LEAVE'
  | 'COMPLAINT'
  | 'VERIFICATION'
  | 'SETTLEMENT'
  | 'TRAINING'
  | 'SYSTEM';

export interface NotificationItem {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link_url?: string | null;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
}

export interface NotificationListResponse {
  total: number;
  unread_count: number;
  notifications: NotificationItem[];
}

export interface UnreadCountResponse {
  unread_count: number;
}

export const notificationService = {
  /**
   * Fetch paginated list of notifications for the current authenticated user.
   */
  async getNotifications(
    unreadOnly = false,
    limit = 50,
    offset = 0
  ): Promise<NotificationListResponse> {
    const res = await apiClient.get<NotificationListResponse>('/notifications', {
      params: { unread_only: unreadOnly, limit, offset },
    });
    return res.data;
  },

  /**
   * Fetch live unread notification count.
   */
  async getUnreadCount(): Promise<number> {
    const res = await apiClient.get<UnreadCountResponse>('/notifications/unread-count');
    return res.data.unread_count;
  },

  /**
   * Mark a single notification as read.
   */
  async markAsRead(notificationId: string): Promise<NotificationItem> {
    const res = await apiClient.post<NotificationItem>(`/notifications/${notificationId}/read`);
    return res.data;
  },

  /**
   * Mark all unread notifications as read.
   */
  async markAllAsRead(): Promise<{ marked_read: number; status: string }> {
    const res = await apiClient.post<{ marked_read: number; status: string }>('/notifications/mark-all-read');
    return res.data;
  },

  /**
   * Register FCM Push token securely on the server.
   */
  async registerDeviceToken(fcmToken: string, deviceType = 'web'): Promise<{ status: string }> {
    const res = await apiClient.post<{ status: string }>('/notifications/register-device', {
      fcm_token: fcmToken,
      device_type: deviceType,
    });
    return res.data;
  },
};
