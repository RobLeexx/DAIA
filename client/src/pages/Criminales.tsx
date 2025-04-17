import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  ChangeEvent,
} from "react";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridToolbarQuickFilter,
  GridToolbarContainer,
  GridCellParams,
  GridFilterInputValueProps,
  GridFilterOperator,
  GridFilterItem,
  esES,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { Chip, Typography } from "@mui/material";
import { getAllCriminals } from "../api/sketch.api";
import { Box, Button } from "@mui/material";
import Rating, { RatingProps } from "@mui/material/Rating";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NewCriminalDialog from "../components/Records/NewCriminalDialog";
import { Link } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import clsx from "clsx";

interface Criminal {
  id: number;
  lastname: string;
  name: string;
  alias: string;
  ci: string;
  mainPhoto: string;
  birthday: Date;
  nationality: string;
  description: string;
  criminalRecord: string;
  createdAt: Date;
}

function RatingInputValue(props: GridFilterInputValueProps) {
  const { item, applyValue, focusElementRef } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ratingRef: React.Ref<any> = React.useRef(null);
  React.useImperativeHandle(focusElementRef, () => ({
    focus: () => {
      ratingRef.current
        .querySelector(`input[value="${Number(item.value) || ""}"]`)
        .focus();
    },
  }));

  const handleFilterChange: RatingProps["onChange"] = (event, newValue) => {
    applyValue({ ...item, value: newValue });
  };

  return (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "center",
        height: 48,
        pl: "20px",
      }}
    >
      <Rating
        name="custom-rating-filter-operator"
        value={Number(item.value)}
        onChange={handleFilterChange}
        precision={0.5}
        ref={ratingRef}
      />
    </Box>
  );
}

type NumericInputValueProps = {
  item: { value: string };
  applyValue: (value: { value: string }) => void;
  focusElementRef: React.RefObject<{ focus: () => void }>;
};

const NumericInputValue: React.FC<NumericInputValueProps> = (props) => {
  const { item, applyValue, focusElementRef } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(focusElementRef, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    applyValue({ ...item, value: newValue });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: 48,
        pl: "50px",
      }}
    >
      <input
        ref={inputRef}
        type="number"
        value={item.value}
        onChange={handleInputChange}
        max={10}
        min={1}
      />
    </Box>
  );
};

const ratingOnlyOperators: GridFilterOperator[] = [
  {
    label: "Sobre",
    value: "dangerousness",
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }

      return (params): boolean => {
        return Number(params.value) >= Number(filterItem.value);
      };
    },
    InputComponent: RatingInputValue,
    InputComponentProps: { type: "number" },
    getValueAsString: (value: number) => `${value} Stars`,
  },
];

const numericOnlyOperators = [
  {
    label: "Sobre",
    value: "relapse",
    getApplyFilterFn: (filterItem: {
      field: string;
      value: number;
      operator: string;
    }) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }

      return (params: { value: number }) => {
        return Number(params.value) >= Number(filterItem.value);
      };
    },
    InputComponent: NumericInputValue,
    InputComponentProps: { type: "number" },
    getValueAsString: (value: { toString: () => string }) => value.toString(),
  },
];

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

const formatDate = (dateString: Date) => {
  const options = {
    year: "numeric" as const,
    month: "numeric" as const,
    day: "numeric" as const,
    hour: "numeric" as const,
    minute: "numeric" as const,
    second: "numeric" as const,
  };
  return new Date(dateString).toLocaleString("es-ES", options);
};

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

interface FacialSearchProps {
  search?: boolean;
  model?: boolean;
  onVerClick?: () => void;
  rowData?: React.Dispatch<React.SetStateAction<never[]>>;
}

const renderImageCell = (value: string) => {
  return (
    <div style={{ width: "800px", height: "800px", overflow: "hidden" }}>
      <img
        src={value}
        alt="imagen"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
};

export const Criminales: React.FC<FacialSearchProps> = ({
  search = false,
  model = false,
  onVerClick,
  rowData,
}) => {
  // Toggle view data
  const [useAltColumns, setUseAltColumns] = useState(false); // Alterna columnas
  const [pageSize, setPageSize] = useState(10);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [rowHeight, setRowHeight] = useState(48); // Alterna rowHeight

  const toggleData = () => {
    setUseAltColumns((prev) => !prev); // Alternamos columnas
    setPageSize((prev) => (prev === 10 ? 1 : 10)); // Alternamos pageSize
    setRowHeight((prev) => (prev === 48 ? 800 : 48)); // Alternamos rowHeight
    setPaginationModel((prev) => ({
      ...prev,
      pageSize: prev.pageSize === 10 ? 1 : 10,
    }));
  };

  const [open, setOpen] = React.useState(false);
  const [criminals, setCriminals] = useState<Criminal[] | undefined>(undefined);
  const rows = criminals
    ? criminals.map((criminal) => ({
        ...criminal,
        id: criminal.id.toString(),
        createdAt: formatDate(criminal.createdAt),
      }))
    : [];

  const columns: GridColDef[] = [
    {
      field: "id",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "ID",
      width: 22,
    },
    {
      field: "lastname",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Apellidos",
      width: search || model ? 170 : 175,
    },
    {
      field: "name",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Nombre",
      width: search || model ? 140 : 145,
    },
    {
      field: "alias",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Alias",
      width: search || model ? 120 : 125,
    },
    {
      field: "nationality",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Nacionalidad",
      width: 100,
    },
    {
      field: "birthday",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Edad",
      width: 50,
      valueGetter: (params: GridValueGetterParams) => {
        const age = calculateAge(params.value as Date);
        return age;
      },
    },
    {
      field: "ci",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "CI",
      width: 120,
    },
    {
      field: "phone",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Contacto",
      width: 90,
    },
    {
      field: "relapse",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Reincidencia",
      width: 100,
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
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Calidad",
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
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Género",
      width: search || model ? 90 : 100,
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
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Peligrosidad",
      width: search || model ? 135 : 140,
      renderCell: (params: { value: number }) => (
        <RatingComponent value={params.value} />
      ),
    },
    !model && {
      field: "actions",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Acciones",
      sortable: false,
      width: 120,
      renderCell: (params: GridValueGetterParams) => (
        <div style={{ width: "100%" }}>
          {!search ? (
            <div>
              <Link
                style={{
                  textDecoration: "none",
                  color: "blue",
                  marginRight: 10,
                }}
                to={`/criminales/${params.row.id}`}
                onClick={() => {
                  localStorage.setItem("edit", "false");
                }}
              >
                <VisibilityIcon />
              </Link>
              <Link
                style={{ textDecoration: "none", color: "blue" }}
                to={`/criminales/${params.row.id}`}
                onClick={() => {
                  localStorage.setItem("edit", "true");
                }}
              >
                <EditIcon style={{ color: "blue" }} />
              </Link>
              <Link
                style={{ textDecoration: "none", color: "blue", marginLeft: 5 }}
                to={`/criminales/`}
              >
                <DeleteIcon style={{ color: "#BA1818" }} />
              </Link>
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                borderRadius: 20,
                backgroundColor: "#064887",
              }}
            >
              <Button
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontWeight: "bolder",
                }}
                onClick={() => {
                  localStorage.setItem("criminalId", params.row.id);
                  localStorage.setItem("edit", "false");
                  onVerClick();
                }}
              >
                VER
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      field: "criminalOrganization",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Organización",
      width: 150,
    },
    {
      field: "criminalRecord",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Antecedentes",
      width: 150,
    },
    {
      field: "specialty",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Especialidad",
      width: 150,
    },
    {
      field: "address",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Domicilio",
      width: 300,
    },
    {
      field: "particularSigns",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Señales Particulares",
      width: 300,
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
  ].filter(Boolean);

  const columns2: GridColDef[] = [
    {
      field: "id",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "ID",
      width: 22,
    },
    {
      field: "mainPhoto",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Entrada",
      width: 800,
      cellClassName: "imgCell",
      renderCell: (params: GridRenderCellParams) =>
        renderImageCell(params.value as string),
    },
    {
      field: "fullData",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Datos",
      width: search || model ? 300 : 320,
      valueGetter: (params: {
        row: {
          ci: string;
          lastname: string;
          name: string;
          age: number;
          birthday: Date;
          alias: string;
          nationality: string;
          description: string;
          particularSigns: string;
          specialty: string;
          criminalRecord: string;
          address: string;
          phone: string;
          relapse: number | null;
          status: string;
          gender: string;
          dangerousness: string | number;
        };
      }) => {
        const ci = params.row.ci || "Sin CI";
        const lastname = params.row.lastname || "Sin Apellido";
        const name = params.row.name || "Sin Nombre";
        const age = calculateAge(params.row.birthday);
        const birthday = params.row.birthday || "";
        const alias = params.row.alias || "Sin Alias";
        const nationality = params.row.nationality || "Sin Nacionalidad";
        const description = params.row.description || "";
        const particularSigns = params.row.particularSigns || "Ninguna";
        const specialty = params.row.specialty || "";
        const criminalRecord = params.row.criminalRecord || "Sin antecedentes";
        const address = params.row.address || "Sin dirección";
        const phone = params.row.phone || "Sin teléfono";
        const relapse = params.row.relapse;
        const status = params.row.status || "";
        const gender = params.row.gender || "";
        const dangerousness = params.row.dangerousness || 0;

        const getRelapseColor = () => {
          if (relapse == null) return "default";
          if (relapse <= 3) return "success";
          if (relapse <= 5) return "warning";
          return "error";
        };

        const getStatusColor = () => {
          if (status === "Arrestado" || status === "Aprehendido") return "info"; // azul
          if (status === "Prófugo") return "warning"; // naranja
          if (status === "Con Captura Internacional") return "error"; // rojo
          return "default"; // valor por defecto
        };

        const getStatusColorGender = () => {
          if (gender === "Masculino") return "info"; // azul
          if (gender === "Femenino") return "default"; // rojo
          return "default"; // valor por defecto
        };

        const relapseText = relapse != null ? relapse.toString() : "N/A";
        return (
          <>
            <Typography component="span" fontWeight="bold">
              Cedula:
            </Typography>{" "}
            {ci}
            <br />
            <Typography component="span" fontWeight="bold">
              Apellido:
            </Typography>{" "}
            {lastname}
            <br />
            <Typography component="span" fontWeight="bold">
              Nombre:
            </Typography>{" "}
            {name}
            <br />
            <Typography component="span" fontWeight="bold">
              Edad:
            </Typography>{" "}
            {age}
            <br />
            <Typography component="span" fontWeight="bold">
              Fecha de nacimiento:
            </Typography>{" "}
            {birthday}
            <br />
            <Typography component="span" fontWeight="bold">
              Alias:
            </Typography>{" "}
            {alias}
            <br />
            <Typography component="span" fontWeight="bold">
              Nacionalidad:
            </Typography>{" "}
            {nationality}
            <br />
            <Typography component="span" fontWeight="bold">
              Descripción:
            </Typography>{" "}
            {description}
            <br />
            <Typography component="span" fontWeight="bold">
              Señales Particulares:
            </Typography>{" "}
            {particularSigns}
            <br />
            <Typography component="span" fontWeight="bold">
              Especialidad:
            </Typography>{" "}
            {specialty}
            <br />
            <Typography component="span" fontWeight="bold">
              Antecedentes:
            </Typography>{" "}
            {criminalRecord}
            <br />
            <Typography component="span" fontWeight="bold">
              Domicilio:
            </Typography>{" "}
            {address}
            <br />
            <Typography component="span" fontWeight="bold">
              Teléfono:
            </Typography>{" "}
            {phone}
            <hr />
            <Typography component="span" fontWeight="bold">
              Reincidencia:
            </Typography>{" "}
            <Chip
              label={relapseText}
              color={getRelapseColor()}
              size="medium"
              variant="filled"
              sx={{
                ml: 1,
                ...(relapse == null && {
                  backgroundColor: "action.disabledBackground",
                }),
              }}
            />
            <br />
            <br />
            <Chip
              label={status || "N/A"}
              color={getStatusColor()}
              variant="filled"
              size="medium"
              sx={{
                ml: 1,
                fontWeight: 600,
                ...(status === "Con Captura Internacional" && {
                  borderWidth: "2px",
                  borderColor: "error.dark",
                }),
              }}
            />
            <br />
            <br />
            <Chip
              label={
                (gender === "Femenino" && "Mujer") ||
                (gender === "Masculino" && "Hombre")
              }
              color={getStatusColorGender()}
              variant="filled"
              size="medium"
              sx={{
                ml: 1,
                fontWeight: 600,
                ...(gender === "Femenino" && {
                  backgroundColor: "rgba(255, 182, 193, 0.2)", // fondo rosado claro
                  borderColor: "pink[500]", // borde rosado
                  color: "pink[800]", // texto rosado oscuro
                }),
                ...(gender === "Masculino" && {
                  borderWidth: "1.5px", // destacar más el borde azul
                }),
              }}
            />
            <br />
            <br />
            <div style={{ textAlign: "center", width: "100%" }}>
              <RatingComponent value={dangerousness} size="large" />
            </div>
          </>
        );
      },
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", wordWrap: "break-word" }}>
          {params.value}
        </div>
      ),
    },
    !model && {
      field: "actions",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Acciones",
      sortable: false,
      width: 120,
      renderCell: (params: GridValueGetterParams) => (
        <div style={{ width: "100%" }}>
          {!search ? (
            <div>
              <Link
                style={{
                  textDecoration: "none",
                  color: "blue",
                  marginRight: 10,
                }}
                to={`/criminales/${params.row.id}`}
                onClick={() => {
                  localStorage.setItem("edit", "false");
                }}
              >
                <VisibilityIcon />
              </Link>
              <Link
                style={{ textDecoration: "none", color: "blue" }}
                to={`/criminales/${params.row.id}`}
                onClick={() => {
                  localStorage.setItem("edit", "true");
                }}
              >
                <EditIcon style={{ color: "blue" }} />
              </Link>
              <Link
                style={{ textDecoration: "none", color: "blue", marginLeft: 5 }}
                to={`/criminales/`}
              >
                <DeleteIcon style={{ color: "#BA1818" }} />
              </Link>
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                borderRadius: 20,
                backgroundColor: "#064887",
              }}
            >
              <Button
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontWeight: "bolder",
                }}
                onClick={() => {
                  localStorage.setItem("criminalId", params.row.id);
                  localStorage.setItem("edit", "false");
                  onVerClick();
                }}
              >
                VER
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      field: "createdAt",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Creado en",
      width: 160,
    },
    {
      field: "lastname",
    },
  ].filter(Boolean);

  columns.forEach((col) => {
    if (col.field === "dangerousness") {
      col.filterOperators = ratingOnlyOperators;
    } else if (col.field === "relapse") {
      col.filterOperators = numericOnlyOperators;
    }
  });

  const CustomToolbar1 = () => (
    <GridToolbarContainer
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <GridToolbarQuickFilter style={{ width: "40%" }} />
      <div>
        <GridToolbarColumnsButton />
        {!search && !model && <GridToolbarDensitySelector />}
        <GridToolbarFilterButton />
        {!search && !model && <GridToolbarExport />}
      </div>
    </GridToolbarContainer>
  );

  useEffect(() => {
    async function loadCriminals() {
      const res = await getAllCriminals();
      const sortedCriminals = res.data.sort(
        (a: { id: number }, b: { id: number }) => a.id - b.id
      );
      setCriminals(sortedCriminals);
    }
    loadCriminals();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={
        search || model
          ? { paddingTop: 5 }
          : { paddingLeft: 40, paddingTop: 2, backgroundColor: "#F0F1F4" }
      }
    >
      {!search && !model && (
        <div
          style={{
            padding: 20,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            onClick={toggleData}
            startIcon={<RemoveRedEyeIcon />}
          >
            Cambiar Vista
          </Button>
          <Button
            variant="contained"
            onClick={handleClickOpen}
            startIcon={<AddCircleIcon />}
          >
            Nuevo Registro
          </Button>
        </div>
      )}

      <Box
        sx={{
          height: "100%",
          width: "100%",
          "& .header": {
            backgroundColor: "#4882B9",
            color: "white",
            fontWeight: "600",
          },
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
        }}
      >
        <DataGrid
          rows={rows}
          columns={useAltColumns ? columns2 : columns} // Alterna columnas dinámicamente
          rowHeight={rowHeight} // Alterna rowHeight entre 48 y 800
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 !== 0 ? "even" : "odd"
          }
          paginationModel={paginationModel} // Controla la paginación dinámicamente
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[1, 10]}
          hideFooterSelectedRowCount={!model}
          checkboxSelection={model}
          showCellVerticalBorder
          components={{
            Toolbar: () => <CustomToolbar1 />,
          }}
          localeText={{
            ...esES.components.MuiDataGrid.defaultProps.localeText,
          }}
          sx={{ width: !search && !model ? 1580 : 1490 }}
        />
      </Box>
      <NewCriminalDialog open={open} onClose={handleClose}></NewCriminalDialog>
    </Box>
  );
};
