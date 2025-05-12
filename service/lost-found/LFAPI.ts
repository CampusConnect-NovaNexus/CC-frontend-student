import {EXPO_BASE_URL} from '@env';
export const LFData =async()=>{
    const BASEURL = EXPO_BASE_URL
    try{
        const result= await fetch(`${BASEURL}/api/v1/item`,{method:'GET'});
        const data=await result.json();
        
        return data.items;
    }catch(error){
        console.log('Error in LFAPI : ',error);
        return null
    }
}