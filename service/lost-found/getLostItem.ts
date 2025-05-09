import {EXPO_BASE_URL} from '@env';
export const LostItems =async()=>{
    const BASEURL = EXPO_BASE_URL
    try{
        const result= await fetch(`${BASEURL}/api/v1/item/?category=LOST`,{method:'GET'});
        const data=await result.json();
        
        return data.items;
    }catch(error){
        console.log('Error in Lost Items fetching : ',error);
        return null
    }
}