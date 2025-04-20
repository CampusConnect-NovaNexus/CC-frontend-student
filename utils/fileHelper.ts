import * as FileSystem from 'expo-file-system';

export const IMAGES_DIR = FileSystem.documentDirectory + 'hidden_images/';

export async function ensureDirExists() {
  const dirInfo = await FileSystem.getInfoAsync(IMAGES_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(IMAGES_DIR, { intermediates: true });
  }
}

export async function saveImage(uri: string): Promise<string> {
  await ensureDirExists();
  const fileName = `${Date.now()}.jpg`;
  const dest = IMAGES_DIR + fileName;
  await FileSystem.copyAsync({ from: uri, to: dest });
  return dest;
}

export async function getAllSavedImages(): Promise<string[]> {
  await ensureDirExists();
  const files = await FileSystem.readDirectoryAsync(IMAGES_DIR);
  return files.map(file => IMAGES_DIR + file);
}
