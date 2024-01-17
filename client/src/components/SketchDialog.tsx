import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DangerousIcon from "@mui/icons-material/Dangerous";
import sketch1 from "../assets/sketch1.jpg";
import sketch2 from "../assets/sketch2.jpg";
import sketch3 from "../assets/sketch3.jpg";

interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

const SketchDialog: React.FC<SimpleDialogProps> = (props) => {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth={false}>
      <DialogTitle style={{ display: "flex", justifyContent: "center" }}>
        <b>Dibujar Identikit</b>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "red",
          backgroundColor: "white",
          "&:hover": {
            backgroundColor: "red", // Cambia el color de fondo al pasar el ratón
            color: "white", // Cambia el color del texto al pasar el ratón
          },
        }}
      >
        <CloseIcon />
      </IconButton>
      <Divider></Divider>
      <div style={{ padding: 20, textAlign: "justify" }}>
        Con este método de entrada se garantiza una precisión superior al{" "}
        <b>80%</b> siempre y cuando se sigan las siguientes instrucciones: <br />{" "}
        <b>* El dibujo debe tener el mismo contorno en todos sus trazos.</b>{" "}
        <br />
        <b>* Las pupilas deben ser círculos negros no circunferencias.</b> <br />
        <b>
          * El pelo del cabello y las cejas no debe tener relleno.
        </b>
        <br />
        <b>* Para añadir pelo extra o sombras se puede repasar el trazo sobre el mismo.</b> <br />
        <b>* De tener barba se puede regular su espesor en función a la separación de los trazos.</b> <br />
        <b>* La nariz puede dibujarse con circunferencias, círculos y hasta sin fosas nasales dependiendo la descripción y su perspectiva.</b> <br />
        <b>* Se recomienda añadir vestimenta solo en la parte alrededor del cuello y los hombros.</b>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <DangerousIcon
            style={{
              position: "absolute",
              margin: 30,
              marginLeft: 60,
              color: "red",
              fontSize: 100,
            }}
          >
            X
          </DangerousIcon>
          <DangerousIcon
            style={{
              position: "absolute",
              marginTop: 150,
              marginLeft: 249,
              color: "red",
              fontSize: 65,
            }}
          >
            X
          </DangerousIcon>
          <DangerousIcon
            style={{
              position: "absolute",
              marginTop: 320,
              marginLeft: 50,
              color: "red",
              fontSize: 80,
            }}
          >
            X
          </DangerousIcon>
          <img src={sketch1} alt="" style={{ maxWidth: 400, height: 400 }} />
        </div>
        <div>
          <CheckCircleIcon
            style={{
              position: "absolute",
              margin: 5,
              color: "green",
              fontSize: 100,
            }}
          ></CheckCircleIcon>
          <img src={sketch2} alt="" style={{ maxWidth: 400, height: 400 }} />
        </div>
        <div>
          <CheckCircleIcon
            style={{
              position: "absolute",
              margin: 5,
              color: "green",
              fontSize: 100,
            }}
          ></CheckCircleIcon>
          <img src={sketch3} alt="" style={{ maxWidth: 400, height: 400 }} />
        </div>
      </div>
      <div
        style={{
          padding: 20,
          textAlign: "center",
          backgroundColor: "green",
          color: "white",
        }}
      >
        Para maximar aún más la precisión se recomienda usar una <b>Tableta Gráfica</b>
      </div>
      <Button
        variant="contained"
        style={{ width: "100%", padding: 20 }}
        onClick={() => handleListItemClick("Dibujar Identikit")}
      >
        Seleccionar Dibujo de Identikit
      </Button>
    </Dialog>
  );
};

export default SketchDialog;
