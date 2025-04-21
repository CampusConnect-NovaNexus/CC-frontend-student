import {EXPO_BASE_URL} from '@env';
export const lostItemData =async({id})=>{
    const BASEURL=EXPO_BASE_URL
    try{
        console.log("item.id : ",id)
        const result= await fetch(`${BASEURL}/api/v1/item/${id}`,{method:'GET'});
        console.log("result fetched fron LostIOtemData : ",result);
        
        const data=await result.json();
        console.log("Data parsed fron lostItemData : ",data);
        return data;
    }catch(error){
        console.log('Error in lostItemData : ',error);
        return null
    }
}