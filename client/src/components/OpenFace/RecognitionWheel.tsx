import React from "react";
import maleImage from "../../assets/male.jpg";
import CanvasDraw from "react-canvas-draw";

import { Box, Button, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface RecognitionWheelProps {
  selectedValue: string;
  handleBack: () => void;
  selectedImage: File | null;
  loading: boolean;
  handleButtonClick: () => void;
  imageURL: string | null;
  handleReload: () => void;
}

const RecognitionWheel: React.FC<RecognitionWheelProps> = ({
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <img
            src={selectedImage ? URL.createObjectURL(selectedImage) : ""}
            alt="Imagen"
            style={{
              width: 512,
              height: 512,
              border: "5px solid #1769aa",
            }}
          />
          {selectedValue === "Subir Foto2" ? (
            <Button
              variant="contained"
              onClick={handleReload}
              sx={{
                marginTop: "20px",
                backgroundColor: "#FF5733",
                "&:hover": {
                  backgroundColor: "#A7331B",
                },
              }}
            >
              Volver a Seleccionar Imagen
            </Button>
          ) : (
            <Button
              style={{ marginTop: 20 }}
              variant="contained"
              onClick={handleBack}
            >
              Editar Dibujo
            </Button>
          )}
        </div>

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
        <div style={{ display: "flex", flexDirection: "column" }}>
          {!loading ? (
            <img
              src={!imageURL ? maleImage : imageURL}
              alt="Imagen"
              style={{
                width: 512,
                height: 512,
                border: "5px solid #0a934e",
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
          {loading && selectedValue === "Subir Foto2" ? (
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
          <Button
            disabled={!imageURL}
            color="success"
            variant="contained"
            style={{ marginTop: 20 }}
            startIcon={<SearchIcon />}
          >
            Buscar en Bases de Datos
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default RecognitionWheel;
