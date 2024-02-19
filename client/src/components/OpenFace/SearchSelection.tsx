import React from "react";
import { Avatar, Button, Box, Card } from "@mui/material";
import UploadDialog from "../UploadDialog";

const sketchType = ["Seleccionar Base de Datos", "Subir Foto2"];

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

const SearchSelection: React.FC<ImageSelectionProps> = ({
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
        {selectedValue === "Seleccionar Base de Datos" ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Avatar
              style={{
                position: "absolute",
                margin: 15,
                backgroundColor: "#0a934e",
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
                border: "5px solid #0a934e",
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
              onClick={() => selectAorB(sketchType[0])}
              style={{ backgroundColor: "#0a934e" }}
            >
              Buscar Imagen de una Base de Datos
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
                backgroundColor: "#0a934e",
              }}
            >
              A
            </Avatar>
            <Card
              sx={{
                maxWidth: 500,
                maxHeight: 500,
                opacity: "40%",
                cursor: "pointer",
                padding: 2,
                "&:hover": {
                  backgroundColor: "#0a934e",
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
                onClick={() => selectAorB(sketchType[0])}
              />
            </Card>
            <Button
              variant="outlined"
              onClick={() => selectAorB(sketchType[0])}
              style={{ color: "#0a934e" }}
            >
              Buscar Imagen de una Base de Datos
            </Button>
          </div>
        )}

        {selectedValue === "Subir Foto2" ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Avatar
              style={{
                position: "absolute",
                margin: 15,
                backgroundColor: "#0a934e",
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
                border: "5px solid #0a934e",
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
              onClick={() => selectAorB(sketchType[1])}
              style={{ backgroundColor: "#0a934e" }}
            >
              Subir Fotografía
            </Button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Avatar
              style={{
                position: "absolute",
                margin: 15,
                backgroundColor: "#0a934e",
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
                  backgroundColor: "#0a934e",
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
                onClick={() => selectAorB(sketchType[1])}
              />
            </Card>
            <Button
              variant="outlined"
              onClick={() => selectAorB(sketchType[1])}
              style={{ color: "#0a934e" }}
            >
              Subir Fotografía
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

export default SearchSelection;
