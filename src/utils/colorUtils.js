export const getAverageColor = async (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let r = 0, g = 0, b = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }
      
      const pixelCount = data.length / 4;
      r = Math.floor(r / pixelCount);
      g = Math.floor(g / pixelCount);
      b = Math.floor(b / pixelCount);
      
      resolve(`rgb(${r}, ${g}, ${b})`);
    };
    
    img.src = imageUrl;
  });
};

export const getImageColors = (imageElement) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    context.drawImage(imageElement, 0, 0);
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const colorMap = {};
    let dominantColor = { r: 0, g: 0, b: 0, count: 0 };
    
    // Sample pixels at regular intervals for better performance
    for (let i = 0; i < imageData.length; i += 16) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const rgb = `${r},${g},${b}`;
      
      if (!colorMap[rgb]) {
        colorMap[rgb] = 0;
      }
      colorMap[rgb]++;
      
      if (colorMap[rgb] > dominantColor.count) {
        dominantColor = { r, g, b, count: colorMap[rgb] };
      }
    }
    
    // Get vibrant and muted variations
    const vibrant = adjustColor(dominantColor, 1.2, 1.2);
    const muted = adjustColor(dominantColor, 0.6, 0.6);
    
    resolve({
      primary: `rgb(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b})`,
      vibrant: `rgb(${vibrant.r}, ${vibrant.g}, ${vibrant.b})`,
      muted: `rgb(${muted.r}, ${muted.g}, ${muted.b})`
    });
  });
};

const adjustColor = (color, saturationFactor, brightnessFactor) => {
  // Convert RGB to HSL
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  
  // Adjust saturation and brightness
  s = Math.min(1, s * saturationFactor);
  l = Math.min(1, l * brightnessFactor);
  
  // Convert back to RGB
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  
  const adjustedR = Math.round(hue2rgb(p, q, h + 1/3) * 255);
  const adjustedG = Math.round(hue2rgb(p, q, h) * 255);
  const adjustedB = Math.round(hue2rgb(p, q, h - 1/3) * 255);
  
  return {
    r: Math.min(255, Math.max(0, adjustedR)),
    g: Math.min(255, Math.max(0, adjustedG)),
    b: Math.min(255, Math.max(0, adjustedB))
  };
};
