import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Typography from "@mui/material/Typography";
import {
  getLatestImage,
  getOF,
  getOF2,
  getAllCriminals,
  getOF3,
} from "../api/sketch.api";

import dbImage from "../assets/database1.png";
import searchModel from "../assets/searchModel.png";
import { Navigation } from "../components/Navigation";
import ModelSelection from "../components/Modelos/ModelSelection";
import { FilterDatabase } from "../components/Modelos/FilterDatabase";
import { SaveModel } from "../components/Modelos/SaveModel";

const steps = ["Tipo de Modelo", "Base de Datos", "Guardar Modelos"];
const sketchType = [
  "Seleccionar Modelo de Búsqueda",
  "Seleccionar Modelo Generativo",
];

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

export const Modelos: React.FC = () => {
  const [tenMatches, setTenMatches] = React.useState<Match[]>([]);
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [open, setOpen] = React.useState(false);
  const [isCriminalSelected, setIsCriminalSelected] = useState(false);
  const [isIdentikitSelected, setIsIdentikitSelected] = useState(false);
  const [selectedValue, setSelectedValue] = React.useState(sketchType[0]);
  const [loading, setLoading] = useState(false);

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
      const latestImageResponse = await getLatestImage();
      const latestImageId =
        latestImageResponse.data.length > 0
          ? latestImageResponse.data[latestImageResponse.data.length - 1].id
          : null;
      const criminalImageId = localStorage.getItem("criminalId");
      const identikitImageId = localStorage.getItem("identikitId");
      if (selectedValue == "Seleccionar Base de Datos") {
        if (criminalImageId === "false") {
          latestImage = await getOF3(identikitImageId as unknown as number);
        } else {
          latestImage = await getOF2(criminalImageId as unknown as number);
        }
      } else {
        latestImage = await getOF(latestImageId);
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

  return (
    <Navigation>
      <Box sx={{ width: "100%", padding: 5 }}>
        <Stepper activeStep={activeStep}>
          <Step key={0}>
            <StepButton sx={{ pointerEvents: "none" }}>
              Tipo de Modelo
            </StepButton>
          </Step>
          <Step key={1}>
            <StepButton sx={{ pointerEvents: "none", color: "primary" }}>
              {selectedValue === "Seleccionar Modelo Generativo" ? (
                <Typography sx={{ fontSize: 15 }}>Entrenamiento</Typography>
              ) : (
                <Typography sx={{ fontSize: 15 }}>Base de Datos</Typography>
              )}
            </StepButton>
          </Step>
          <Step key={2}>
            <StepButton sx={{ pointerEvents: "none" }}>
              Guardar Modelo
            </StepButton>
          </Step>
        </Stepper>
        <div>
          <React.Fragment>
            {activeStep === 0 ? (
              /* Step 1 */
              <ModelSelection
                selectedValue={selectedValue}
                selection={handleSelection}
                dbImage={dbImage}
                uploadImage={searchModel}
                open={open}
                handleClose={handleClose}
                handleClickOpen={handleClickOpen}
                handleComplete={handleComplete}
                handlePhoto={handlePhoto}
                setSelectedImage={setSelectedImage}
              />
            ) : /* Step 2 */
            activeStep === 1 ? (
              <FilterDatabase
                handleComplete={handleComplete}
                handleReload={handleReload}
              />
            ) : (
              /* Step 3 */
              <SaveModel></SaveModel>
            )}
          </React.Fragment>
        </div>
      </Box>
    </Navigation>
  );
};
