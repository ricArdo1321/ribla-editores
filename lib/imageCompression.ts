/**
 * Image compression utility for optimizing uploads
 * Uses canvas to resize and compress images before upload
 */

interface CompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0.0 - 1.0
    format?: 'image/jpeg' | 'image/webp' | 'image/png';
}

const DEFAULT_OPTIONS: CompressionOptions = {
    maxWidth: 1200,
    maxHeight: 1800,
    quality: 0.85,
    format: 'image/webp',
};

/**
 * Compress an image file using canvas
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise with the compressed file
 */
export async function compressImage(
    file: File,
    options: CompressionOptions = {}
): Promise<File> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    // Skip compression for already small files (< 100KB)
    if (file.size < 100 * 1024) {
        console.log('Image already small, skipping compression');
        return file;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions maintaining aspect ratio
                let { width, height } = img;

                if (width > opts.maxWidth! || height > opts.maxHeight!) {
                    const aspectRatio = width / height;

                    if (width > height) {
                        width = Math.min(width, opts.maxWidth!);
                        height = width / aspectRatio;
                    } else {
                        height = Math.min(height, opts.maxHeight!);
                        width = height * aspectRatio;
                    }
                }

                // Create canvas and draw resized image
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                // Use high quality image smoothing
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                ctx.drawImage(img, 0, 0, width, height);

                // Convert to blob
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Could not compress image'));
                            return;
                        }

                        // Create new file with compressed data
                        const extension = opts.format === 'image/webp' ? 'webp' :
                            opts.format === 'image/jpeg' ? 'jpg' : 'png';
                        const fileName = file.name.replace(/\.[^.]+$/, `.${extension}`);

                        const compressedFile = new File([blob], fileName, {
                            type: opts.format!,
                            lastModified: Date.now(),
                        });

                        // Log compression results
                        const reduction = ((1 - compressedFile.size / file.size) * 100).toFixed(1);
                        console.log(
                            `Compressed: ${(file.size / 1024).toFixed(1)}KB → ${(compressedFile.size / 1024).toFixed(1)}KB (${reduction}% reduction)`
                        );

                        resolve(compressedFile);
                    },
                    opts.format,
                    opts.quality
                );
            };

            img.onerror = () => {
                reject(new Error('Could not load image'));
            };

            img.src = e.target?.result as string;
        };

        reader.onerror = () => {
            reject(new Error('Could not read file'));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Compress image specifically for book covers
 * Optimized for portrait book cover dimensions
 */
export async function compressBookCover(file: File): Promise<File> {
    return compressImage(file, {
        maxWidth: 800,
        maxHeight: 1200,
        quality: 0.85,
        format: 'image/webp',
    });
}

/**
 * Compress image specifically for blog post images
 * Optimized for wide blog images
 */
export async function compressPostImage(file: File): Promise<File> {
    return compressImage(file, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.8,
        format: 'image/webp',
    });
}

/**
 * Compress image specifically for thumbnails
 */
export async function compressThumbnail(file: File): Promise<File> {
    return compressImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.75,
        format: 'image/webp',
    });
}
