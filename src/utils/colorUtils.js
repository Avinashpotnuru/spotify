const toHex = (r, g, b) =>
  "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

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
        b = 0,
        count = 0;

      // Sample every 10th pixel for performance
      for (let i = 0; i < data.length; i += 40) {
        r += data[i]; // Red
        g += data[i + 1]; // Green
        b += data[i + 2]; // Blue
        count++;
      }

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      resolve({
        rgb: `rgb(${r}, ${g}, ${b})`,
        hex: toHex(r, g, b),
      });
    };

    img.onerror = () => {
      reject(new Error("Failed to load image – possibly due to CORS"));
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
