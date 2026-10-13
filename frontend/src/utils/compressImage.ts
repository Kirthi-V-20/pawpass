export function compressImage(
  file: File,
  maxSize = 800,
  quality = 0.7,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Failed to read image."));
        return;
      }

      const image = new Image();

      image.onload = () => {
        let width = image.width;
        let height = image.height;

        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height >= width && height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }

        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Failed to create image canvas."));
          return;
        }

        context.drawImage(image, 0, 0, width, height);

        const compressedImage = canvas.toDataURL(
          "image/jpeg",
          quality,
        );

        resolve(compressedImage);
      };

      image.onerror = () => {
        reject(new Error("Failed to load image."));
      };

      image.src = reader.result;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read image."));
    };

    reader.readAsDataURL(file);
  });
}