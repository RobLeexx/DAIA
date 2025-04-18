import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Textarea from "@mui/joy/Textarea";
import Divider from "@mui/material/Divider";
import { useForm } from "react-hook-form";
import CanvasDraw from "react-canvas-draw";
import DeleteIcon from "@mui/icons-material/Delete";
import UndoIcon from "@mui/icons-material/Undo";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import TableRowsIcon from "@mui/icons-material/TableRows";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import sketchPhoto from "../../assets/male25.jpg";

import {
  uploadSketch,
  updateSketch,
  getAllSketches,
} from "../../api/sketch.api";

import TemplatesDialog from "./TemplatesDialog";
interface CanvasProps {
  handleReload: () => void;
  handleComplete: () => void;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
  reloadCanvas: boolean;
}

const Canvas: React.FC<CanvasProps> = ({
  handleReload,
  handleComplete,
  setSelectedImage,
  reloadCanvas,
}) => {
  const { register, handleSubmit, watch } = useForm();
  const description = watch("description");
  const firstCanvas = useRef<CanvasDraw | null>(null);
  const [brushed, setBrushed] = useState(true);
  const [brushColor, setBrushColor] = useState("black");
  const [brushRadius, setBrushRadius] = useState(3);
  const [catenaryColor, setCatenaryColor] = useState("#1769aa");
  const [lazyRadius, setLazyRadius] = useState(4);
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<string>("");

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();

    if (firstCanvas.current) {
      const canvasData = firstCanvas.current.getSaveData();
      localStorage.setItem("savedCanvas", canvasData);
      localStorage.setItem("savedDescription", data.description);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const canvasDataUrl = firstCanvas.current.getDataURL(
        "image/jpg",
        false,
        "#ffffff"
      );
      const blob = await (await fetch(canvasDataUrl)).blob();
      const file = new File([blob], "dibujo.jpg", { type: "image/jpg" });
      setSelectedImage(file);
      formData.append("input", file);
      formData.append("description", data.description);
      formData.append("canvas", data.canvas);
      if (!reloadCanvas) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        await uploadSketch(formData);
      } else {
        const latestSketchResponse = await getAllSketches();
        latestSketchResponse.data.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const latestSketch = latestSketchResponse.data[0];
        await updateSketch(latestSketch.id, data.description, file);
      }
      handleComplete();
    }
  });

  const clear = () => {
    if (firstCanvas.current) firstCanvas.current.clear();
  };

  const undo = () => {
    if (firstCanvas.current) firstCanvas.current.undo();
  };

  const eraser = () => {
    if (firstCanvas.current) {
      if (brushed) {
        setBrushed(false);
        setBrushColor("#ffffff");
        setBrushRadius(15);
        setCatenaryColor("#9D0D0D");
        setLazyRadius(0);
      } else {
        setBrushed(true);
        setBrushColor("black");
        setBrushRadius(6);
        setCatenaryColor("#1769aa");
        setLazyRadius(4);
      }
    }
  };

  const face = () => {
    setBrushRadius(3);
  };

  const eyes = () => {
    setBrushRadius(15);
  };

  const beard = () => {
    setBrushRadius(10);
  };

  const small = () => {
    setBrushRadius(15);
  };

  const medium = () => {
    setBrushRadius(20);
  };

  const large = () => {
    setBrushRadius(30);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <form onSubmit={onSubmit}>
        <input
          style={{ display: "none" }}
          type="checkbox"
          defaultChecked={true}
          {...register("canvas")}
        ></input>
        <div
          style={{
            display: "flex",
            padding: 30,
            justifyContent: "space-evenly",
          }}
        >
          <div
            style={{ width: "512", height: "512", border: "5px solid #1769aa" }}
          >
            <CanvasDraw
              canvasHeight={512}
              canvasWidth={512}
              brushColor={brushColor}
              brushRadius={brushRadius}
              lazyRadius={lazyRadius}
              catenaryColor={catenaryColor}
              hideGrid={true}
              backgroundColor="#ffffff"
              ref={firstCanvas}
              imgSrc={selectedValue}
              saveData={
                reloadCanvas
                  ? (localStorage.getItem("savedCanvas") as string)
                  : undefined
              }
              immediateLoading
            ></CanvasDraw>
          </div>
          <div
            style={{
              padding: 30,
              minWidth: 232,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <Button
              variant="text"
              onClick={handleClickOpen}
              startIcon={<AddReactionIcon />}
            >
              Plantillas
            </Button>
            <Button
              onClick={clear}
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
            >
              Limpiar
            </Button>
            <Button onClick={undo} variant="contained" startIcon={<UndoIcon />}>
              Deshacer
            </Button>
            <Button
              onClick={eraser}
              variant={brushed ? "outlined" : "contained"}
              startIcon={
                brushed ? <DriveFileRenameOutlineIcon /> : <BorderColorIcon />
              }
            >
              {brushed ? "Borrar" : "Dibujar"}
            </Button>
            <Divider>
              {brushColor == "black" ? "Tipo de Borde" : "Tamaño del Borrador"}
            </Divider>
            <Button
              onClick={brushed ? face : small}
              variant={brushed ? "contained" : "outlined"}
              startIcon={
                brushed ? (
                  <SentimentSatisfiedIcon />
                ) : (
                  <PanoramaFishEyeIcon style={{ fontSize: 15 }} />
                )
              }
            >
              {brushed ? "Cara" : "Pequeño"}
            </Button>
            <Button
              onClick={brushed ? eyes : medium}
              variant={brushed ? "contained" : "outlined"}
              startIcon={brushed ? <VisibilityIcon /> : <PanoramaFishEyeIcon />}
            >
              {brushed ? "Ojos" : "Mediano"}
            </Button>
            <Button
              onClick={brushed ? beard : large}
              variant={brushed ? "contained" : "outlined"}
              startIcon={
                brushed ? (
                  <TableRowsIcon />
                ) : (
                  <PanoramaFishEyeIcon style={{ fontSize: 25 }} />
                )
              }
            >
              {brushed ? "Barba" : "Grande"}
            </Button>
          </div>
          <Textarea
            disabled={false}
            minRows={2}
            placeholder="Descripción"
            size="lg"
            variant="soft"
            defaultValue={
              reloadCanvas
                ? (localStorage.getItem("savedDescription") as string)
                : undefined
            }
            sx={{ marginInline: 10, width: 512, height: 512, margin: "0" }}
            {...register("description", { required: true })}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
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
            Cambiar Tipo de Imagen
          </Button>
          <Button
            type="submit"
            disabled={!description?.trim() && !reloadCanvas}
            variant="contained"
            onClick={onSubmit}
          >
            Siguiente
          </Button>
        </div>
      </form>
      <TemplatesDialog
        open={open}
        onClose={handleClose}
        setSelectedValue={setSelectedValue}
      />
    </Box>
  );
};

export default Canvas;
