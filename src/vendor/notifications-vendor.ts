import axios from "axios";
import { PaginatedNotifications } from "../model/notification";

const url = "http://localhost:3001/notifications";

export async function getAllNotifications(
  signal: AbortSignal,
  search: string,
  page: number,
  limit: number,
): Promise<PaginatedNotifications> {
  const response = await axios.get(
    `${url}/all?search=${search}&page=${page}&limit=${limit}`,
    {
      signal,
    },
  );
  return response.data;
}

export async function getUnseenNotificationsCount(
  signal: AbortSignal,
): Promise<number> {
  const response = await axios.get(`${url}/unseen-count`, {
    signal,
  });
  return response.data.unseenNotificationsCount;
}

export async function markAllAsSeen(): Promise<{}> {
  const response = await axios.post(`${url}/all-seen`);
  return response.data;
}

export async function markSelectedAsSeen(notifications: number[]): Promise<{}> {
  const response = await axios.post(`${url}/seen`, {
    notifications,
  });
  return response.data;
}

export async function markSelectedAsUnseen(
  notifications: number[],
): Promise<{}> {
  const response = await axios.post(`${url}/unseen`, {
    notifications,
  });
  return response.data;
}
