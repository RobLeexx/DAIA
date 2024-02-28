import React from "react";
import maleImage from "../../assets/male.jpg";
import womanImage from "../../assets/woman.jpg";
import CanvasDraw from "react-canvas-draw";

import { Box, Button, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CameraFrontIcon from "@mui/icons-material/CameraFront";
import DownloadButton from "../DownloadButton";

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
  const drawed = selectedImage ? URL.createObjectURL(selectedImage) : null;
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
          {selectedValue === "Dibujar Identikit" && (
            <img
              src={selectedImage ? URL.createObjectURL(selectedImage) : ""}
              alt="Imagen"
              style={{
                width: 512,
                height: 512,
                border: "5px solid #1769aa",
              }}
            />
          )}
          {selectedValue === "Subir Foto" && (
            <img
              src={selectedImage ? URL.createObjectURL(selectedImage) : ""}
              alt="Imagen"
              style={{
                width: "100%",
                height: 512,
                border: "5px solid #1769aa",
              }}
            />
          )}
          {selectedValue === "Subir Foto" ? (
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
              style={{ marginBlock: 20 }}
              variant="contained"
              onClick={handleBack}
            >
              Editar Dibujo
            </Button>
          )}
          {selectedValue === "Dibujar Identikit" && (
            <DownloadButton imageUrl={drawed} fileName="dibujo.jpg" />
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
            <Button
              variant="contained"
              onClick={handleButtonClick}
              startIcon={<CameraFrontIcon fontSize="large" />}
            >
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
          <Button
            disabled={!imageURL}
            color="success"
            variant="contained"
            style={{ marginBlock: 20 }}
            startIcon={<SearchIcon />}
          >
            Buscar en Bases de Datos
          </Button>
          {imageURL && (
            <DownloadButton imageUrl={imageURL} fileName="resultado.jpg" />
          )}
        </div>
      </div>
    </Box>
  );
};

export default Generator;
