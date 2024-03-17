import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridToolbarQuickFilter,
  GridToolbarContainer,
  esES,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { getAllSketches } from "../api/sketch.api";
import { Box, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

interface Sketches {
  id: number;
  canvas: boolean;
  output: string;
  description: string;
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

interface FacialSearchProps {
  search?: boolean;
  model?: boolean;
  onVerClick2?: () => void;
  rowData?: React.Dispatch<React.SetStateAction<never[]>>;
}

export const Identikits: React.FC<FacialSearchProps> = ({
  search = false,
  model = false,
  onVerClick2,
  rowData,
}) => {
  const [sketches, setSketches] = useState<Sketches[] | undefined>(undefined);
  const rows = sketches
    ? sketches.map((sketches) => ({
        ...sketches,
        id: sketches.id.toString(),
        createdAt: formatDate(sketches.createdAt),
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
    !model && {
      field: "actions",
      headerClassName: "header",
      headerAlign: "center",
      headerName: "Acciones",
      sortable: false,
      width: 120,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
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
                to={`/identikits/${params.row.id}`}
                onClick={() => {
                  localStorage.setItem("edit", "false");
                }}
              >
                <VisibilityIcon />
              </Link>
              <Link
                style={{ textDecoration: "none", color: "blue" }}
                to={`/identikits/${params.row.id}`}
                onClick={() => {
                  localStorage.setItem("edit", "true");
                }}
              >
                <EditIcon style={{ color: "blue" }} />
              </Link>
              <Link
                style={{ textDecoration: "none", color: "blue", marginLeft: 5 }}
                to={`/identikits/`}
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
                  localStorage.setItem("identikitId", params.row.id);
                  localStorage.setItem("edit", "false");
                  onVerClick2();
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

  const CustomToolbar1 = () => (
    <GridToolbarContainer
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <GridToolbarQuickFilter style={{ width: "40%" }} />
      <div>
        <GridToolbarFilterButton />
        {!search && !model && <GridToolbarExport />}
      </div>
    </GridToolbarContainer>
  );

  useEffect(() => {
    async function loadCriminals() {
      const res = await getAllSketches();
      const sortedCriminals = res.data.sort(
        (a: { id: number }, b: { id: number }) => a.id - b.id
      );
      setSketches(sortedCriminals);
    }
    loadCriminals();
  }, []);

  return (
    <Box
      sx={
        search || model
          ? { paddingTop: 5 }
          : { paddingLeft: 40, paddingTop: 5, backgroundColor: "#F0F1F4" }
      }
    >
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
          "& .imgCell": {
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          },
        }}
      >
        <DataGrid
          rows={rows}
          rowHeight={search || model ? 100 : 200}
          columns={columns}
          checkboxSelection={model}
          onRowSelectionModelChange={
            model
              ? (selection) => {
                  const selectedIDs = new Set(selection);
                  const selectedRows = rows
                    .filter((row) => selectedIDs.has(row.id))
                    .map(({ id, output }) => ({ id, output }));
                  rowData(selectedRows);
                }
              : undefined
          }
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 !== 0 ? "even" : "odd"
          }
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
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
          sx={{ width: !search && !model ? 1580 : 1490 }}
        />
      </Box>
    </Box>
  );
};
