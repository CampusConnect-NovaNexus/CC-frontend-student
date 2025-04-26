import {EXPO_BASE_URL_GR} from '@env';

export const getComment = async (c_id: string) => {
    const BASEURL=EXPO_BASE_URL_GR
  try {
    console.log("c_id in get commnet : ", c_id);
    
    const response = await fetch(`${BASEURL}/get_comments/${c_id}`);
    console.log('response from getComments: ',response);
    
    const data=response.json();
    console.log('Comments:',data);
    return data;
  } catch (error) {
    console.error('Get Comments Error:', error);
    return null
  }
};
