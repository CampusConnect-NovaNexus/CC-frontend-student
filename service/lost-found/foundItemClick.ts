import { EXPO_BASE_URL } from '@env';
export const foundItemData =async(params: { id: string })=>{
    const BASEURL = EXPO_BASE_URL;
    const { id } = params;
    try{
        const result= await fetch(`${BASEURL}/api/v1/item/${id}`,{method:'GET'});
        
        const data=await result.json();
        return data;
    }catch(error){
        console.log('Error in foundItemData : ',error);
        return null
    }
}