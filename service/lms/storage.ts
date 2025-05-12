import AsyncStorage from '@react-native-async-storage/async-storage';

interface SyllabusItem {
  item_id: string;
  exam_id: string;
  parent_item_id: string | null;
  description: string;
  created_by: string;
}

export const setItem = async (key: string, data: Record<string, boolean>) => {
  try {
    const stringified = JSON.stringify(data);
    await AsyncStorage.setItem(key, stringified);
  } catch (e) {
    console.error(`Failed to set item ${key}:`, e);
  }
};

export const getItem = async (key: string): Promise<Record<string, boolean> | undefined> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : undefined;
  } catch (e) {
    console.error(`Failed to get item ${key}:`, e);
    return undefined;
  }
};

export const updateItem = async (
  parentKey: string,
  childKey: string,
  value: boolean
) => {
  try {
    const current = (await getItem(parentKey)) || {};
    current[childKey] = value;
    await setItem(parentKey, current);
  } catch (e) {
    console.error(`Failed to update item ${parentKey}:${childKey}:`, e);
  }
};

export const addItemToKey = async (key: string, newKey: string, newValue: boolean) => {
  try {
    const currentData = (await getItem(key)) || {};
    currentData[newKey] = newValue;
    await setItem(key, currentData);
  } catch (e) {
    console.error(`Failed to add item ${newKey} to key ${key}:`, e);
  }
};

export const syllabusToDescriptionMap = (
  syllabus: SyllabusItem[],
  defaultValue: boolean = false
): Record<string, boolean> => {
  return syllabus.reduce((acc, item) => {
    acc[item.description] = defaultValue;
    return acc;
  }, {} as Record<string, boolean>);
};
