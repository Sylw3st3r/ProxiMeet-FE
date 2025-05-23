export interface Notification {
  id: number;
  subject: string;
  message: string;
  seen: boolean;
}

export interface PaginatedNotifications {
  notifications: Notification[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
