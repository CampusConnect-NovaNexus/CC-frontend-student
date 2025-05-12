import { EXPO_AUTH_API_URL } from '@env';

export const top10 = async ()=> {

    try {
        
        
        const response = await fetch(`${EXPO_AUTH_API_URL}/api/v1/points/top10`);
        
        if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
        }

        const data = await response.json();
        
        return data
        // Return points or 0 if not available
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
}