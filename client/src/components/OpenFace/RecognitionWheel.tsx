import React, { useEffect, useState } from "react";
import maleImage from "../../assets/male.jpg";
import { Box, Button, CircularProgress, styled } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

interface RecognitionWheelProps {
  selectedValue: string;
  handleBack: () => void;
  selectedImage: File | null;
  loading: boolean;
  handleButtonClick: () => void;
  handleReload: () => void;
  tenMatches: { per: string; mainPhoto: string; result_id: number }[];
}

const ColoredDiv = styled("div")(({ theme }) => ({
  textAlign: "center",
  width: "100%",
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
}));

const RecognitionWheel: React.FC<RecognitionWheelProps> = ({
  selectedValue,
  handleBack,
  selectedImage,
  loading,
  handleButtonClick,
  handleReload,
  tenMatches,
}) => {
  const [matchColors, setMatchColors] = useState<string[]>([]);

  useEffect(() => {
    if (tenMatches) {
      const newMatchColors = tenMatches.map((match) =>
        getBackgroundColor(match.per)
      );
      setMatchColors(newMatchColors);
    }
  }, [tenMatches]);

  const getBackgroundColor = (per: string): string => {
    const perValue = parseFloat(per.replace("%", ""));

    if (perValue > 90) {
      return "#0a934e";
    } else if (perValue > 80) {
      return "#46930a";
    } else if (perValue > 70) {
      return "#7e930a";
    } else if (perValue > 60) {
      return "#93820a";
    } else if (perValue > 50) {
      return "#934f0a";
    } else {
      return "#c90000";
    }
  };

  return (
    <Box>
      <div
        style={{
          display: "flex",
          padding: 30,
          justifyContent: "space-evenly",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", height: 400 }}>
          <img
            src={selectedImage ? URL.createObjectURL(selectedImage) : ""}
            alt="Imagen"
            style={{
              width: "100%",
              height: "100%",
              border: "5px solid #1769aa",
            }}
          />
          {selectedValue === "Subir Foto2" ? (
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
              style={{ marginTop: 20 }}
              variant="contained"
              onClick={handleBack}
            >
              Editar Dibujo
            </Button>
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
            <Button variant="contained" onClick={handleButtonClick}>
              BUSCAR
            </Button>
          ) : (
            <Button variant="outlined" disabled>
              CARGANDO
            </Button>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", height: 400 }}>
          {!loading && tenMatches[0] && (
            <a
              href={`http://localhost:5173/criminales/${tenMatches[0].result_id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <img
                src={tenMatches[0].mainPhoto}
                alt="Imagen"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "5px solid #0a934e",
                }}
              />
            </a>
          )}
          {!loading && !tenMatches[0] && (
            <img
              src={maleImage}
              alt="Imagen"
              style={{
                width: "100%",
                height: "100%",
                border: "5px solid #0a934e",
              }}
            />
          )}
          {loading && selectedValue === "Subir Foto2" ? (
            <div
              style={{
                width: 512,
                height: 400,
              }}
            >
              <img
                src={maleImage}
                style={{
                  width: 400,
                  height: 400,
                  position: "absolute",
                  opacity: "35%",
                }}
              />
              <CircularProgress size={400} />
            </div>
          ) : null}
          {tenMatches && tenMatches[0] && (
            <ColoredDiv
              style={{ backgroundColor: matchColors[0], color: "white" }}
            >
              {tenMatches[0].per}
            </ColoredDiv>
          )}
        </div>
      </div>
      {tenMatches[0] ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "baseline",
            padding: 20,
          }}
        >
          <div style={{ padding: 20 }}>
            <a
              href={`http://localhost:5173/criminales/${tenMatches[1].result_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={tenMatches[1].mainPhoto} />
            </a>
            <ColoredDiv
              style={{ backgroundColor: matchColors[1], color: "white" }}
            >
              {tenMatches[1].per}
            </ColoredDiv>
          </div>
          <div style={{ padding: 20 }}>
            <a
              href={`http://localhost:5173/criminales/${tenMatches[2].result_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={tenMatches[2].mainPhoto} />
            </a>
            <ColoredDiv
              style={{ backgroundColor: matchColors[2], color: "white" }}
            >
              {tenMatches[2].per}
            </ColoredDiv>
          </div>
          <div style={{ padding: 20 }}>
            <a
              href={`http://localhost:5173/criminales/${tenMatches[3].result_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={tenMatches[3].mainPhoto} />
            </a>
            <ColoredDiv
              style={{ backgroundColor: matchColors[3], color: "white" }}
            >
              {tenMatches[3].per}
            </ColoredDiv>
          </div>
          <div style={{ padding: 20 }}>
            <a
              href={`http://localhost:5173/criminales/${tenMatches[4].result_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={tenMatches[4].mainPhoto} />
            </a>
            <ColoredDiv
              style={{ backgroundColor: matchColors[4], color: "white" }}
            >
              {tenMatches[4].per}
            </ColoredDiv>
          </div>
          <div style={{ padding: 20 }}>
            <a
              href={`http://localhost:5173/criminales/${tenMatches[5].result_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={tenMatches[5].mainPhoto} />
            </a>
            <ColoredDiv
              style={{ backgroundColor: matchColors[5], color: "white" }}
            >
              {tenMatches[5].per}
            </ColoredDiv>
          </div>
          <div style={{ padding: 20 }}>
            <a
              href={`http://localhost:5173/criminales/${tenMatches[6].result_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={tenMatches[6].mainPhoto} />
            </a>
            <ColoredDiv
              style={{ backgroundColor: matchColors[6], color: "white" }}
            >
              {tenMatches[6].per}
            </ColoredDiv>
          </div>
          <div style={{ padding: 20 }}>
            <a
              href={`http://localhost:5173/criminales/${tenMatches[7].result_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={tenMatches[7].mainPhoto} />
            </a>
            <ColoredDiv
              style={{ backgroundColor: matchColors[7], color: "white" }}
            >
              {tenMatches[7].per}
            </ColoredDiv>
          </div>
          <div style={{ padding: 20 }}>
            <a
              href={`http://localhost:5173/criminales/${tenMatches[8].result_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={tenMatches[8].mainPhoto} />
            </a>
            <ColoredDiv
              style={{ backgroundColor: matchColors[8], color: "white" }}
            >
              {tenMatches[8].per}
            </ColoredDiv>
          </div>
          <div style={{ padding: 20 }}>
            <a
              href={`http://localhost:5173/criminales/${tenMatches[9].result_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={tenMatches[9].mainPhoto} />
            </a>
            <ColoredDiv
              style={{ backgroundColor: matchColors[9], color: "white" }}
            >
              {tenMatches[9].per}
            </ColoredDiv>
          </div>
          <div
            style={{
              padding: 20,
              margin: 10,
              backgroundColor: "#909090",
            }}
          >
            <GroupAddIcon
              style={{ color: "white", height: 200, fontSize: 180 }}
            ></GroupAddIcon>
          </div>
        </div>
      ) : (
        <img />
      )}
    </Box>
  );
};

export default RecognitionWheel;
