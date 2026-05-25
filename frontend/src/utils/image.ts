import imageCompression from "browser-image-compression";

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1, // Max 1MB
    maxWidthOrHeight: 1200, // Max 1200px
    useWebWorker: true,
    fileType: "image/webp", // Convertit en WebP
  };

  try {
    const compressed = await imageCompression(file, options);
    return compressed;
  } catch {
    return file; // Si erreur, retourne le fichier original
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
