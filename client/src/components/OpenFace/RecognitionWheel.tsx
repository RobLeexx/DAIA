import React, { useEffect, useState } from "react";
import maleImage from "../../assets/male.jpg";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
  styled,
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

interface RecognitionWheelProps {
  selectedValue: string;
  handleBack: () => void;
  selectedImage: File | null;
  loading: boolean;
  handleButtonClick: () => void;
  handleReload: () => void;
  tenMatches: { per: string; mainPhoto: string; result_id: number }[];
  selectedModel: string;
  option: (value: string) => void;
  models: string[];
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
  selectedModel,
  option,
  models,
}) => {
  const [matchColors, setMatchColors] = useState<string[]>([]);
  const [selectedOptionLocal, setSelectedOption] =
    React.useState(selectedModel);

  const handleSelectChange = (event: { target: { value: string } }) => {
    const newOption = event.target.value;
    setSelectedOption(newOption);
    option(newOption);
  };

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
            src={
              selectedImage && selectedValue == "Seleccionar Base de Datos"
                ? selectedImage
                : URL.createObjectURL(selectedImage)
            }
            alt="Imagen"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
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
              Atrás
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minWidth: 300,
              }}
            >
              <Button variant="contained" onClick={handleButtonClick}>
                BUSCAR
              </Button>
              <Typography sx={{ margin: 2, textAlign: "center" }}>
                Seleccionar Modelo:
              </Typography>
              <Select value={selectedOptionLocal} onChange={handleSelectChange}>
                {models.map((model) => (
                  <MenuItem key={model.name} value={model.name}>
                    <Typography sx={{ width: 300 }}>{model.name}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minWidth: 300,
              }}
            >
              <Button variant="outlined" disabled>
                CARGANDO
              </Button>
            </div>
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
                  width: 400,
                  height: 400,
                  objectFit: "cover",
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
          {loading ? (
            <div
              style={{
                width: 400,
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
        <>
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <Typography sx={{ fontSize: 28, fontWeight: "bolder" }}>
              MEJORES COINCIDENCIAS CON: {selectedOptionLocal}
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "baseline",
              padding: 20,
            }}
          >
            {tenMatches.map((match, index) => (
              <div key={index} style={{ padding: 20 }}>
                <a
                  href={`http://localhost:5173/criminales/${match.result_id}`}
                  onClick={() => {
                    localStorage.setItem("edit", "false");
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={match.mainPhoto}
                    style={{
                      width: 230,
                      height: 230,
                      objectFit: "cover",
                      border: "5px solid #0a934e",
                    }}
                    alt={`Criminal ${index + 1}`}
                  />
                </a>
                <ColoredDiv
                  style={{
                    backgroundColor: matchColors[index],
                    color: "white",
                  }}
                >
                  {match.per}
                </ColoredDiv>
              </div>
            ))}

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
        </>
      ) : (
        <img />
      )}
    </Box>
  );
};

export default RecognitionWheel;
