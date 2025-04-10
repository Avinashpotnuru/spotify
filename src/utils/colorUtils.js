export const getAverageColor = async (imageUrl) => {
  if (!isValidUrl(imageUrl)) {
    throw new Error("Invalid URL");
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      let canvas =
        typeof OffscreenCanvas !== "undefined"
          ? new OffscreenCanvas(img.width, img.height)
          : document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      if (!(canvas instanceof OffscreenCanvas)) {
        canvas.width = img.width;
        canvas.height = img.height;
      }

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let r = 0,
        g = 0,
        b = 0;
      const data32 = new Uint32Array(data.buffer);

      for (let i = 0; i < data32.length; i++) {
        const pixel = data32[i];
        r += pixel & 0xff;
        g += (pixel >> 8) & 0xff;
        b += (pixel >> 16) & 0xff;
      }

      const pixelCount = data.length / 4;
      r = Math.floor(r / pixelCount);
      g = Math.floor(g / pixelCount);
      b = Math.floor(b / pixelCount);

      resolve(`rgb(${r}, ${g}, ${b})`);

      canvas = null;
      ctx = null;
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = imageUrl;
  });
};

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
