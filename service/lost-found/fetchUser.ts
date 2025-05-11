import { EXPO_BASE_URL } from '@env';
export const fetchUser =async(  id: string )=>{
    const BASEURL = EXPO_BASE_URL;
    // const { id } = params;
    try{
        const result= await fetch(`${BASEURL}/api/v1/user/${id}`);
        
        const data=await result.json();
        return data;
    }catch(error){
        console.log('Error in fetchUser(LF) : ',error);
        return null
    }
}
