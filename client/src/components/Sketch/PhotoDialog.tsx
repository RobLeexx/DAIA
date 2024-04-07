import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DangerousIcon from "@mui/icons-material/Dangerous";
import foto1 from "../../assets/foto1.jpeg";
import foto2 from "../../assets/foto2.jpg";

interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

const PhotoDialog: React.FC<SimpleDialogProps> = (props) => {
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
        <b>Subir Fotografía</b>
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
        La precisión de la Inteligencia Artificial en este método es de solo el
        <b> 60%</b>, pero siguiendo las siguiente recomendaciones se pueden
        maximizar los resultados: <br />{" "}
        <b>* La fotografía debe tener un formato de imagen PNG, JPG o JPEG.</b>{" "}
        <br />
        <b>* La fotografía no puede tener manchas.</b> <br />
        <b>
          * La fotografía no puede tener filtros ni saturación de colores de
          ningún tipo.
        </b>
        <br />
        <b>* Se debe encuadrar lo mejor posible a la cara.</b> <br />
        <b>* La imagen debe ser 4x4 (Cuadrada)</b> <br />
        <b>* Se recomienda usar flash.</b>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <DangerousIcon
            style={{
              position: "absolute",
              margin: 5,
              color: "red",
              fontSize: 100,
            }}
          >
            X
          </DangerousIcon>
          <img src={foto1} alt="" style={{ maxWidth: 450, height: 450 }} />
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
          <img src={foto2} alt="" style={{ maxWidth: 450, height: 450 }} />
        </div>
      </div>
      <div
        style={{
          padding: 20,
          textAlign: "center",
          backgroundColor: "#e3790f",
          color: "white",
        }}
      >
        De tener una precisión baja como resultado final se recomienda usar el
        primer método calcando la imagen subida de referencia.
      </div>
      <Button
        variant="contained"
        style={{ width: "100%", padding: 20 }}
        onClick={() => handleListItemClick("Subir Foto")}
      >
        Seleccionar Subida de Fotografía
      </Button>
    </Dialog>
  );
};

export default PhotoDialog;
