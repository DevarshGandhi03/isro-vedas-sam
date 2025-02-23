async function handleImageScale(blob) {
    const image = await blobToImage(blob);
    // Input images to SAM must be resized so the longest side is 1024
    const LONG_SIDE_LENGTH = 1024;
    let w = image.naturalWidth;
    let h = image.naturalHeight;
    const samScale = LONG_SIDE_LENGTH / Math.max(h, w);
    return { height: h, width: w, samScale };
}

 function blobToImage(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
      img.src = event.target.result;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
}

export { handleImageScale,blobToImage };
