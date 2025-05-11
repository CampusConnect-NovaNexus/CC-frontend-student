import { EXPO_AUTH_API_URL } from '@env';

export const top10 = async ()=> {

    try {
        
        
        const response = await fetch(`${EXPO_AUTH_API_URL}/api/v1/points/top10`);
        
        if (!response.ok) {
        throw new Error('Failed to fetch user points');
        }

        const data = await response.json();
        console.log('top 10 data :', data);
        // Return points or 0 if not available
    } catch (error) {
        console.error('Error fetching user points:', error);
        throw error;
    }
}