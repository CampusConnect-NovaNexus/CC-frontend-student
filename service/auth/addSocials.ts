import { EXPO_AUTH_API_URL } from '@env';

interface obj{
    user_id:string,
    links:links
}
interface links{
        aboutMe :string,
        contactNo :number,
        instagram :string,
        youtube :string,
        github :string,
        x:string,
        leetcode :string,
        codeforces :string
    }
export const addSocials = async (body:obj)=> {
    try {
        console.log('in add Socials . ts with body : ', body );
        
        const response = await fetch(`${EXPO_AUTH_API_URL}/api/v1/auth/user/addSocials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update social links');
        }
        
        const data = await response.json();
        console.log('Social links updated successfully:', data);
        return data;
    } catch (error) {
        console.error('Error updating socials:', error);
        throw error;
    }
}