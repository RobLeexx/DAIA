import React, { useState } from "react";
import { Criminales } from "../../pages/Criminales";
import { Button, MenuItem, Select } from "@mui/material";
import { Identikits } from "../../pages/Identikits";

interface FilterDatabase {
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

export const FilterDatabase: React.FC<FilterDatabase> = ({ handleReload }) => {
  const [sketch, setSketch] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState("criminales");
  const [selectedRows, setSelectedRows] = useState([]);

  const handlePrintSelectedRows = () => {
    console.log(selectedRows);
  };

  const handleSelectChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedOption(event.target.value);
    setSelectedRows([]);
    if (event.target.value === "identikits") {
      setSketch(true);
    } else {
      setSketch(false);
    }
  };
  return (
    <div>
      {!sketch ? (
        <>
          <Criminales
            model={true}
            search={false}
            rowData={setSelectedRows}
          ></Criminales>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Button
                disabled={selectedRows.length === 0}
                variant="contained"
                onClick={handlePrintSelectedRows}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      ) : sketch ? (
        <>
          <Identikits
            search={false}
            model={true}
            rowData={setSelectedRows}
          ></Identikits>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Button
                disabled={selectedRows.length === 0}
                variant="contained"
                onClick={handlePrintSelectedRows}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
