import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Typography from "@mui/material/Typography";
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

export const Modelos: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(sketchType[0]);
  const [selectedOption, setSelectedOption] = React.useState("criminales");


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
    setSelectedOption("criminales")
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

  const handleSelectChange = (newOption: React.SetStateAction<string>) => {
    setSelectedOption(newOption);
  };

  const handleSelectRows = (newOption: React.SetStateAction<string[]>) => {
    setSelectedRows(newOption);
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
                rowData={handleSelectRows}
                selectedOption={selectedOption}
                option={handleSelectChange}
              />
            ) : (
              /* Step 3 */
              <SaveModel
                handleBack={handleBack}
                rowData={selectedRows}
                selectedOption={selectedOption}
              ></SaveModel>
            )}
          </React.Fragment>
        </div>
      </Box>
    </Navigation>
  );
};
