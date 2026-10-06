import { getQRCodeBlob } from "@/utils/downloadQRCode";
import { localize } from "@/utils/localize";

export const shareQRCode = async (
  elementId: string,
  petName: string,
  qrData: string,
) => {
  try {
    const blob =
      await getQRCodeBlob(elementId);

    if (!blob) {
      return;
    }

    const file = new File(
      [blob],
      `${petName}-QR.png`,
      {
        type: "image/png",
      },
    );

    /*
     * Supported mobile browsers:
     * Share the actual QR image.
     */
    if (
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({
        files: [file],
      })
    ) {
      await navigator.share({
        title:
          localize.qr.share_title,
        text:
          localize.qr.share_text,
        files: [file],
      });

      return;
    }

    if (
      typeof navigator.share === "function"
    ) {
      await navigator.share({
        title:
          localize.qr.share_title,
        text:
          `${localize.qr.share_text} ${qrData}`,
      });

      return;
    }

    const whatsappUrl =
      `https://wa.me/?text=${encodeURIComponent(
        `${localize.qr.share_text} ${qrData}`,
      )}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer",
    );
  } catch {

  }
};