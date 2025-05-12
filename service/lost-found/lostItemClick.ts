import {EXPO_BASE_URL} from '@env';
export const lostItemData =async({id})=>{
    const BASEURL=EXPO_BASE_URL
    try{
        const result= await fetch(`${BASEURL}/api/v1/item/${id}`,{method:'GET'});
        
        const data=await result.json();
        return data;
    }catch(error){
        console.log('Error in lostItemData : ',error);
        return null
    }
}