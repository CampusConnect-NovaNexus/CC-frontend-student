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
        
        
        const response = await fetch(`${EXPO_AUTH_API_URL}/api/v1/auth/user/addSocials`,{
            method:'POST',
            body:JSON.stringify(body)
        });
        
        console.log('response in add socials :',response);
        

        const data = await response.json();
        console.log('top after addPont:', data);
        // Return points or 0 if not available
    } catch (error) {
        console.error('Error updating socials:', error);
        throw error;
    }
}