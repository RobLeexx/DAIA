import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Typography from "@mui/material/Typography";
import Generator from "../components/Generator";
import ImageSelection from "../components/ImageSelection";
import Canvas from "../components/Canvas";

import canvaImage from "../assets/canva.jpg";
import photoImage from "../assets/photo.jpeg";
import { Navigation } from "../components/Navigation";
import { getLatestSketch, getGAN } from "../api/sketch.api";

const steps = ["Tipo de Imagen", "Canva", "Generar Identikit"];
const sketchType = ["Dibujar Identikit", "Subir Foto"];

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

interface Sketch {
  id: number;
  canvas: boolean;
  input: string;
  output?: string;
  description: string;
}

export const Sketch: React.FC<ImageUploadProps> = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [reloadCanvas, setReloadCanvas] = React.useState(false);

  const [selectedValue, setSelectedValue] = React.useState(sketchType[0]);
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClickOpen3 = () => {
    setOpen3(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  const handleClose2 = (value: string) => {
    setOpen2(false);
    setSelectedValue(value);
  };

  const handleClose3 = () => {
    setOpen3(false);
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

  const handleButtonClick = async () => {
    try {
      setLoading(true);
      const latestSketchResponse = await getLatestSketch();
      const latestSketchId =
        latestSketchResponse.data.length > 0
          ? latestSketchResponse.data[latestSketchResponse.data.length - 1].id
          : null;
      if (latestSketchId !== null) {
        const response = await getGAN(latestSketchId, {
          responseType: "arraybuffer",
        });
        if (response.data) {
          const blob = new Blob([response.data], { type: "image/jpeg" });
          const imageURL = URL.createObjectURL(blob);
          setImageURL(imageURL);
        } else {
          console.error("No se encontraron datos binarios en la respuesta.");
        }
      } else {
        console.error("No se encontraron imágenes para obtener el ID.");
      }
    } catch (error) {
      console.error("Error al obtener la imagen:", error);
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
              Tipo de Imagen
            </StepButton>
          </Step>
          <Step key={1}>
            <StepButton sx={{ pointerEvents: "none", color: "primary" }}>
              Dibujo <br />
              {activeStep === 2 && selectedValue === "Subir Foto" ? (
                <Typography variant="caption">Omitido</Typography>
              ) : (
                <div></div>
              )}
            </StepButton>
          </Step>
          <Step key={2}>
            <StepButton sx={{ pointerEvents: "none" }}>
              Generar Identikit
            </StepButton>
          </Step>
        </Stepper>
        <div>
          <React.Fragment>
            {activeStep === 0 ? (
              /* Step 1 */
              <ImageSelection
                selectedValue={selectedValue}
                canvaImage={canvaImage}
                photoImage={photoImage}
                open={open}
                open2={open2}
                open3={open3}
                handleClose={handleClose}
                handleClose2={handleClose2}
                handleClose3={handleClose3}
                handleClickOpen={handleClickOpen}
                handleClickOpen2={handleClickOpen2}
                handleClickOpen3={handleClickOpen3}
                handleComplete={handleComplete}
                handlePhoto={handlePhoto}
                setSelectedImage={setSelectedImage}
              />
            ) : /* Step 2 */
            activeStep === 1 ? (
              <Canvas
                handleReload={handleReload}
                handleComplete={handleComplete}
                setSelectedImage={setSelectedImage}
                reloadCanvas={reloadCanvas}
              />
            ) : (
              /* Step 3 */
              <Generator
                selectedValue={selectedValue}
                handleBack={handleBack}
                selectedImage={selectedImage}
                loading={loading}
                handleButtonClick={handleButtonClick}
                imageURL={imageURL}
                handleReload={handleReload}
              />
            )}
          </React.Fragment>
        </div>
      </Box>
    </Navigation>
  );
};
