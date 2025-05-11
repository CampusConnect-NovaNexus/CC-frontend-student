// import {EXPO_BASE_URL_LMS} from '@env'
// export default async function sendPdf(file: {
//   uri: string;
//   name: string;
//   mimeType?: string;
// },exam_id:string) {
//   const formData = new FormData();
//   formData.append('file', {
//     uri: file.uri,
//     name: file.name,
//     type: file.mimeType || 'application/pdf',
//   } as any); // `as any` is to bypass TypeScript FormData type mismatch in React Native
//     formData.append('exam_id', exam_id);
//   try {
//     const response = await fetch(`${EXPO_BASE_URL_LMS}/api/pyq/add
// `, {
//       method: 'POST',
      
//       body: formData,
//     });

//     const data = await response.json();
//     return data;
//   } catch (err) {
//     console.error('Error uploading PDF:', err);
//     throw err;
//   }
// }
// sendPdf.ts

// import {EXPO_BASE_URL_LMS} from '@env'

// export type PdfFile = {
//   uri: string;
//   name: string;
//   mimeType?: string;
// };

// export default async function sendPdf(file: PdfFile, exam_id : string) {
//     console.log('file in sendPdf : ', file);
    
//   const formData = new FormData();

//   const pdfToUpload = {
//     uri: file.uri,
//     name: file.name,
//     type: file.mimeType || 'application/pdf',
//   };

//   // @ts-ignore – React Native doesn't have full FormData typings
//   formData.append('file', pdfToUpload);
// formData.append('exam_id', exam_id)
// console.log('formData in sendPdf : ', formData);

//   try {
//     const response = await fetch(`${EXPO_BASE_URL_LMS}/api/pyq/add`, {
//       method: 'POST',
    
//       body: formData,
//     });

//     const data = await response.json();
//     return data;
//   } catch (err) {
//     console.error('Error uploading PDF:', err);
//     throw err;
//   }
// }
import { EXPO_BASE_URL_LMS } from '@env';

export type PdfFile = {
  uri: string;
  name: string;
  mimeType?: string;
};

export default async function sendPdf(file: PdfFile, exam_id: string) {
  console.log('file in sendPdf:', file);

  const formData = new FormData();

  const pdfToUpload = {
    uri: file.uri,
    name: file.name,
    type: file.mimeType || 'application/pdf',
  };

  
  formData.append('pdf_file', pdfToUpload as any);
  formData.append('exam_id', exam_id);

  

  try {
   console.log('formData in sendPdf:', formData);
   
    
    const response = await fetch(`${EXPO_BASE_URL_LMS}/api/pyq/add`, {
      method: 'POST',
      
      body: formData,
    });
    console.log('response in sendPdf:', response);
    
    const data = await response.json();
   
    if (!response.ok) {
      
      throw new Error(data?.message || 'Upload failed');
    }

    return data;
  } catch (err) {
    console.error('Error uploading PDF:', err);
    return null
  }
}
