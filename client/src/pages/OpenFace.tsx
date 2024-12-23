import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Typography from "@mui/material/Typography";

import { ChooseDatabase } from "../components/OpenFace/ChooseDatabase";
import RecognitionWheel from "../components/OpenFace/RecognitionWheel";
import SearchSelection from "../components/OpenFace/SearchSelection";
import {
  getOF,
  getOF2,
  getAllCriminals,
  getOF3,
  getAllModels,
  getAllImages,
} from "../api/sketch.api";

import dbImage from "../assets/database1.png";
import uploadImage from "../assets/uploadImage.png";
import { Navigation } from "../components/Navigation";

const steps = ["Tipo de Búsqueda", "Base de Datos", "Rueda de Reconocimiento"];
const sketchType = ["Seleccionar Base de Datos", "Subir Foto2"];

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

export const OpenFace: React.FC = () => {
  const [tenMatches, setTenMatches] = React.useState<Match[]>([]);
  const [activeStep, setActiveStep] = React.useState(0);
  const [models, setModels] = useState([]);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [open, setOpen] = React.useState(false);
  const [reloadCanvas, setReloadCanvas] = React.useState(false);
  const [isCriminalSelected, setIsCriminalSelected] = useState(false);
  const [isIdentikitSelected, setIsIdentikitSelected] = useState(false);
  const [selectedValue, setSelectedValue] = React.useState(sketchType[0]);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = React.useState(
    "TODOS LOS CRIMINALES"
  );

  const handleVerClick = () => {
    setIsCriminalSelected(true);
  };

  const handleVerClickFalse = () => {
    setIsCriminalSelected(false);
  };

  const handleVerClick2 = () => {
    setIsIdentikitSelected(true);
  };

  const handleVerClickFalse2 = () => {
    setIsIdentikitSelected(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
    setSelectedValue(selectedValue);
  };

  const handleSelection = (value: string) => {
    setSelectedValue(value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleNext2 = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 2;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setReloadCanvas(true);
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handlePhoto = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext2();
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

  const handleButtonClick = async () => {
    try {
      setLoading(true);
      let latestImage;
      const latestImageResponse = await getAllImages();
      latestImageResponse.data.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const latestImage2 = latestImageResponse.data[0];
      const criminalImageId = localStorage.getItem("criminalId");
      const identikitImageId = localStorage.getItem("identikitId");
      if (selectedValue == "Seleccionar Base de Datos") {
        if (criminalImageId === "false") {
          latestImage = await getOF3(identikitImageId as unknown as number, selectedModel);
        } else {
          latestImage = await getOF2(criminalImageId as unknown as number, selectedModel);
        }
      } else {
        latestImage = await getOF(latestImage2.id, selectedModel);
      }
      const allCriminals = await getAllCriminals();
      const mergedResults = mergeResultsWithCriminals(
        latestImage.data,
        allCriminals.data
      );
      setTenMatches(mergedResults);
    } catch (error) {
      console.error("Error al obtener los resultados:", error);
    } finally {
      setLoading(false);
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
    <Navigation>
      <Box sx={{ width: "100%", padding: 5 }}>
        <Stepper activeStep={activeStep}>
          <Step key={0}>
            <StepButton sx={{ pointerEvents: "none" }}>
              Tipo de Búsqueda
            </StepButton>
          </Step>
          <Step key={1}>
            <StepButton sx={{ pointerEvents: "none", color: "primary" }}>
              Base de Datos <br />
              {activeStep === 2 && selectedValue === "Subir Foto2" ? (
                <Typography variant="caption">Omitido</Typography>
              ) : (
                <div></div>
              )}
            </StepButton>
          </Step>
          <Step key={2}>
            <StepButton sx={{ pointerEvents: "none" }}>
              Rueda de Reconocimiento
            </StepButton>
          </Step>
        </Stepper>
        <div>
          <React.Fragment>
            {activeStep === 0 ? (
              /* Step 1 */
              <SearchSelection
                selectedValue={selectedValue}
                selection={handleSelection}
                dbImage={dbImage}
                uploadImage={uploadImage}
                open={open}
                handleClose={handleClose}
                handleClickOpen={handleClickOpen}
                handleComplete={handleComplete}
                handlePhoto={handlePhoto}
                setSelectedImage={setSelectedImage}
              />
            ) : /* Step 2 */
            activeStep === 1 ? (
              <ChooseDatabase
                isCriminalSelected={isCriminalSelected}
                handleVerClick={handleVerClick}
                handleVerClickFalse={handleVerClickFalse}
                isIdentikitSelected={isIdentikitSelected}
                handleVerClick2={handleVerClick2}
                handleVerClickFalse2={handleVerClickFalse2}
                setSelectedImage={setSelectedImage}
                handleComplete={handleComplete}
                handleReload={handleReload}
              />
            ) : (
              /* Step 3 */
              <RecognitionWheel
                selectedValue={selectedValue}
                handleBack={handleBack}
                selectedImage={selectedImage}
                loading={loading}
                handleReload={handleReload}
                handleButtonClick={handleButtonClick}
                tenMatches={tenMatches}
                selectedModel={selectedModel}
                option={handleSelectChange}
                models={models}
              />
            )}
          </React.Fragment>
        </div>
      </Box>
    </Navigation>
  );
};
