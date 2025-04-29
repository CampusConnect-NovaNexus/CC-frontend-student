import {EXPO_BASE_URL_LMS} from '@env'
interface CreateUserRequest {
  username: string;
  email: string;
}

interface CreateUserResponse {
  message: string;
  user: {
    user_id: string;
    username: string;
    email: string;
  };
}

export async function createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
  const BASEURL=EXPO_BASE_URL_LMS
  console.log('BASEURL : ',BASEURL);
  const response = await fetch(`${BASEURL}/api/exam/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error creating user');
  }

  const responseData: CreateUserResponse = await response.json();
  return responseData;
}
