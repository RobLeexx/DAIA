import React, { useEffect, useState } from "react";
import { Navigation } from "../components/Navigation";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridToolbarQuickFilter,
  GridToolbar,
  GridToolbarContainer,
  GridCellParams,
  GridFilterInputValueProps,
  GridFilterOperator,
  GridFilterItem,
  esES,
} from "@mui/x-data-grid";
import { getAllCriminals } from "../api/sketch.api";
import { Box, Button } from "@mui/material";
import Rating, { RatingProps } from "@mui/material/Rating";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NewCriminalDialog from "../components/Records/NewCriminalDialog";
import { Link } from "react-router-dom";
import clsx from "clsx";

interface Criminal {
  id: number;
  lastname: string;
  name: string;
  alias: string;
  ci: string;
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

type RatingComponentProps = {
  value: number;
};

const CustomToolbar1 = () => (
  <GridToolbarContainer
    style={{ display: "flex", justifyContent: "space-between" }}
  >
    <GridToolbarQuickFilter style={{ width: "40%" }} />
    <GridToolbar />
  </GridToolbarContainer>
);

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
    width: 180,
  },
  {
    field: "name",
    headerClassName: "header",
    headerAlign: "center",
    headerName: "Nombre",
    width: 150,
  },
  {
    field: "alias",
    headerClassName: "header",
    headerAlign: "center",
    headerName: "Alias",
    width: 150,
  },
  {
    field: "nationality",
    headerClassName: "header",
    headerAlign: "center",
    headerName: "Nacionalidad",
    width: 130,
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
    width: 150,
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
    headerClassName: "header",
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
    headerClassName: "header",
    headerAlign: "center",
    headerName: "Peligrosidad",
    width: 140,
    renderCell: (params) => <RatingComponent value={params.value} />,
  },
  {
    field: "actions",
    headerClassName: "header",
    headerAlign: "center",
    headerName: "Acciones",
    sortable: false,
    width: 120,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    renderCell: (params: GridValueGetterParams) => (
      <div>
        <Link
          style={{ textDecoration: "none", color: "blue", marginRight: 10 }}
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
];

columns.forEach((col) => {
  if (col.field === "dangerousness") {
    col.filterOperators = ratingOnlyOperators;
  }
});

export const Criminales: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [criminals, setCriminals] = useState<Criminal[] | undefined>(undefined);
  const rows = criminals
    ? criminals.map((criminal) => ({
        ...criminal,
        id: criminal.id.toString(),
        createdAt: formatDate(criminal.createdAt),
      }))
    : [];

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
    <Navigation>
      <div style={{ padding: 20, textAlign: "end" }}>
        <Button
          variant="contained"
          onClick={handleClickOpen}
          startIcon={<AddCircleIcon></AddCircleIcon>}
        >
          Nuevo Registro
        </Button>
      </div>
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
          "& .status.blue": {
            backgroundColor: "#064887",
            display: "flex",
            justifyContent: "center",
            color: "white",
          },
          "& .status.orange": {
            backgroundColor: "#FF4D00",
            fontWeight: "600",
            display: "flex",
            justifyContent: "center",
            color: "white",
          },
          "& .status.red": {
            backgroundColor: "#B80000",
            fontWeight: "600",
            display: "flex",
            justifyContent: "center",
            color: "white",
          },
          "& .status.yellow": {
            backgroundColor: "#D7AD15",
            fontWeight: "600",
            display: "flex",
            justifyContent: "center",
            color: "white",
          },
          "& .status.green": {
            backgroundColor: "#16A726",
            fontWeight: "600",
            display: "flex",
            justifyContent: "center",
            color: "white",
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
          columns={columns}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 !== 0 ? "even" : "odd"
          }
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10]}
          hideFooterSelectedRowCount
          showCellVerticalBorder
          components={{
            Toolbar: () => (
              <>
                <CustomToolbar1 />
              </>
            ),
          }}
          localeText={{
            ...esES.components.MuiDataGrid.defaultProps.localeText,
          }}
          sx={{ width: 1590 }}
        />
      </Box>
      <NewCriminalDialog open={open} onClose={handleClose}></NewCriminalDialog>
    </Navigation>
  );
};
