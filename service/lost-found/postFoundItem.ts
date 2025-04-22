
import { EXPO_BASE_URL } from '@env';

export interface FoundItemInput {
  user_id: string;
  title: string;
  description: string;
  image?: string;
  item_category: string; // should be "FOUND"
}

export const postFoundItem = async (item: FoundItemInput) => {
  const BASEURL = EXPO_BASE_URL;

  try {
    console.log("in postFoundItem");

    const response = await fetch(`${BASEURL}/api/v1/item/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      console.error("HTTP Error:", response.status, response.statusText);
      return null;
    }

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("Response from postFoundItem:", data);
      return data;
    } else {
      const text = await response.text();
      console.error("Non-JSON response:", text);
      return null;
    }
  } catch (error) {
    console.error("Error posting found item:", error);
    return null;
  }
};
