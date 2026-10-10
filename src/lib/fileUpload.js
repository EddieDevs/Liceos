import { supabase } from './supabase';

/**
 * Reads an image or document file as a Base64 DataURL
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No se seleccionó ningún archivo'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Optional upload to Supabase storage with fallback to base64
 * @param {File} file
 * @param {string} bucket
 * @returns {Promise<string>}
 */
export async function uploadFileToStorage(file, bucket = 'uploads') {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file);
    if (error) {
      // Fallback seamlessly to base64 DataURL
      return await readFileAsDataURL(file);
    }
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return urlData.publicUrl;
  } catch (err) {
    return await readFileAsDataURL(file);
  }
}
