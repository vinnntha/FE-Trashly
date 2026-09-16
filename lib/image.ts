/**
 * Helper untuk memformat URL gambar agar otomatis mendukung Cloudinary CDN
 * dan tetap mendukung fallback file lokal lama jika diperlukan.
 */
export function getImageUrl(foto?: string | null): string {
  if (!foto) return "";
  
  // Jika sudah berupa URL Cloudinary atau URL HTTP/HTTPS publik lainnya
  if (foto.startsWith("http://") || foto.startsWith("https://")) {
    return foto;
  }

  // Fallback untuk URL lokal lama (misal: /uploads/hadiah/xyz.png)
  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
    "https://be-trashly-production.up.railway.app";

  return `${backendUrl}${foto.startsWith("/") ? "" : "/"}${foto}`;
}
