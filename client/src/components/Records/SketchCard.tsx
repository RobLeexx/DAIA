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

export const SketchCard: React.FC<FacialSearchProps> = ({
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

  const fetchImages = async () => {
    try {
      const { data } = await getSketch(
        (search ? localStorage.getItem("criminalId") : params.id) as string
      );
      const imageUrl1 = data.input;
      const imageUrl2 = data.output;
      const res1 = await fetch(imageUrl1);
      if (!res1.ok) {
        throw new Error(`Image fetch failed: ${res1.statusText}`);
      }
      const res2 = await fetch(imageUrl2);
      if (!res2.ok) {
        throw new Error(`Image fetch failed: ${res2.statusText}`);
      }
      const imageBlob1 = await res1.blob();
      const imageBlob2 = await res2.blob();
      const imageObjectURL1 = URL.createObjectURL(imageBlob1);
      const imageObjectURL2 = URL.createObjectURL(imageBlob2);
      setImg1(imageObjectURL1);
      setImg2(imageObjectURL2);
    } catch (error) {
      console.error("Image fetch error:", error);
      setImg1("path/to/fallback/image.jpg");
    }
  };

  useEffect(() => {
    async function loadCriminal() {
      const { data } = await getSketch(
        (search ? localStorage.getItem("criminalId") : params.id) as string
      );
      console.log(localStorage.getItem("criminalId"));
      setDataSketch(data);
      setValue("description", data.description);
      fetchImages();
    }
    loadCriminal();
  }, [params.id, setValue]);

  /*   const setImage2Search = () => {
    if (setSelectedImage && handleComplete) {
      setSelectedImage(img);
      handleComplete();
    }
  }; */

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
            sx={{ marginInline: 10, width: "100%", height: 512, margin: 1, border:"2px solid #0B6BCB" }}
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
                width: search ? "30%" : "100%",
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
