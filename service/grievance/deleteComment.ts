import {EXPO_BASE_URL_GR} from '@env'

export const deleteComment = async (c_id: string, comment_id: string) => {
    const BASEURL=EXPO_BASE_URL_GR
    try {
    const response = await fetch(`${BASEURL}/delete_comment/${c_id}/${comment_id}`);
    const data=response.json();
    console.log('Comment Deleted:', data);
    return data;
  } catch (error) {
    console.error('Delete Comment Error:', error);
  }
};
