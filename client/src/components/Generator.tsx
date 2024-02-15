import React from "react";
import maleImage from "../assets/male.jpg";
import womanImage from "../assets/woman.jpg";
import CanvasDraw from "react-canvas-draw";

import { Box, Button, CircularProgress } from "@mui/material";

interface GeneratorProps {
  selectedValue: string;
  handleBack: () => void;
  selectedImage: File | null;
  loading: boolean;
  handleButtonClick: () => void;
  imageURL: string | null;
  handleReload: () => void;
}

const Generator: React.FC<GeneratorProps> = ({
  selectedValue,
  handleBack,
  selectedImage,
  loading,
  handleButtonClick,
  imageURL,
  handleReload,
}) => {
  return (
    <Box>
      <div
        style={{
          display: "flex",
          padding: 30,
          justifyContent: "space-evenly",
        }}
      >
        <img
          src={selectedImage ? URL.createObjectURL(selectedImage) : ""}
          alt="Imagen"
          style={{
            width: 512,
            height: 512,
            border: "5px solid #1769aa",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {!loading ? (
            <Button variant="contained" onClick={handleButtonClick}>
              CONVERTIR
            </Button>
          ) : (
            <Button variant="outlined" disabled onClick={handleButtonClick}>
              CARGANDO
            </Button>
          )}
        </div>
        {!loading ? (
          <img
            src={!imageURL ? maleImage : imageURL}
            alt="Imagen"
            style={{
              width: 512,
              height: 512,
            }}
          />
        ) : null}
        {loading && selectedValue === "Dibujar Identikit" ? (
          <CanvasDraw
            canvasHeight={512}
            canvasWidth={512}
            hideGrid={true}
            backgroundColor="#ffffff"
            disabled
            saveData={localStorage.getItem("savedCanvas") as string}
          />
        ) : null}
        {loading && selectedValue === "Subir Foto" ? (
          <div
            style={{
              width: 512,
              height: 512,
            }}
          >
            <img
              src={maleImage}
              style={{
                width: 512,
                height: 512,
                position: "absolute",
                opacity: "35%",
              }}
            />
            <CircularProgress size={512} />
          </div>
        ) : null}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {selectedValue === "Subir Foto" ? (
          <Button
            variant="contained"
            onClick={handleReload}
            sx={{
              mr: 1,
              backgroundColor: "#FF5733",
              "&:hover": {
                backgroundColor: "#A7331B",
              },
            }}
          >
            Volver a Seleccionar Imagen
          </Button>
        ) : (
          <Button variant="contained" onClick={handleBack}>
            Editar Dibujo
          </Button>
        )}
        <Button variant="contained">Guardar Identikit</Button>
      </div>
    </Box>
  );
};

export default Generator;
