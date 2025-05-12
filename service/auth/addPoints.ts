import { EXPO_AUTH_API_URL } from '@env';

export const addPoints = async (user_id:string,num:Number)=> {

    try {
        
        
        const response = await fetch(`${EXPO_AUTH_API_URL}/api/v1/points/${user_id}`,{
            method:'POST',
            body:JSON.stringify({
                 pointsToAdd: num
            })
        });
        
        if (!response.ok) {
        throw new Error('Failed to fetch user points');
        }

        const data = await response.json();
        // Return points or 0 if not available
    } catch (error) {
        console.error('Error  increasingf user points:', error);
        throw error;
    }
}