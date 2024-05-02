import React from "react";
import { Avatar, Button, Box, Card } from "@mui/material";
import UploadDialog from "../UploadDialog";

const sketchType = [
  "Seleccionar Modelo de Búsqueda",
  "Seleccionar Modelo Generativo",
];

interface ImageSelectionProps {
  selectedValue: string;
  selection: (value: string) => void;
  dbImage: string;
  uploadImage: string;
  open: boolean;
  handleClose: () => void;
  handleClickOpen: () => void;
  handleComplete: () => void;
  handlePhoto: () => void;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
}

const ModelSelection: React.FC<ImageSelectionProps> = ({
  selectedValue,
  selection,
  dbImage,
  uploadImage,
  open,
  handleClose,
  handleClickOpen,
  handleComplete,
  handlePhoto,
  setSelectedImage,
}) => {
  const selectAorB = (value: string) => {
    selection(value);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          paddingTop: 50,
        }}
      >
        {selectedValue === "Seleccionar Modelo de Búsqueda" ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Avatar
              style={{
                position: "absolute",
                margin: 15,
                backgroundColor: "#064887",
              }}
            >
              B
            </Avatar>
            <div
              style={{
                maxWidth: 500,
                height: 500,
                margin: "auto",
                padding: 50,
                border: "5px solid #064887",
                boxSizing: "border-box",
              }}
            >
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                src={uploadImage}
              />
            </div>
            <Button
              variant="contained"
              onClick={() => selectAorB(sketchType[0])}
              style={{ backgroundColor: "#064887" }}
            >
              seleccionar modelo de búsqueda
            </Button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Avatar
              style={{
                position: "absolute",
                margin: 15,
                backgroundColor: "#064887",
              }}
            >
              B
            </Avatar>
            <Card
              sx={{
                maxWidth: 500,
                maxHeight: 500,
                opacity: "40%",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#064887",
                },
              }}
            >
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  opacity: "80%",
                  objectFit: "cover",
                }}
                src={uploadImage}
                onClick={() => selectAorB(sketchType[0])}
              />
            </Card>
            <Button
              variant="outlined"
              onClick={() => selectAorB(sketchType[0])}
              style={{ color: "#064887" }}
            >
              seleccionar modelo de búsqueda
            </Button>
          </div>
        )}
        {selectedValue === "Seleccionar Modelo Generativo" ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Avatar
              style={{
                position: "absolute",
                margin: 15,
                backgroundColor: "#064887",
              }}
            >
              A
            </Avatar>
            <div
              style={{
                maxWidth: 500,
                height: 500,
                margin: "auto",
                padding: 50,
                border: "5px solid #064887",
                boxSizing: "border-box",
              }}
            >
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                src={dbImage}
              />
            </div>
            <Button
              variant="contained"
              onClick={() => selectAorB(sketchType[1])}
              style={{ backgroundColor: "#064887" }}
            >
              Seleccionar modelo Generativo
            </Button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Avatar
              style={{
                position: "absolute",
                margin: 15,
                backgroundColor: "#064887",
              }}
            >
              A
            </Avatar>
            <Card
              sx={{
                width: 500,
                height: 500,
                opacity: "40%",
                cursor: "pointer",
                padding: 2,
                "&:hover": {
                  backgroundColor: "#064887",
                },
              }}
            >
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  opacity: "100%",
                  objectFit: "cover",
                }}
                src={dbImage}
                onClick={() => selectAorB(sketchType[1])}
              />
            </Card>
            <Button
              variant="outlined"
              onClick={() => selectAorB(sketchType[1])}
              style={{ color: "#064887" }}
            >
              Seleccionar modelo Generativo
            </Button>
          </div>
        )}

        <UploadDialog
          selectedValue={selectedValue}
          open={open}
          onClose={handleClose}
          handlePhoto={handlePhoto}
          setSelectedImage={setSelectedImage}
        />
      </div>
      <Box sx={{ display: "flex", justifyContent: "end", pt: 2 }}>
        {selectedValue === sketchType[0] ? (
          <Button variant="contained" onClick={handleComplete}>
            Siguiente
          </Button>
        ) : (
          <Button variant="contained" onClick={handleClickOpen}>
            Siguiente
          </Button>
        )}
      </Box>
    </div>
  );
};

export default ModelSelection;
