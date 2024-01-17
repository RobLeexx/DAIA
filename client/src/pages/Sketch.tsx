import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import SketchDialog from "../components/SketchDialog";
import PhotoDialog from "../components/PhotoDialog";
import UploadDialog from "../components/UploadDialog";

import canvaImage from "../assets/canva.jpg";
import photoImage from "../assets/photo.jpeg";
import { Navigation } from "../components/Navigation";

const steps = ["Tipo de Imagen", "Canva", "Generar Identikit"];
const sketchType = ["Dibujar Identikit", "Subir Foto"];

export const Sketch: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);

  const [selectedValue, setSelectedValue] = React.useState(sketchType[0]);

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
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleNext2 = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 2;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
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

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <Navigation>
      <Box sx={{ width: "100%", padding: 5 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color="#0a934e" onClick={handleStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <div>
          {allStepsCompleted() ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                Todos los pasos completados - tu&apos;re finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset}>Generar Otra Imagen</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {activeStep === 0 ? (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      paddingTop: 50,
                    }}
                  >
                    {selectedValue === "Dibujar Identikit" ? (
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
                        <img
                          style={{ maxWidth: 500, height: 500 }}
                          src={canvaImage}
                          alt=""
                        />
                        <Button
                          variant="contained"
                          onClick={handleClickOpen}
                          style={{ backgroundColor: "#0a934e" }}
                        >
                          Dibujar Identikit
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
                        <img
                          style={{ maxWidth: 500, height: 500, opacity: "50%" }}
                          src={canvaImage}
                          alt=""
                        />
                        <Button
                          variant="outlined"
                          onClick={handleClickOpen}
                          style={{ color: "#0a934e" }}
                        >
                          Dibujar Identikit
                        </Button>
                      </div>
                    )}

                    {selectedValue === "Subir Foto" ? (
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
                        <img
                          style={{ maxWidth: 500, maxHeight: 500 }}
                          src={photoImage}
                          alt=""
                        />
                        <Button
                          variant="contained"
                          onClick={handleClickOpen2}
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
                        <img
                          style={{
                            maxWidth: 500,
                            maxHeight: 500,
                            opacity: "50%",
                          }}
                          src={photoImage}
                          alt=""
                        />
                        <Button
                          variant="outlined"
                          onClick={handleClickOpen2}
                          style={{ color: "#0a934e" }}
                        >
                          Subir Fotografía
                        </Button>
                      </div>
                    )}

                    <SketchDialog
                      selectedValue={selectedValue}
                      open={open}
                      onClose={handleClose}
                    />

                    <PhotoDialog
                      selectedValue={selectedValue}
                      open={open2}
                      onClose={handleClose2}
                    />

                    <UploadDialog
                      selectedValue={selectedValue}
                      open={open3}
                      onClose={handleClose3}
                      handlePhoto={handlePhoto}
                    />
                  </div>
                  <Box sx={{ display: "flex", justifyContent: "end", pt: 2 }}>
                    {/* {activeStep !== steps.length &&
                      (completed[activeStep] ? (
                        <Typography
                          variant="caption"
                          sx={{ display: "inline-block" }}
                        >
                          Paso {activeStep + 1} ya completado
                        </Typography>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={handleComplete}
                        >
                          {completedSteps() === totalSteps() - 1
                            ? "Finish"
                            : "Siguiente"}
                        </Button>
                      ))} */}
                    {selectedValue === sketchType[0] ? (
                      <Button variant="contained" onClick={handleComplete}>
                        Siguiente
                      </Button>
                    ) : (
                      <Button variant="contained" onClick={handleClickOpen3}>
                        Siguiente
                      </Button>
                    )}
                  </Box>
                </div>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                  {activeStep !== steps.length &&
                    (completed[activeStep] ? (
                      <Typography
                        variant="caption"
                        sx={{ display: "inline-block" }}
                      >
                        Paso {activeStep + 1} ya completado
                      </Typography>
                    ) : (
                      <Button onClick={handleComplete}>
                        {completedSteps() === totalSteps() - 1
                          ? "Finish"
                          : "Complete Step"}
                      </Button>
                    ))}
                </Box>
              )}
            </React.Fragment>
          )}
        </div>
      </Box>
    </Navigation>
  );
};
