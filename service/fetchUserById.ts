import { EXPO_AUTH_API_URL } from '@env';
export const fetchUser = async (id:string) => {
    const response = await fetch(`${EXPO_AUTH_API_URL}/api/v1/auth/user/${id}`);
    const user = await response.json();
    
    
    return user;
}
    