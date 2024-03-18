import React, { useState, useEffect } from "react";
import { Button, Box, TextField, Typography, Rating } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Textarea from "@mui/joy/Textarea";
import clsx from "clsx";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { getAllModels, uploadModel } from "../../api/sketch.api";

interface FacialSearchProps {
  selectedOption: string;
  handleBack?: () => void;
  rowData: string[];
}
type RatingComponentProps = {
  value: number;
};

const RatingComponent: React.FC<RatingComponentProps> = ({ value }) => {
  return (
    <Rating
      value={value}
      readOnly
      precision={0.5}
      style={{ color: "#064887" }}
    />
  );
};

const convertCanvas = (canvas: boolean) => {
  if (canvas) {
    return "Sí";
  } else {
    return "No";
  }
};

const renderImageCell = (value: string) => {
  return (
    <img
      src={value}
      alt="imagen"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
    />
  );
};
interface Model {
  type: string;
  name: string;
  length: number;
  data: { id: number; img: string }[];
  description: string;
}

export const SaveModel: React.FC<FacialSearchProps> = ({
  selectedOption,
  handleBack,
  rowData,
}) => {
  const { register, control, setValue, handleSubmit, watch } = useForm();
  const name = watch("name");
  const [isNameEmpty, setIsNameEmpty] = useState(true);
  const [isDescriptionEmpty, setIsDescriptionEmpty] = useState(true);
  const [isName, setIsName] = React.useState(false);
  const params = useParams();

  const onSubmit = handleSubmit(async (data) => {
    const formData = data as Model;
    const response = await getAllModels();
    const allModels = response.data;
    const isNameExists = Object.values(allModels).some(
      (model: Model) => model.name === formData.name
    );
    if (isNameExists) {
      setIsName(true);
      return;
    }
    const filteredData = rowData.map((item) => ({
      id: item.id,
      img: selectedOption === "criminales" ? item.mainPhoto : item.output,
    }));
    formData.data = filteredData;
    await uploadModel(formData);
    window.location.reload();
  });

  const handleDescriptionChange = (event: { target: { value: string } }) => {
    setIsDescriptionEmpty(event.target.value === "");
  };

  const isButtonDisabled = !name?.trim() || isDescriptionEmpty;

  const calculateAge = (birthday: Date) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };
  const rows = rowData;
  const criminalColumns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 10 },
    {
      field: "lastname",
      headerAlign: "center",
      headerName: "Apellidos",
      width: 175,
    },
    {
      field: "name",
      headerAlign: "center",
      headerName: "Nombre",
      width: 145,
    },
    {
      field: "alias",
      headerAlign: "center",
      headerName: "Alias",
      width: 125,
    },
    {
      field: "nationality",
      headerAlign: "center",
      headerName: "Nacionalidad",
      width: 120,
    },
    {
      field: "birthday",
      headerAlign: "center",
      headerName: "Edad",
      width: 60,
      valueGetter: (params: GridValueGetterParams) => {
        const age = calculateAge(params.value as Date);
        return age;
      },
    },
    {
      field: "ci",
      headerAlign: "center",
      headerName: "CI",
      width: 120,
    },
    {
      field: "phone",
      headerAlign: "center",
      headerName: "Contacto",
      width: 90,
    },
    {
      field: "relapse",
      headerAlign: "center",
      headerName: "Reincidencia",
      width: 110,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellClassName: (params: GridCellParams<any, number>) => {
        if (params.value == null) {
          return "";
        }
        return clsx("status", {
          green: params.value <= 3,
          yellow: params.value <= 5,
          orange: params.value <= 7,
          red: params.value >= 8,
        });
      },
    },
    {
      field: "status",
      headerAlign: "center",
      headerName: "Estado",
      width: 200,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellClassName: (params: GridCellParams<any, string>) => {
        return clsx("status", {
          blue: params.value === "Arrestado" || params.value === "Aprehendido",
          orange: params.value === "Prófugo",
          red: params.value === "Con Captura Internacional",
        });
      },
    },
    {
      field: "gender",
      headerAlign: "center",
      headerName: "Género",
      width: 100,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellClassName: (params: GridCellParams<any, string>) => {
        return clsx("gender", {
          male: params.value === "Masculino",
          woman: params.value === "Femenino",
        });
      },
    },
    {
      field: "dangerousness",
      headerAlign: "center",
      headerName: "Peligrosidad",
      width: 140,
      renderCell: (params: { value: number }) => (
        <RatingComponent value={params.value} />
      ),
    },
    {
      field: "criminalOrganization",
      headerAlign: "center",
      headerName: "Organización",
      width: 150,
    },
    {
      field: "criminalRecord",
      headerAlign: "center",
      headerName: "Antecedentes",
      width: 150,
    },
    {
      field: "specialty",
      headerAlign: "center",
      headerName: "Especialidad",
      width: 150,
    },
    {
      field: "address",
      headerAlign: "center",
      headerName: "Domicilio",
      width: 300,
    },
    {
      field: "particularSigns",
      headerAlign: "center",
      headerName: "Señales Particulares",
      width: 300,
    },

    {
      field: "description",
      headerAlign: "center",
      headerName: "Descripción",
      width: 300,
    },
    {
      field: "createdAt",
      headerAlign: "center",
      headerName: "Creado en",
      width: 160,
    },
  ];
  const identikitColumns: GridColDef[] = [
    {
      field: "id",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "ID",
      width: 22,
    },
    {
      field: "input",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Entrada",
      width: 220,
      cellClassName: "imgCell",
      renderCell: (params: GridRenderCellParams) =>
        renderImageCell(params.value as string),
    },
    {
      field: "output",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Salida",
      width: 220,
      cellClassName: "imgCell",
      renderCell: (params: GridRenderCellParams) =>
        renderImageCell(params.value as string),
    },
    {
      field: "canvas",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Dibujo",
      width: 100,
      cellClassName: "imgCell",
      valueGetter: (params: GridValueGetterParams) => {
        const dibujo = convertCanvas(params.value as boolean);
        return dibujo;
      },
    },
    {
      field: "description",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Descripción",
      width: 300,
    },
    {
      field: "createdAt",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Creado en",
      width: 160,
    },
  ];

  useEffect(() => {
    async function loadData() {
      setValue("type", selectedOption);
      setValue("length", rowData.length);
    }
    loadData();
  }, [params.id, setValue]);

  return (
    <Box
      sx={{
        "& .even": {
          backgroundColor: "#DAE2EA",
        },
        "& .status": {
          display: "flex",
          justifyContent: "center",
          color: "white",
        },
        "& .status.blue": {
          backgroundColor: "#064887",
        },
        "& .status.orange": {
          backgroundColor: "#FF4D00",
          fontWeight: "600",
        },
        "& .status.red": {
          backgroundColor: "#B80000",
          fontWeight: "600",
        },
        "& .status.yellow": {
          backgroundColor: "#D7AD15",
          fontWeight: "600",
        },
        "& .status.green": {
          backgroundColor: "#16A726",
          fontWeight: "600",
        },
        "& .gender.male": {
          backgroundColor: "#4882B9",
          display: "flex",
          justifyContent: "center",
          color: "white",
        },
        "& .gender.woman": {
          backgroundColor: "pink",
          display: "flex",
          justifyContent: "center",
        },
        "& .imgCell": {
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
        },
      }}
    >
      <div style={{ paddingBlock: 20 }}>
        <Button
          onClick={handleBack}
          style={{
            color: "white",
            backgroundColor: "#064887",
            padding: 10,
            borderRadius: 10,
          }}
        >
          <ArrowBackIcon />
        </Button>
      </div>
      <form
        style={{
          paddingBottom: 50,
          display: "flex",
        }}
      >
        <div
          style={{
            flex: "0 0 calc(60% - 10px)",
            padding: 30,
            marginRight: 30,
            maxHeight: 610,
            backgroundColor: "#064887",
          }}
        >
          <Typography
            color={"white"}
            align="center"
            paddingBottom={3}
            fontWeight={"bolder"}
            fontSize={22}
          >
            DATOS SELECCIONADOS
          </Typography>
          <DataGrid
            disableColumnMenu
            columns={
              selectedOption === "criminales"
                ? criminalColumns
                : identikitColumns
            }
            rows={rows}
            hideFooter
            style={{ backgroundColor: "white", height: 500, width: 820 }}
          ></DataGrid>
        </div>
        <div
          style={{
            flex: "0 0 calc(40% - 10px)",
          }}
        >
          <Controller
            name="type"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                style={{ width: "60%", margin: 5 }}
                type="text"
                variant="outlined"
                id="type"
                {...field}
                label="Tipo"
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />
          <Controller
            name="length"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                style={{ width: "35%", margin: 5 }}
                type="number"
                variant="outlined"
                id="length"
                {...field}
                label="Cantidad"
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                style={{ width: "97%", margin: 5 }}
                variant="outlined"
                id="name"
                {...field}
                label="Nombre del Modelo"
                error={isName}
                inputProps={{ maxLength: 30 }}
              />
            )}
          />
          <TextField
            rows={16}
            multiline
            placeholder="Descripción"
            defaultValue=""
            inputProps={{ maxLength: 500 }}
            sx={{
              marginInline: 10,
              width: "97%",
              height: 410,
              margin: 1,
            }}
            {...register("description", { required: true })}
            onChange={handleDescriptionChange}
          />
          <div
            style={{
              width: "100%",
            }}
          ></div>
          <Button
            disabled={isButtonDisabled}
            autoFocus
            size="large"
            onClick={onSubmit}
            sx={{
              backgroundColor: "#0a934e",
              color: "white",
              width: "97%",
              margin: 1,
              "&:hover": {
                color: "#0a934e",
                backgroundColor: "white",
                outline: "2px solid #0a934e",
              },
            }}
          >
            Guardar
          </Button>
          {isName && (
            <div
              style={{
                textAlign: "center",
                color: "red",
                fontWeight: "bolder",
                padding: 5,
              }}
            >
              EL NOMBRE DEL MODELO YA ESTÁ REGISTRADO
            </div>
          )}
        </div>
      </form>
    </Box>
  );
};
