import React, { useState, ChangeEvent } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, Input, Paper, Typography } from "@mui/material";
import CameraFrontIcon from "@mui/icons-material/CameraFront";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

interface UploadDialogProps extends SimpleDialogProps {
  handlePhoto: () => void;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>; // Nueva prop
}

const UploadDialog: React.FC<UploadDialogProps> = (props) => {
  const { onClose, selectedValue, open, handlePhoto, setSelectedImage } = props;
  const [selectedImage, setSelectedImageLocal] = useState<File | null>(null);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setSelectedImageLocal(file);
    }
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth={false}>
      <DialogTitle style={{ display: "flex", justifyContent: "center" }}>
        <b>Carga de Imagen</b>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "red",
          backgroundColor: "white",
          "&:hover": {
            backgroundColor: "red", // Cambia el color de fondo al pasar el ratón
            color: "white", // Cambia el color del texto al pasar el ratón
          },
        }}
      >
        <CloseIcon />
      </IconButton>
      <Divider></Divider>
      <Paper elevation={3} style={{ padding: 20 }}>
        <Input
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="image-upload-input"
        />
        <label
          htmlFor="image-upload-input"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Button
            variant="contained"
            color="primary"
            component="span"
            startIcon={<CameraFrontIcon />}
          >
            Seleccionar Imagen
          </Button>
        </label>
        {selectedImage && (
          <div style={{ marginTop: 20 }}>
            <Typography variant="subtitle1">Imagen Seleccionada:</Typography>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Seleccionada"
              style={{ maxWidth: 512 }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button
                variant="contained"
                onClick={handleDeleteImage}
                sx={{ backgroundColor: "red" }}
                startIcon={<DeleteIcon />}
              ></Button>
            </div>
          </div>
        )}
      </Paper>
      <Button
        variant="contained"
        disabled={!selectedImage}
        onClick={handlePhoto}
        style={{ width: "100%", padding: 20, marginTop: 20 }}
      >
        Generar Identikit
      </Button>
    </Dialog>
  );
};

export default UploadDialog;
