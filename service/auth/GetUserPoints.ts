import { EXPO_AUTH_API_URL } from '@env';

export const getUserPoints = async (userId: string): Promise<number> => {

    try {
        console.log('Fetching user points for userId:', userId);
        
        const response = await fetch(`${EXPO_AUTH_API_URL}/api/v1/points/${userId}`);
        
        if (!response.ok) {
        throw new Error('Failed to fetch user points');
        }

        const data = await response.json();
        console.log('User points data:', data);
        return data.points || 0; // Return points or 0 if not available
    } catch (error) {
        console.error('Error fetching user points:', error);
        throw error;
    }
}