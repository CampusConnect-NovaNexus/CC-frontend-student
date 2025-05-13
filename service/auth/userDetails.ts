import { EXPO_AUTH_API_URL } from '@env';

export const userDetails = async (user_id:string)=> {
    try {
        // Make sure the URL is properly formatted
        let url = `${EXPO_AUTH_API_URL}`;
        if (!url.endsWith('/')) url += '/';
        url += `api/v1/auth/user/${user_id}`;
        
        console.log('Fetching user details from:', url);
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch user details');
        }

        const data = await response.json();
        console.log('User details fetched successfully:', data);
        
        // Return the user data directly, whether it's nested or not
        return data.user || data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
}