import axios from "axios";

const url = "http://localhost:3001/users";

export async function requestNewAccessToken(): Promise<string> {
  const response = await axios.get(`${url}/token`, {
    withCredentials: true,
  });
  return response.data.token;
}

// Remove refresh token on BE side
export async function removeRefreshToken(): Promise<{}> {
  const response = await axios.post(
    `${url}/logout`,
    {},
    {
      withCredentials: true,
    },
  );
  return response.data;
}

export async function verifyUser(token: string): Promise<{}> {
  const response = await axios.post(`${url}/verify`, {
    token,
  });
  return response.data;
}

export async function signup(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  matchingPassword: string;
}): Promise<{}> {
  const response = await await axios.put(`${url}/signup`, data);
  return response.data;
}

export async function signin(data: {
  email: string;
  password: string;
}): Promise<{
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  refreshToken: string;
  avatar: string | null;
}> {
  const response = await axios.post(`${url}/signin`, data, {
    withCredentials: true,
  });
  return response.data;
}

export async function resetPassword(data: {
  token: string;
  password: string;
  matchingPassword: string;
}): Promise<{}> {
  const response = await axios.post(`${url}/password-reset`, data);
  return response.data;
}

export async function requestPasswordResetToken(data: {
  email: string;
}): Promise<{}> {
  const response = await axios.post(`${url}/request-password-reset`, data);
  return response.data;
}

export async function getUserData(): Promise<{
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  id: number;
}> {
  const response = await axios.get(`${url}/me`, {
    withCredentials: true,
  });
  return response.data;
}
