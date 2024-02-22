import React, { useEffect, useState } from "react";
import { Navigation } from "../components/Navigation";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridToolbarQuickFilter,
  esES,
} from "@mui/x-data-grid";
import { getAllCriminals } from "../api/sketch.api";
import { Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NewCriminalDialog from "../components/Records/NewCriminalDialog";
import { Link } from "react-router-dom";

interface Criminal {
  id: number;
  lastname: string;
  name: string;
  alias: string;
  ci: string;
  birthday: Date;
  case: string;
  description: string;
  criminal_record: string;
  createdAt: Date;
}

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
  { field: "id", headerName: "ID", width: 70 },
  { field: "lastname", headerName: "Apellidos", width: 200 },
  { field: "name", headerName: "Nombre", width: 200 },
  { field: "alias", headerName: "Alias", width: 130 },
  { field: "case", headerName: "Casos", width: 130 },
  { field: "ci", headerName: "CI", width: 100 },
  {
    field: "birthday",
    headerName: "Edad",
    width: 50,
    valueGetter: (params: GridValueGetterParams) => {
      const age = calculateAge(params.value as Date);
      return age;
    },
  },
  { field: "description", headerName: "Descripción", width: 200 },
  { field: "criminal_record", headerName: "Antecedentes", width: 130 },
  { field: "createdAt", headerName: "Creado en", width: 160 },
  {
    field: "actions",
    headerName: "Acciones",
    sortable: false,
    width: 120,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    renderCell: (params: GridValueGetterParams) => (
      <Link
        style={{ textDecoration: "none", color: "blue" }}
        to={`/criminales/${params.row.id}`}
      >
        <VisibilityIcon />
      </Link>
    ),
  },
];

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
      setCriminals(res.data);
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
      <div style={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10]}
          hideFooterSelectedRowCount
          showCellVerticalBorder
          slots={{ toolbar: GridToolbarQuickFilter }}
          localeText={{
            ...esES.components.MuiDataGrid.defaultProps.localeText,
          }}
        />
      </div>
      <NewCriminalDialog open={open} onClose={handleClose}></NewCriminalDialog>
    </Navigation>
  );
};
