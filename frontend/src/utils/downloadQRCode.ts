export const getQRCodeBlob = async (
  elementId: string,
): Promise<Blob | null> => {
  const svg = document.getElementById(
    elementId,
  ) as SVGSVGElement | null;

  if (!svg) {
    return null;
  }

  const svgClone = svg.cloneNode(
    true,
  ) as SVGSVGElement;

  const size = 1000;

  svgClone.setAttribute(
    "width",
    String(size),
  );

  svgClone.setAttribute(
    "height",
    String(size),
  );

  svgClone.setAttribute(
    "viewBox",
    `0 0 ${svg.viewBox.baseVal.width} ${svg.viewBox.baseVal.height}`,
  );

  svgClone.setAttribute(
    "xmlns",
    "http://www.w3.org/2000/svg",
  );

  const svgData =
    new XMLSerializer().serializeToString(
      svgClone,
    );

  const svgBlob = new Blob(
    [svgData],
    {
      type: "image/svg+xml;charset=utf-8",
    },
  );

  const url =
    URL.createObjectURL(svgBlob);

  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => {
      const canvas =
        document.createElement("canvas");

      canvas.width = size;
      canvas.height = size;

      const context =
        canvas.getContext("2d");

      if (!context) {
        URL.revokeObjectURL(url);
        resolve(null);
        return;
      }

      context.fillStyle = "#FFFFFF";

      context.fillRect(
        0,
        0,
        size,
        size,
      );

      context.imageSmoothingEnabled = false;

      context.drawImage(
        image,
        0,
        0,
        size,
        size,
      );

      URL.revokeObjectURL(url);

      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/png",
        1,
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };

    image.src = url;
  });
};

export const downloadQRCode = async (
  elementId: string,
  fileName: string,
) => {
  const blob =
    await getQRCodeBlob(elementId);

  if (!blob) {
    return;
  }

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    `${fileName}-QR.png`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};