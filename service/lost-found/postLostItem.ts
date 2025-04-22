
  import { EXPO_BASE_URL } from '@env';

export interface LostFoundItemInput {
  user_id: string;
  title: string;
  description: string;
  image?: string;
  item_category: string;
}

export const postLostItem = async (item: LostFoundItemInput) => {
  const BASEURL = EXPO_BASE_URL;

  try {
    console.log("in postLostItem");

    const response = await fetch(`${BASEURL}/api/v1/item/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    console.log('respose : ',response);
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      console.error("HTTP Error:", response.status, response.statusText);
      return null;
    }
    console.log('respose : ',response);
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("Response from postLostItem:", data);
      return data;
    } else {
      const text = await response.text();
      console.error("Non-JSON response:", text);
      return null;
    }
  } catch (error) {
    console.error("Error posting lost item:", error);
    return null;
  }
};
