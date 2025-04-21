import { EXPO_BASE_URL } from '@env';
export const foundItemData =async(params: { id: string })=>{
    const BASEURL = EXPO_BASE_URL;
    const { id } = params;
    try{
        console.log("item.id : ",id)
        const result= await fetch(`${BASEURL}/api/v1/item/${id}`,{method:'GET'});
        console.log("result fetched from foundIOtemData : ",result);
        
        const data=await result.json();
        console.log("Data parsed fron doundItemData : ",data);
        return data;
    }catch(error){
        console.log('Error in foundItemData : ',error);
        return null
    }
}