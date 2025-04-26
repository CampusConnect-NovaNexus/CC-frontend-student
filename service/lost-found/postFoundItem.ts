import {EXPO_BASE_URL} from '@env';
export const foundItemData =async({id})=>{
    const BASEURL=EXPO_BASE_URL
    try{
        console.log("item.id : ",id)
        const result= await fetch(`${BASEURL}/api/v1/item/${id}`,{method:'GET'});
        console.log("result fetched fron FoundIOtemData : ",result);
        
        const data=await result.json();
        console.log("Data parsed fron found item data : ",data);
        return data;
    }catch(error){
        console.log('Error in found item data : ',error);
        return null
    }
}