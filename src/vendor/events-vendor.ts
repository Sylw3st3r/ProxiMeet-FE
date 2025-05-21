import axios from "axios";
import {
  Event,
  PaginatedEvents,
  PaginatedEventsWithAttendance,
} from "../model/event";

const url = "http://localhost:3001/events";

export async function getEvent(
  signal: AbortSignal,
  id: number,
): Promise<Event> {
  const response = await axios.get(`${url}/${id}`, {
    signal,
  });
  return response.data.event;
}

export async function getAllEventsData(
  signal: AbortSignal,
  search: string,
  page: number,
  limit: number,
): Promise<PaginatedEventsWithAttendance> {
  const response = await axios.get(
    `${url}/all?search=${search}&page=${page}&limit=${limit}`,
    {
      signal,
    },
  );
  return response.data;
}

export async function checkEventOverlapHandler(id: number): Promise<Event[]> {
  const response = await axios.post(`${url}/overlaping`, {
    id,
  });
  return response.data.events;
}

export async function attendEvent(id: number): Promise<{}> {
  const response = await axios.post(`${url}/attend`, {
    id,
  });
  return response.data;
}

export async function resignFromAttendingEvent(id: number): Promise<{}> {
  const response = await axios.post(`${url}/resign`, {
    id,
  });
  return response.data;
}

export async function deleteEventRequest(id: number): Promise<{}> {
  const response = await axios.delete(`${url}/delete/${id}`);
  return response.data;
}

export async function getAllUserData(
  signal: AbortSignal,
  search: string,
  page: number,
  limit: number,
): Promise<PaginatedEvents> {
  const response = await axios.get(
    `${url}/own?search=${search}&page=${page}&limit=${limit}`,
    {
      signal,
    },
  );
  return response.data;
}

export async function getEventsNearLocation(
  signal: AbortSignal,
  search: string,
  page: number,
  limit: number,
): Promise<Event[]> {
  const response = await axios.get(
    `${url}/all?search=${search}&page=${page}&limit=${limit}`,
    {
      signal,
    },
  );
  return response.data.events;
}
