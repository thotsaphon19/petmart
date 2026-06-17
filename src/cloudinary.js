// ===================================
// Cloudinary Configuration
// ===================================
// 1. สมัครบัญชีฟรีที่ https://cloudinary.com
// 2. ไปที่ Settings > Upload > Upload presets
// 3. สร้าง preset ใหม่ (ตั้ง Signing Mode เป็น "Unsigned")
// 4. คัดลอก Cloud name และ Upload preset มาใส่ใน .env

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME';
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'YOUR_UPLOAD_PRESET';

/**
 * อัปโหลดรูปภาพไปยัง Cloudinary
 * @param {File} file - ไฟล์รูปภาพ
 * @param {Function} onProgress - callback รับค่า progress (0-100)
 * @returns {Promise<{url: string, publicId: string}>}
 */
export async function uploadToCloudinary(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'petmart/products');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          url: data.secure_url,
          publicId: data.public_id,
        });
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
    xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
}

/**
 * ลบรูปภาพจาก Cloudinary (ต้องใช้ server-side signature)
 * แนะนำให้ลบผ่าน Firebase Cloud Functions หรือ backend
 */
export function getOptimizedUrl(url, options = {}) {
  if (!url || !url.includes('cloudinary.com')) return url;
  const { width = 500, height = 500, quality = 'auto', format = 'auto' } = options;
  // แทรก transformation parameters เข้าไปใน URL
  return url.replace(
    '/upload/',
    `/upload/w_${width},h_${height},c_fill,q_${quality},f_${format}/`
  );
}
