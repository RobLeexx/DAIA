import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, Card, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import circular from "../../assets/rostros/circular.png";
import circularX from "../../assets/rostros/circularX.jpg";
import cuadrado from "../../assets/rostros/cuadrado.png";
import cuadradoX from "../../assets/rostros/cuadradoX.jpg";
import diamante from "../../assets/rostros/diamante.png";
import diamanteX from "../../assets/rostros/diamanteX.jpg";
import ovalado from "../../assets/rostros/ovalado.png";
import ovaladoX from "../../assets/rostros/ovaladoX.jpg";
import rectangular from "../../assets/rostros/rectangular.png";
import rectangularX from "../../assets/rostros/rectangularX.jpg";
import triangular from "../../assets/rostros/triangular.png";
import triangularX from "../../assets/rostros/triangularX.jpg";
import nullX from "../../assets/rostros/null.jpg";

interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
  setSelectedValue: (value: string) => void;
}

const TemplatesDialog: React.FC<SimpleDialogProps> = (props) => {
  const { onClose, open, setSelectedValue } = props;

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = () => {
    setSelectedValue(nullX);
    onClose();
  };

  const handleListItemClick0 = () => {
    setSelectedValue(ovaladoX);
    onClose();
  };

  const handleListItemClick1 = () => {
    setSelectedValue(circularX);
    onClose();
  };

  const handleListItemClick2 = () => {
    setSelectedValue(cuadradoX);
    onClose();
  };

  const handleListItemClick3 = () => {
    setSelectedValue(rectangularX);
    onClose();
  };

  const handleListItemClick4 = () => {
    setSelectedValue(diamanteX);
    onClose();
  };

  const handleListItemClick5 = () => {
    setSelectedValue(triangularX);
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth={false}>
      <DialogTitle style={{ display: "flex", justifyContent: "center" }}>
        <b>Plantilla: Tipos de Rostro</b>
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
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex" }}>
          <div>
            <Card
              sx={{
                width: 300,
                cursor: "pointer",
                "&:hover": {
                  opacity: "100%",
                  outline: "5px solid #064887",
                },
              }}
            >
              <img
                src={ovalado}
                width={300}
                onClick={() => handleListItemClick0()}
              />
            </Card>
            <Typography
              align="center"
              fontWeight="bolder"
              fontSize={20}
              paddingTop={1}
            >
              Ovalado
            </Typography>
          </div>
          <div>
            <Card
              sx={{
                width: 300,
                marginInline: 5,
                cursor: "pointer",
                "&:hover": {
                  opacity: "100%",
                  outline: "5px solid #064887",
                },
              }}
            >
              <img
                src={circular}
                width={300}
                onClick={() => handleListItemClick1()}
              />
            </Card>
            <Typography
              align="center"
              fontWeight="bolder"
              fontSize={20}
              paddingTop={1}
            >
              Circular
            </Typography>
          </div>
          <div>
            <Card
              sx={{
                width: 300,
                cursor: "pointer",
                "&:hover": {
                  opacity: "100%",
                  outline: "5px solid #064887",
                },
              }}
            >
              <img
                src={cuadrado}
                width={300}
                onClick={() => handleListItemClick2()}
              />
            </Card>
            <Typography
              align="center"
              fontWeight="bolder"
              fontSize={20}
              paddingTop={1}
            >
              Cuadrado
            </Typography>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div>
            <Card
              sx={{
                width: 300,
                cursor: "pointer",
                "&:hover": {
                  opacity: "100%",
                  outline: "5px solid #064887",
                },
              }}
            >
              <img
                src={rectangular}
                width={300}
                onClick={() => handleListItemClick3()}
              />
            </Card>
            <Typography
              align="center"
              fontWeight="bolder"
              fontSize={20}
              paddingTop={1}
            >
              Rectangular
            </Typography>
          </div>
          <div>
            <Card
              sx={{
                width: 300,
                marginInline: 5,
                cursor: "pointer",
                "&:hover": {
                  opacity: "100%",
                  outline: "5px solid #064887",
                },
              }}
            >
              <img
                src={diamante}
                width={300}
                onClick={() => handleListItemClick4()}
              />
            </Card>
            <Typography
              align="center"
              fontWeight="bolder"
              fontSize={20}
              paddingTop={1}
            >
              Diamante
            </Typography>
          </div>
          <div>
            <Card
              sx={{
                width: 300,
                cursor: "pointer",
                "&:hover": {
                  opacity: "100%",
                  outline: "5px solid #064887",
                },
              }}
            >
              <img
                src={triangular}
                width={300}
                onClick={() => handleListItemClick5()}
              />
            </Card>
            <Typography
              align="center"
              fontWeight="bolder"
              fontSize={20}
              paddingTop={1}
            >
              Triangular
            </Typography>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around" }}></div>
      <Button
        variant="contained"
        style={{ width: "100%", backgroundColor: "red", padding: 20 }}
        onClick={() => handleListItemClick()}
      >
        Eliminar Plantilla
      </Button>
    </Dialog>
  );
};

export default TemplatesDialog;
