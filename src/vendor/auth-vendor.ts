import axios from "axios";

const url = "http://localhost:3001/users";

export async function requestNewAccessToken(
  refreshToken: string,
): Promise<string> {
  const response = await axios.post(`${url}/token`, {
    refreshToken,
  });
  return response.data.token;
}

// Remove refresh token on BE side
export async function removeRefreshToken(refreshToken: string): Promise<{}> {
  const response = await axios.post(`${url}/logout`, {
    refreshToken,
  });
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
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  refreshToken: string;
}> {
  const response = await axios.post(`${url}/signin`, data);
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
