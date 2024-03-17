import React from "react";
import { Criminales } from "../../pages/Criminales";
import { CriminalCard } from "../Records/CriminalCard";
import { Button, MenuItem, Select } from "@mui/material";
import { Identikits } from "../../pages/Identikits";
import { SketchCard } from "../Records/SketchCard";

interface ChooseDatabaseProps {
  isCriminalSelected: boolean;
  handleVerClick: () => void;
  handleVerClickFalse: () => void;
  isIdentikitSelected: boolean;
  handleVerClick2: () => void;
  handleVerClickFalse2: () => void;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
  handleComplete: () => void;
  handleReload: () => void;
}

export const ChooseDatabase: React.FC<ChooseDatabaseProps> = ({
  isCriminalSelected,
  handleVerClick,
  handleVerClickFalse,
  isIdentikitSelected,
  handleVerClick2,
  handleVerClickFalse2,
  setSelectedImage,
  handleComplete,
  handleReload,
}) => {
  const [sketch, setSketch] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState("criminales");

  const handleSelectChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedOption(event.target.value);
    if (event.target.value === "identikits") {
      setSketch(true);
    } else {
      setSketch(false);
    }
  };
  return (
    <div>
      {!isCriminalSelected && !sketch ? (
        <>
          <Criminales
            search={true}
            model={false}
            onVerClick={handleVerClick}
          ></Criminales>
          <div style={{ marginTop: "10px" }}>
            <Button
              variant="contained"
              onClick={handleReload}
              sx={{
                marginRight: 5,
                backgroundColor: "#FF5733",
                "&:hover": {
                  backgroundColor: "#A7331B",
                },
              }}
            >
              Volver a Seleccionar Imagen
            </Button>
            <span>Base de Datos:</span>
            <Select
              sx={{ marginInline: 5 }}
              value={selectedOption}
              onChange={handleSelectChange}
            >
              <MenuItem value="criminales">Criminales</MenuItem>
              <MenuItem value="identikits">Identikits</MenuItem>
            </Select>
          </div>
        </>
      ) : !isIdentikitSelected && sketch ? (
        <>
          <Identikits search={true} model={false} onVerClick2={handleVerClick2}></Identikits>
          <div style={{ marginTop: "10px" }}>
            <Button
              variant="contained"
              onClick={handleReload}
              sx={{
                marginRight: 5,
                backgroundColor: "#FF5733",
                "&:hover": {
                  backgroundColor: "#A7331B",
                },
              }}
            >
              Volver a Seleccionar Imagen
            </Button>
            <span>Base de Datos:</span>
            <Select
              sx={{ marginInline: 5 }}
              value={selectedOption}
              onChange={handleSelectChange}
            >
              <MenuItem value="criminales">Criminales</MenuItem>
              <MenuItem value="identikits">Identikits</MenuItem>
            </Select>
          </div>
        </>
      ) : isCriminalSelected ? (
        <CriminalCard
          search={true}
          onVerClickFalse={handleVerClickFalse}
          setSelectedImage={setSelectedImage}
          handleComplete={handleComplete}
        ></CriminalCard>
      ) : isIdentikitSelected ? (
        <SketchCard
          search={true}
          onVerClickFalse={handleVerClickFalse2}
          setSelectedImage={setSelectedImage}
          handleComplete={handleComplete}
        ></SketchCard>
      ) : null}
    </div>
  );
};
