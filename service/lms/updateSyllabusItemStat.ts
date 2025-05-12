import { EXPO_BASE_URL_LMS } from '@env'

export const updateSyllabusItemStat = async (itemId: string, userId: string, done: boolean) => {
    try {
        const res = await fetch(`${EXPO_BASE_URL_LMS}/api/exam/checklist/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id : userId,
                done: done
            }),
        }); 
        const responseData = await res.json();
        return responseData;
    } catch (error) {
        console.error('Error updating syllabus item:', error); 
        throw error; 
    }
}
