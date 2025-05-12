import { EXPO_AUTH_API_URL } from '@env';

export const userDetails = async (user_id:string)=> {

    try {
        
        
        const response = await fetch(`${EXPO_AUTH_API_URL}api/v1/auth/user/${user_id}`);
        
        if (!response.ok) {
        throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        
        return data
        
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
}