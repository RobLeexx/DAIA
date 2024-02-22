import React, { useState, ChangeEvent } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, Input, Paper, Typography } from "@mui/material";
import Textarea from "@mui/joy/Textarea";
import CameraFrontIcon from "@mui/icons-material/CameraFront";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";

import { uploadSketch, uploadImage } from "../api/sketch.api";

interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

interface UploadDialogProps extends SimpleDialogProps {
  handlePhoto: () => void;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
}

const UploadDialog: React.FC<UploadDialogProps> = (props) => {
  const { onClose, selectedValue, open, handlePhoto, setSelectedImage } = props;
  const [selectedImage, setSelectedImageLocal] = useState<File | null>(null);
  const { register, handleSubmit, watch } = useForm();
  const description = watch("description");

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    if (selectedImage) {
      formData.append("input", selectedImage);
    }
    formData.append("description", data.description);
    if (selectedValue != "Subir Foto2") {
      formData.append("canvas", data.canvas);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      await uploadSketch(formData);
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      await uploadImage(formData);
    }
  });

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
    setSelectedImageLocal(null);
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
        <form onSubmit={onSubmit}>
          <input
            style={{ display: "none" }}
            type="checkbox"
            defaultChecked={false}
            {...register("canvas")}
          ></input>
          <Input
            type="file"
            style={{ display: "none" }}
            id="image-upload-input"
            {...register("input", { required: true })}
            onChange={handleFileChange}
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  maxWidth: 512,
                }}
              >
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Seleccionada"
                  style={{
                    maxWidth: 512,
                  }}
                />
              </div>
              <Textarea
                disabled={false}
                minRows={2}
                placeholder="Descripción"
                size="lg"
                variant="soft"
                sx={{ margin: 2 }}
                {...register("description", { required: true })}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Button
                  variant="contained"
                  onClick={handleDeleteImage}
                  sx={{
                    color: "white",
                    backgroundColor: "red",
                    "&:hover": {
                      backgroundColor: "#AF0505",
                    },
                  }}
                  startIcon={<DeleteIcon />}
                ></Button>
              </div>
              <Button
                variant="contained"
                disabled={!description?.trim()}
                style={{ width: "100%", padding: 20, marginTop: 20 }}
                onClick={(e) => {
                  e.preventDefault();
                  handlePhoto();
                  onSubmit();
                }}
              >
                {selectedValue !== "Subir Foto2" ? (
                  <div>Generar Identikit</div>
                ) : (
                  <div>Buscar</div>
                )}
              </Button>
            </div>
          )}
        </form>
      </Paper>
    </Dialog>
  );
};

export default UploadDialog;
