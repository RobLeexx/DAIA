import React, { useState, useEffect } from "react";
import { Navigation } from "../Navigation";
import { Button, TextField, Rating } from "@mui/material";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import DrawIcon from "@mui/icons-material/Draw";
import { useForm, Controller } from "react-hook-form";
import StarIcon from "@mui/icons-material/Star";
import { getCriminal } from "../../api/sketch.api";
import { useParams } from "react-router-dom";
import NewCriminalDialog from "../Records/NewCriminalDialog";

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

export const CriminalCard: React.FC = () => {
  const edit = localStorage.getItem("edit");
  const isEdit = edit ? JSON.parse(edit) : false;
  const [open, setOpen] = React.useState(isEdit);
  const { register, control, setValue } = useForm();
  const [dataCriminal, setDataCriminal] = useState();
  const [age, setAge] = useState(0);
  const [img, setImg] = useState("");
  const params = useParams();
  const [value1, setValue1] = React.useState<number | null>();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchImage = async () => {
    try {
      const { data } = await getCriminal(params.id as string);
      const imageUrl = data.mainPhoto;
      const res = await fetch(imageUrl);
      if (!res.ok) {
        throw new Error(`Image fetch failed: ${res.statusText}`);
      }
      const imageBlob = await res.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setImg(imageObjectURL);
    } catch (error) {
      console.error("Image fetch error:", error);
      setImg("path/to/fallback/image.jpg"); // Set a fallback image
    }
  };

  useEffect(() => {
    async function loadCriminal() {
      const { data } = await getCriminal(params.id as string);
      setDataCriminal(data);
      setValue("lastname", data.lastname);
      setValue("name", data.name);
      setValue("birthday", data.birthday);
      setAge(() => {
        const age = calculateAge(data.birthday as Date);
        return age;
      });
      if (!data.alias) {
        setValue("alias", "ninguno");
      } else {
        setValue("alias", data.alias);
      }
      setValue("description", data.description);
      if (!data.criminalRecord) {
        setValue("criminalRecord", "ninguno");
      } else {
        setValue("criminalRecord", data.criminalRecord);
      }
      setValue("ci", data.ci);
      if (!data.phone) {
        setValue("phone", "ninguno");
      } else {
        setValue("phone", data.phone);
      }
      setValue("address", data.address);
      setValue("gender", data.gender);
      setValue("nationality", data.nationality);
      if (!data.criminalOrganization) {
        setValue("criminalOrganization", "ninguna");
      } else {
        setValue("criminalOrganization", data.criminalOrganization);
      }
      setValue1(() => {
        return data.dangerousness;
      });
      setValue("relapse", data.relapse);
      if (!data.particularSigns) {
        setValue("particularSigns", "ninguna");
      } else {
        setValue("particularSigns", data.particularSigns);
      }
      setValue("specialty", data.specialty);
      setValue("status", data.status);
      fetchImage();
    }
    loadCriminal();
  }, [params.id, setValue]);

  const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newImages = Array.from(event.target.files); // Convert FileList to array
      setSelectedImages([...selectedImages, ...newImages]); // Append new images
    }
  };
  return (
    <Navigation>
      <form style={{ padding: 50, display: "flex", minHeight: 800 }}>
        <div
          style={{
            flex: "0 0 calc(40% - 10px)",
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
                src={img}
                alt="Seleccionada"
                style={{
                  height: 500,
                }}
              />
            </label>
            <div
              style={{
                padding: 40,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {dataCriminal && (
                <Rating
                  readOnly
                  style={{ color: "white", fontSize: 80 }}
                  value={value1}
                  precision={0.5}
                  emptyIcon={
                    <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                />
              )}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            flex: "0 0 calc(60% - 10px)",
          }}
        >
          <Controller
            name="lastname"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                style={{ flex: "0 0 calc(33.33% - 10px)", margin: 5 }}
                type="text"
                variant="outlined"
                id="lastname"
                {...field}
                label="Apellidos"
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
                style={{ flex: "0 0 calc(33.33% - 10px)", margin: 5 }}
                type="text"
                variant="outlined"
                id="name"
                {...field}
                label="Nombre"
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                style={{ flex: "0 0 calc(33.33% - 10px)", margin: 5 }}
                type="text"
                variant="outlined"
                id="address"
                {...field}
                label="Domicilio"
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                type="text"
                variant="outlined"
                id="status"
                {...field}
                label="Estado"
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />
          <Controller
            name="alias"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                type="text"
                {...field}
                label="Alias"
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />
          <Controller
            name="ci"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                type="text"
                variant="outlined"
                id="ci"
                {...field}
                label="Carnet de Identidad"
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />
          <Controller
            name="criminalRecord"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                type="text"
                variant="outlined"
                id="criminalRecord"
                {...field}
                label="Antecedentes"
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                style={{ flex: "0 0 calc(75% - 10px)", margin: 5 }}
                type="text"
                variant="outlined"
                id="description"
                {...field}
                label="Descripción"
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />

          <input
            type="file"
            style={{ display: "none" }}
            multiple
            accept="image/*"
            id="photos-upload-input"
            {...register("photos", { required: false })}
            onChange={handleFileChange2}
          />
          <label
            htmlFor="photos-upload-input"
            style={{
              display: "flex",
              flex: "0 0 calc(25% - 10px)",
              margin: 5,
              flexDirection: "column",
            }}
          >
            <Button
              style={{ height: "75%" }}
              component="span"
              variant="outlined"
              startIcon={<SwitchAccountIcon />}
            >
              Ver Fotos
            </Button>
          </label>
          <Controller
            name="particularSigns"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                style={{ flex: "0 0 calc(75% - 10px)", margin: 5 }}
                type="text"
                variant="outlined"
                id="particularSigns"
                {...field}
                label="Señales Particulares"
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />

          <Button
            style={{ flex: "0 0 calc(25% - 10px)", margin: 5, height: "10%" }}
            component="label"
            variant="outlined"
            startIcon={<DrawIcon />}
          >
            Ver Dibujos
          </Button>
          <Controller
            name="gender"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                style={{ flex: "0 0 calc(20% - 10px)", margin: 5 }}
                type="text"
                variant="outlined"
                id="gender"
                {...field}
                label="Género"
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />
          <Controller
            name="birthday"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                style={{ flex: "0 0 calc(20% - 10px)", margin: 5 }}
                type="text"
                variant="outlined"
                id="birthday"
                {...field}
                label="Fecha de nacimiento"
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />
          <TextField
            style={{ flex: "0 0 calc(20% - 10px)", margin: 5 }}
            type="text"
            variant="outlined"
            value={age}
            label="Edad"
            InputProps={{
              readOnly: true,
            }}
          />
          <Controller
            name="nationality"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                style={{ flex: "0 0 calc(20% - 10px)", margin: 5 }}
                type="text"
                variant="outlined"
                id="nationality"
                {...field}
                label="Nacionalidad"
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                style={{ flex: "0 0 calc(20% - 10px)", margin: 5 }}
                type="text"
                variant="outlined"
                id="phone"
                {...field}
                label="Celular/Teléfono"
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />
          <Controller
            name="criminalOrganization"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                type="text"
                variant="outlined"
                id="criminalOrganization"
                {...field}
                label="Organización Criminal"
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />
          <Controller
            name="specialty"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                style={{ flex: "0 0 calc(50% - 10px)", margin: 5 }}
                type="text"
                variant="outlined"
                id="specialty"
                {...field}
                label="Especialidad"
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />
          <Controller
            name="relapse"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                type="text"
                variant="outlined"
                id="relapse"
                {...field}
                label="Reincidencia"
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "end",
              margin: 5,
            }}
          >
            <Button
              autoFocus
              onClick={handleClickOpen}
              size="large"
              sx={{
                backgroundColor: "#1565C0",
                color: "white",
                width: "20%",
                height: "100%",
                "&:hover": {
                  color: "#1565C0",
                  backgroundColor: "white",
                  outline: "2px solid #1565C0",
                },
              }}
            >
              Editar
            </Button>
          </div>
        </div>
      </form>
      <NewCriminalDialog open={open} onClose={handleClose}></NewCriminalDialog>
    </Navigation>
  );
};
