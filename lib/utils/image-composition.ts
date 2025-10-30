/**
 * Composites a profile photo onto a background image.
 * The profile photo is scaled to 128x128px and positioned at the top-left of the background.
 */

const BACKGROUND_IMAGE_URL = "/signature-asset.png";

// Cache for the background image to avoid reloading
let backgroundImageCache: HTMLImageElement | null = null;
let backgroundImagePromise: Promise<HTMLImageElement> | null = null;

/**
 * Loads the background image, using cache if available
 */
function loadBackgroundImage(): Promise<HTMLImageElement> {
  if (backgroundImageCache) {
    return Promise.resolve(backgroundImageCache);
  }

  if (backgroundImagePromise) {
    return backgroundImagePromise;
  }

  backgroundImagePromise = new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      backgroundImageCache = img;
      backgroundImagePromise = null;
      resolve(img);
    };

    img.onerror = (error) => {
      backgroundImagePromise = null;
      reject(new Error(`Failed to load background image: ${error}`));
    };

    img.src = BACKGROUND_IMAGE_URL;
  });

  return backgroundImagePromise;
}

/**
 * Loads a profile photo from a data URL or image URL
 */
async function loadProfilePhoto(
  photoSource: string
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => resolve(img);
    img.onerror = (error) => {
      reject(new Error(`Failed to load profile photo: ${error}`));
    };

    // If it's already a data URL, use it directly
    // Otherwise, proxy through our API to handle CORS
    if (photoSource.startsWith("data:")) {
      img.src = photoSource;
    } else if (photoSource.startsWith("http")) {
      // Use image proxy for external URLs
      img.src = `/api/image-proxy?url=${encodeURIComponent(photoSource)}`;
    } else {
      img.src = photoSource;
    }
  });
}

/**
 * Composites a profile photo onto the background image.
 * @param photoSource - Data URL or image URL of the profile photo
 * @returns Promise resolving to a data URL of the composite image
 */
export async function compositeProfilePhoto(
  photoSource: string
): Promise<string> {
  try {
    // Load both images in parallel
    const [backgroundImg, profileImg] = await Promise.all([
      loadBackgroundImage(),
      loadProfilePhoto(photoSource),
    ]);

    // Create canvas with background image dimensions + 40px height
    const canvas = document.createElement("canvas");
    canvas.width = backgroundImg.width;
    canvas.height = backgroundImg.height + 80;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    // Draw background image first
    ctx.drawImage(backgroundImg, 0, 0);

    // Profile photo dimensions (128x128px circle)
    const targetSize = 230;
    const radius = targetSize / 2;
    const x = 32;
    const y = 32;

    // Calculate scaling for object-fit: cover behavior
    // Scale to cover the entire 128x128 area, maintaining aspect ratio
    const imageAspectRatio = profileImg.width / profileImg.height;
    const targetAspectRatio = 1; // Square (128x128)

    let drawWidth = targetSize;
    let drawHeight = targetSize;
    let offsetX = 0;
    let offsetY = 0;

    if (imageAspectRatio > targetAspectRatio) {
      // Image is wider than tall - scale to cover height, crop width
      drawHeight = targetSize;
      drawWidth = targetSize * imageAspectRatio;
      offsetX = -(drawWidth - targetSize) / 2;
    } else {
      // Image is taller than wide or square - scale to cover width, crop height
      drawWidth = targetSize;
      drawHeight = targetSize / imageAspectRatio;
      offsetY = -(drawHeight - targetSize) / 2;
    }

    // Create circular clipping path
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
    ctx.clip();

    // Draw profile photo with cover behavior (scaled to cover, cropped by circle)
    ctx.drawImage(profileImg, x + offsetX, y + offsetY, drawWidth, drawHeight);

    // Restore context to remove clipping
    ctx.restore();

    // Convert canvas to data URL
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Error compositing profile photo:", error);
    throw error;
  }
}
