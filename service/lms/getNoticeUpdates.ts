import {EXPO_BASE_URL_LMS} from '@env'

interface NoticeUpdate {
  update_id: string;
  title: string;
  link: string;
  sequence: number;
  created_at: string;
}

export async function getStoredNoticeUpdates(): Promise<NoticeUpdate[] | null> {
  const BASEURL = EXPO_BASE_URL_LMS;
  
  try {
    const response = await fetch(`${BASEURL}/api/notice/stored-updates`);
    
    if (!response.ok) throw new Error('Failed to fetch stored updates');
    
    const data: NoticeUpdate[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error in getStoredNoticeUpdates:', error);
    return null;
  }
}

export async function fetchNewNoticeUpdates(url: string): Promise<NoticeUpdate[] | null> {
  const BASEURL = EXPO_BASE_URL_LMS;
  
  try {
    const response = await fetch(`${BASEURL}/api/notice/updates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url : "https://www.nitm.ac.in/students_notice" }),
    });
    
    if (!response.ok) throw new Error('Failed to fetch new updates');
    
    const data: NoticeUpdate[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchNewNoticeUpdates:', error);
    return null;
  }
}