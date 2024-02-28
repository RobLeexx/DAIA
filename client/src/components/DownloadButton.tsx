import { Button } from "@mui/material";
import React from "react";
import DownloadIcon from "@mui/icons-material/Download";

interface DownloadButtonProps {
  imageUrl: string | Blob | null;
  fileName: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  imageUrl,
  fileName,
}) => {
  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement("a");

      // Si imageUrl es un Blob, lo utilizamos directamente
      if (imageUrl instanceof Blob) {
        link.href = URL.createObjectURL(imageUrl);
      } else {
        link.href = imageUrl;
      }

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant="contained"
      startIcon={<DownloadIcon />}
    >
      Descargar
    </Button>
  );
};

export default DownloadButton;
