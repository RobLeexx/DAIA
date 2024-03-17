import React, { useState } from "react";
import { Criminales } from "../../pages/Criminales";
import { Button, MenuItem, Select } from "@mui/material";
import { Identikits } from "../../pages/Identikits";

interface FilterDatabase {
  handleComplete: () => void;
  handleReload: () => void;
  rowData: (value: string[]) => void;
  selectedOption: string;
  option: (value: string) => void;
}

export const FilterDatabase: React.FC<FilterDatabase> = ({
  handleReload,
  handleComplete,
  rowData,
  selectedOption,
  option,
}) => {
  const [sketch, setSketch] = React.useState(false);
  const [selectedOptionLocal, setSelectedOption] =
    React.useState(selectedOption);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handlePrintSelectedRows = () => {
    rowData(selectedRows.slice());
    handleComplete();
  };

  const handleSelectChange = (event: { target: { value: string } }) => {
    const newOption = event.target.value;
    setSelectedOption(newOption);
    option(newOption);
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
                value={selectedOptionLocal}
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
                value={selectedOptionLocal}
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
