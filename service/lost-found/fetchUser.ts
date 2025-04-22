import { EXPO_BASE_URL } from '@env';
export const fetchUser =async(params: { id: string })=>{
    const BASEURL = EXPO_BASE_URL;
    const { id } = params;
    try{
        console.log("item.id : ",id)
        const result= await fetch(`${BASEURL}/api/v1/user/${id}`,{method:'GET'});
        console.log("result fetched from fetchUser(LF) : ",result);
        
        const data=await result.json();
        console.log("Data parsed fron fetchUser(LF) : ",data);
        return data;
    }catch(error){
        console.log('Error in fetchUser(LF) : ',error);
        return null
    }
}
