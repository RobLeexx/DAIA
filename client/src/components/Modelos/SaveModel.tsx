import React, { useState, useEffect } from "react";
import { Button, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { getSketch } from "../../api/sketch.api";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NewCriminalDialog from "../Records/NewCriminalDialog";
import Textarea from "@mui/joy/Textarea";

interface FacialSearchProps {
  search?: boolean;
  onVerClickFalse?: () => void;
  setSelectedImage?: React.Dispatch<React.SetStateAction<File | null>>;
  handleComplete?: () => void;
}

export const SaveModel: React.FC<FacialSearchProps> = ({
  search = false,
  onVerClickFalse,
  setSelectedImage,
  handleComplete,
}) => {
  const edit = localStorage.getItem("edit");
  const isEdit = edit ? JSON.parse(edit) : false;
  const [open, setOpen] = React.useState(isEdit);
  const { register, setValue } = useForm();
  const [dataSketch, setDataSketch] = useState();
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const params = useParams();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    async function loadCriminal() {
      const { data } = await getSketch(
        (search ? localStorage.getItem("identikitId") : params.id) as string
      );
      setDataSketch(data);
      setValue("description", data.description);
      fetchImages();
    }
    loadCriminal();
  }, [params.id, setValue]);

  const setImage2Search = () => {
    if (setSelectedImage && handleComplete) {
      setSelectedImage(img2);
      handleComplete();
      onVerClickFalse();
      localStorage.setItem("criminalId", "false");
    }
  };

  return (
    <Box
      sx={
        !search
          ? {
              paddingLeft: 40,
              paddingTop: 3,
              backgroundColor: "#F0F1F4",
            }
          : undefined
      }
    >
      <div style={{ marginLeft: search ? -10 : 30, padding: search ? 10 : 20 }}>
        {search ? (
          <Button
            onClick={onVerClickFalse}
            style={{
              color: "white",
              backgroundColor: "#064887",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <ArrowBackIcon />
          </Button>
        ) : (
          <Link
            to={"/identikits"}
            style={{
              color: "white",
              backgroundColor: "#064887",
              padding: 12,
              paddingTop: 20,
              borderRadius: 10,
            }}
          >
            <ArrowBackIcon />
          </Link>
        )}
      </div>
      <form
        style={{
          paddingBottom: search ? 10 : 50,
          paddingInline: search ? undefined : 50,
          display: "flex",
          height: search ? 680 : undefined,
          width: search ? 1490 : undefined,
        }}
      >
        <div
          style={{
            flex: "0 0 calc(33.33% - 10px)",
            padding: 30,
            marginRight: 30,
            backgroundColor: "#064887",
          }}
        >
          <div>
            <label
              htmlFor="image-upload-input"
              style={{
                display: "flex",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <img
                src={img1}
                alt="Seleccionada"
                style={{
                  height: 500,
                  maxWidth: 500,
                  objectFit: "cover",
                }}
              />
            </label>
          </div>
        </div>
        <div
          style={{
            flex: "0 0 calc(33.33% - 10px)",
            padding: 30,
            marginRight: 30,
            backgroundColor: "#064887",
          }}
        >
          <div>
            <label
              htmlFor="image-upload-input"
              style={{
                display: "flex",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <img
                src={img2}
                alt="Seleccionada"
                style={{
                  height: 500,
                  maxWidth: 500,
                  objectFit: "cover",
                }}
              />
            </label>
          </div>
        </div>
        <div
          style={{
            width: "100%",
          }}
        >
          <Textarea
            minRows={2}
            placeholder="Descripción"
            size="lg"
            variant="soft"
            readOnly
            defaultValue=""
            sx={{
              marginInline: 10,
              width: "100%",
              height: 512,
              margin: 1,
              border: "2px solid #0B6BCB",
            }}
            {...register("description", { required: true })}
          />
          <div
            style={{
              width: "100%",
            }}
          >
            <Button
              autoFocus
              onClick={search ? setImage2Search : handleClickOpen}
              size="large"
              sx={{
                backgroundColor: search ? "#2E7D32" : "#1565C0",
                color: "white",
                width: "100%",
                height: "100%",
                margin: 1,
                "&:hover": {
                  color: "#2E7D32",
                  backgroundColor: "white",
                  outline: "2px solid #2E7D32",
                },
              }}
            >
              {search ? <span>Seleccionar Imagen</span> : <span>Editar</span>}
            </Button>
          </div>
        </div>
      </form>
      <NewCriminalDialog open={open} onClose={handleClose}></NewCriminalDialog>
    </Box>
  );
};
