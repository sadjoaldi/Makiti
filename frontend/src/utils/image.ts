import imageCompression from "browser-image-compression";

// Seuil en dessous duquel on ne compresse pas (l'image est déjà légère)
const COMPRESSION_THRESHOLD = 1024 * 1024; // 1 MB

export async function compressImage(file: File): Promise<File> {
  // Si l'image est déjà légère, on la garde telle quelle
  // (juste conversion WebP sans compression agressive)
  if (file.size <= COMPRESSION_THRESHOLD) {
    return file;
  }

  const options = {
    maxSizeMB: 1.5, // Cible plus haute → meilleure qualité
    maxWidthOrHeight: 1600, // Plus de résolution pour le détail
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.8, // Qualité 80% — net sans être lourd
  };

  try {
    const compressed = await imageCompression(file, options);
    // Sécurité : si la compression a paradoxalement grossi le fichier, garde l'original
    return compressed.size < file.size ? compressed : file;
  } catch {
    return file;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
