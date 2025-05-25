import axios from "axios";

const url = "http://localhost:3001/profile/edit";

export async function changeBasicData(
  firstName: string,
  lastName: string,
): Promise<{
  firstName: string;
  lastName: string;
}> {
  const response = await axios.post(`${url}/basic`, {
    firstName,
    lastName,
  });
  return response.data;
}

export async function changeEmailData(
  email: string,
  confirmationPassword: string,
): Promise<{}> {
  const response = await axios.post(`${url}/email`, {
    email,
    confirmationPassword,
  });
  return response.data.token;
}

export async function changePasswordData(
  password: string,
  matchingPassword: string,
  confirmationPassword: string,
): Promise<{}> {
  const response = await axios.post(`${url}/password`, {
    password,
    matchingPassword,
    confirmationPassword,
  });

  return response.data.token;
}

export async function changeAvatar(avatar: Blob): Promise<{ avatar: string }> {
  // Prepere data
  const requestData = new FormData();
  requestData.append("avatar", avatar);

  const response = await axios.post(`${url}/avatar`, requestData);

  return response.data;
}
