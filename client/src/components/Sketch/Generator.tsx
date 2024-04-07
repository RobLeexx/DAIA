import React, { useEffect, useState } from "react";
import maleImage from "../../assets/male.jpg";
import womanImage from "../../assets/woman.jpg";
import CanvasDraw from "react-canvas-draw";

import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CameraFrontIcon from "@mui/icons-material/CameraFront";
import DownloadButton from "../DownloadButton";
import RecognitionWheel from "../OpenFace/RecognitionWheel";
import {
  getAllCriminals,
  getAllModels,
  getLatestSketch,
  getOF3,
} from "../../api/sketch.api";

interface GeneratorProps {
  selectedValue: string;
  handleBack: () => void;
  selectedImage: File | null;
  loading: boolean;
  handleButtonClick: () => void;
  imageURL: string | null;
  handleReload: () => void;
  selectedGANModel: string;
  ganOption: (value: string) => void;
}

interface Result {
  criminal_id: number;
  per: string;
}

interface Criminal {
  id: number;
  mainPhoto: string;
}

interface Match {
  mainPhoto: string;
  per: string;
}

const Generator: React.FC<GeneratorProps> = ({
  selectedValue,
  handleBack,
  selectedImage,
  loading,
  handleButtonClick,
  imageURL,
  handleReload,
  selectedGANModel,
  ganOption,
}) => {
  const drawed = selectedImage ? URL.createObjectURL(selectedImage) : null;
  const [generate, setGenerate] = React.useState(false);
  const [tenMatches, setTenMatches] = React.useState<Match[]>([]);
  const [loading2, setLoading2] = useState(false);
  const [selectedModel, setSelectedModel] = React.useState(
    "TODOS LOS CRIMINALES"
  );
  const [models, setModels] = useState([]);
  const [selectedOptionLocal, setSelectedOption] =
    React.useState(selectedGANModel);

  const handleSelectChange2 = (event: { target: { value: string } }) => {
    const newOption = event.target.value;
    setSelectedOption(newOption);
    ganOption(newOption);
  };

  const mergeResultsWithCriminals = (
    results: Result[],
    criminals: Criminal[]
  ) => {
    const mergedResults: any[] = [];

    // Obtener los primeros 10 resultados
    const topResults = results.slice(0, 10);

    // Iterar sobre los resultados y buscar el criminal correspondiente
    for (const result of topResults) {
      const matchingCriminal = criminals.find(
        (criminal) => criminal.id === result.criminal_id
      );

      if (matchingCriminal) {
        // Agregar los datos combinados al resultado final
        mergedResults.push({
          result_id: result.criminal_id,
          per: result.per,
          mainPhoto: matchingCriminal.mainPhoto,
        });
      }
    }

    return mergedResults;
  };

  const handleButtonClick2 = async () => {
    try {
      setLoading2(true);
      const latestImageResponse = await getLatestSketch();
      const latestImageId =
        latestImageResponse.data.length > 0
          ? latestImageResponse.data[latestImageResponse.data.length - 1].id
          : null;
      const latestImage = await getOF3(
        latestImageId as unknown as number,
        selectedModel
      );
      const allCriminals = await getAllCriminals();
      const mergedResults = mergeResultsWithCriminals(
        latestImage.data,
        allCriminals.data
      );
      setTenMatches(mergedResults);
    } catch (error) {
      console.error("Error al obtener los resultados:", error);
    } finally {
      setLoading2(false);
    }
  };

  const handleSelectChange = (newOption: React.SetStateAction<string>) => {
    setSelectedModel(newOption);
  };

  useEffect(() => {
    async function loadAllModels() {
      try {
        const res = await getModels();
        // Verificar si res es un array antes de establecerlo en el estado
        if (Array.isArray(res)) {
          setModels(res);
        } else {
          console.error("La respuesta no es un array:", res);
        }
      } catch (error) {
        console.error("Error al cargar los modelos:", error);
      }
    }
    loadAllModels();
  }, []);

  const getModels = async () => {
    try {
      const response = await getAllModels();
      return response.data;
    } catch (error) {
      console.error("Error al obtener los modelos:", error);
      return []; // Devolver un array vacío en caso de error
    }
  };
  return (
    <>
      {!generate ? (
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: 300,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleButtonClick}
                    startIcon={<CameraFrontIcon fontSize="large" />}
                  >
                    CONVERTIR
                  </Button>
                  <Typography sx={{ margin: 2, textAlign: "center" }}>
                    Seleccionar Modelo:
                  </Typography>
                  <Select
                    value={selectedOptionLocal}
                    onChange={handleSelectChange2}
                  >
                    <MenuItem value="EstandarPro">
                      <Typography sx={{ width: 300 }}>EstandarPro</Typography>
                    </MenuItem>
                    <MenuItem value="Avanzado">
                      <Typography sx={{ width: 300 }}>Avanzado</Typography>
                    </MenuItem>
                    <MenuItem value="AvanzadoPro">
                      <Typography sx={{ width: 300 }}>AvanzadoPro</Typography>
                    </MenuItem>
                    <MenuItem value="CUHK">
                      <Typography sx={{ width: 300 }}>CUHK</Typography>
                    </MenuItem>
                  </Select>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 300,
                  }}
                >
                  <Button
                    variant="outlined"
                    disabled
                    onClick={handleButtonClick}
                  >
                    CARGANDO
                  </Button>
                </div>
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
                onClick={() => {
                  setGenerate(true);
                }}
                color="success"
                variant="contained"
                style={{ marginBlock: 20 }}
                startIcon={<SearchIcon />}
                sx={{ width: "100%" }}
              >
                Buscar en Bases de Datos
              </Button>
              {imageURL && (
                <DownloadButton imageUrl={imageURL} fileName="resultado.jpg" />
              )}
            </div>
          </div>
        </Box>
      ) : (
        <RecognitionWheel
          selectedValue={"Seleccionar Base de Datos"}
          handleBack={handleBack}
          selectedImage={imageURL}
          loading={loading2}
          handleReload={handleReload}
          handleButtonClick={handleButtonClick2}
          tenMatches={tenMatches}
          selectedModel={selectedModel}
          option={handleSelectChange}
          models={models}
        />
      )}
    </>
  );
};

export default Generator;
