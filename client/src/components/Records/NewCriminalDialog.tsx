import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Dialog,
  IconButton,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Input,
  Slide,
  TextField,
  MenuItem,
  Rating,
  Box,
  Checkbox,
  OutlinedInput,
  ListItemText,
  Avatar,
  Tooltip,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import DrawIcon from "@mui/icons-material/Draw";
import { TransitionProps } from "@mui/material/transitions";
import { useForm, Controller } from "react-hook-form";
import StarIcon from "@mui/icons-material/Star";
import HelpIcon from "@mui/icons-material/Help";
import maleImage from "../../assets/male.jpg";
import womanImage from "../../assets/woman.jpg";
import maleErrorImage from "../../assets/maleError.jpg";
import {
  uploadCriminal,
  updateCriminal,
  getCriminal,
} from "../../api/sketch.api";
import { useParams } from "react-router-dom";

const labels: { [index: string]: string } = {
  0.5: "Iniciante",
  1: "Novato",
  1.5: "Aficionado",
  2: "Regular",
  2.5: "Recurrente",
  3: "Peligroso",
  3.5: "Amenazante",
  4: "Dominante",
  4.5: "Muy Peligroso",
  5: "Extremadamente Peligroso",
};

const getLabelText = (value: number) => {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const names = ["Motochorro", "Autero", "Accesorista", "Hurto de Vehículos"];

interface NewCriminalDialogProps {
  open: boolean;
  onClose: () => void;
}

const NewCriminalDialog: React.FC<NewCriminalDialogProps> = (props) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { onClose, open } = props;
  const [img, setImg] = useState("");
  const [hover, setHover] = React.useState(-1);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [errorImage, setErrorImage] = useState(false);
  const params = useParams();
  const [gender, setGender] = useState("Masculino");
  const [status, setStatus] = useState("Arrestado");
  const [dng, setDng] = React.useState<number | null>(2);
  const [personName, setPersonName] = React.useState<string[]>([]);

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    // 18
    if (selectedImage) {
      formData.append("mainPhoto", selectedImage);
    }
    formData.append("lastnameDad", data.lastnameDad);
    formData.append("lastnameMom", data.lastnameMom);
    formData.append("departamento", data.departamento);
    formData.append("provincia", data.provincia);
    formData.append("localidad", data.localidad);
    formData.append("nombrePadre", data.nombrePadre);
    formData.append("nombreMadre", data.nombreMadre);
    formData.append("expedido", data.expedido);
    formData.append("nivelAcademico", data.nivelAcademico);
    formData.append("ocupacion", data.ocupacion);
    formData.append("centroTrabajo", data.centroTrabajo);
    formData.append("direccionPadres", data.direccionPadres);
    formData.append("estadoCivil", data.estadoCivil);
    formData.append("nombreConyuge", data.nombreConyuge);
    formData.append("apellidoMaternoConyuge", data.apellidoMaternoConyuge);
    formData.append("apellidoPaternoConyuge", data.apellidoPaternoConyuge);
    formData.append("colorPiel", data.colorPiel);
    formData.append("colorPelo", data.colorPelo);
    formData.append("colorOjos", data.colorOjos);
    formData.append("estatura", data.estatura);
    formData.append("peso", data.peso);
    formData.append("delito", data.delito);
    formData.append("numCaso", data.numCaso);
    formData.append("autoridad", data.autoridad);
    formData.append("funcionario", data.funcionario);

    formData.append("name", data.name);
    formData.append("birthday", data.birthday);
    formData.append("alias", data.alias);
    formData.append("ci", data.ci);
    //formData.append("criminalRecord", data.criminalRecord);
    if (data.phone) {
      formData.append("phone", data.phone);
    } else {
      formData.append("phone", 0);
    }
    formData.append("address", data.address);
    formData.append("gender", data.gender);
    formData.append("nationality", data.nationality);
    //formData.append("criminalOrganization", data.criminalOrganization);
    formData.append("dangerousness", dng);
    formData.append("relapse", data.relapse);
    formData.append("particularSigns", data.particularSigns);
    formData.append("specialty", personName);
    formData.append("status", data.status);
    // Subida de múltiples fotos
    if (selectedPhotos.length > 0) {
      selectedPhotos.forEach((file, index) => {
        formData.append(`photos[${index}].photo`, file);
      });
    }

    // Subida de múltiples identikits
    if (selectedIdentikits.length > 0) {
      selectedIdentikits.forEach((file, index) => {
        formData.append(`identikits[${index}].identikit`, file);
      });
    }
    if (!params.id && selectedImage) {
      uploadCriminal(formData);
    } else if (params.id) {
      updateCriminal(params.id, formData);
    }
    window.location.reload();
  });

  // Estados para almacenar los archivos seleccionados
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [selectedIdentikits, setSelectedIdentikits] = useState<File[]>([]);

  const handlePhotosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedPhotos(Array.from(event.target.files));
    }
  };

  const handleIdentikitsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setSelectedIdentikits(Array.from(event.target.files));
    }
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
      if (params.id) {
        const { data } = await getCriminal(params.id as string);
        setValue("lastnameDad", data.lastnameDad);
        setValue("lastnameMom", data.lastnameMom);
        setValue("departamento", data.departamento);
        setValue("provincia", data.provincia);
        setValue("localidad", data.localidad);
        setValue("nombrePadre", data.nombrePadre);
        setValue("nombreMadre", data.nombreMadre);
        setValue("expedido", data.expedido);
        setValue("nivelAcademico", data.nivelAcademico);
        setValue("ocupacion", data.ocupacion);
        setValue("centroTrabajo", data.centroTrabajo);
        setValue("direccionPadres", data.direccionPadres);
        setValue("estadoCivil", data.estadoCivil);
        setValue("nombreConyuge", data.nombreConyuge);
        setValue("apellidoMaternoConyuge", data.apellidoMaternoConyuge);
        setValue("apellidoPaternoConyuge", data.apellidoPaternoConyuge);
        setValue("colorPiel", data.colorPiel);
        setValue("colorPelo", data.colorPelo);
        setValue("colorOjos", data.colorOjos);
        setValue("estatura", data.estatura);
        setValue("peso", data.peso);
        setValue("delito", data.delito);
        setValue("numCaso", data.numCaso);
        setValue("autoridad", data.autoridad);
        setValue("funcionario", data.funcionario);

        setValue("name", data.name);
        setValue("birthday", data.birthday);
        setValue("alias", data.alias);
        //setValue("criminalRecord", data.criminalRecord);
        setValue("ci", data.ci);
        setValue("phone", data.phone);
        setValue("address", data.address);
        setValue("gender", data.gender);
        setGender(data.gender);
        setValue("nationality", data.nationality);
        //setValue("criminalOrganization", data.criminalOrganization);
        setValue("relapse", data.relapse);
        setValue("particularSigns", data.particularSigns);
        setValue("status", data.status);
        setStatus(data.status);
        fetchImage();
      }
    }
    loadCriminal();
  }, []);

  useEffect(() => {
    const localPersonName = async () => {
      try {
        if (params.id) {
          const { data } = await getCriminal(params.id as string);
          const resultArray = data.specialty.flatMap((item: string) =>
            item.split(",")
          );
          return resultArray;
        } else {
          return ["Motochorro"];
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        return ["Motochorro"];
      }
    };

    localPersonName().then((result) => setPersonName(result));
  }, [params.id]);

  useEffect(() => {
    const localDng = async () => {
      if (params.id) {
        const { data } = await getCriminal(params.id as string);
        return data.dangerousness;
      } else {
        return 2;
      }
    };

    localDng().then((result) => setDng(result));
  }, [params.id]);

  const handleClose = () => {
    onClose();
  };
  const verifyImage = () => {
    if (!selectedImage) {
      setErrorImage(true);
    } else {
      onSubmit;
    }
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedImage(file);
      if (params.id) setImg(URL.createObjectURL(file));
    }
  };

  const handleChangeGender = (event: SelectChangeEvent) => {
    setGender(event.target.value as string);
  };
  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };
  const campos = [
    "lastnameDad",
    "departamento",
    "provincia",
    "localidad",
    "expedido",
    "nivelAcademico",
    "ocupacion",
    "estadoCivil",
    "colorPiel",
    "colorPelo",
    "colorOjos",
    "estatura",
    "peso",
    "delito",
    "numCaso",
    "autoridad",
    "funcionario",
    "name",
    "ci",
    "address",
    "description",
    "birthday",
    "nationality",
  ];
  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar sx={{ backgroundColor: "#064887" }}>
            <IconButton
              aria-label="close"
              edge="start"
              onClick={handleClose}
              sx={{
                backgroundColor: "red",
                color: "white",
                "&:hover": {
                  color: "red",
                  backgroundColor: "white",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              sx={{ ml: 2, flex: 2, textAlign: "center" }}
              variant="h6"
              component="div"
            >
              {!params.id ? (
                <p>Crear nuevo registro</p>
              ) : (
                <p>Editar registro</p>
              )}
            </Typography>
          </Toolbar>
        </AppBar>
        <form
          onSubmit={onSubmit}
          style={{ padding: 50, display: "flex", height: "100%" }}
        >
          <div
            style={{ flex: "0 0 calc(40% - 10px)", padding: 20, height: 500 }}
          >
            <Input
              type="file"
              style={{ display: "none" }}
              id="image-upload-input"
              {...register("mainPhoto", { required: false })}
              onChange={handleFileChange}
            />
            <label
              htmlFor="image-upload-input"
              style={{
                display: "flex",
                justifyContent: "center",
                height: "100%",
              }}
            >
              {params.id ? (
                <img
                  src={img}
                  alt="Seleccionada"
                  style={{
                    maxWidth: 650,
                  }}
                />
              ) : !errorImage && gender === "Masculino" ? (
                <img
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : maleImage
                  }
                  alt="Seleccionada"
                  style={{
                    maxWidth: 650,
                  }}
                />
              ) : !errorImage && gender === "Femenino" ? (
                <img
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : womanImage
                  }
                  alt="Seleccionada"
                  style={{
                    maxWidth: 650,
                  }}
                />
              ) : (
                <img
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : maleErrorImage
                  }
                  alt="Seleccionada"
                  style={{
                    maxWidth: 650,
                  }}
                />
              )}
            </label>
            <div
              style={{
                margin: 25,
                display: "flex",
                justifyContent: "space-around",
                backgroundColor: "#D9E0F1",
                borderRadius: 50,
                padding: 5,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  padding: 15,
                }}
              >
                <Tooltip title="Campo relacionados a Inteligencia Artificial">
                  <Avatar
                    sx={{
                      outline: "5px solid #064887",
                      bgcolor: "white",
                      color: "#064887",
                      fontWeight: "bolder",
                    }}
                  >
                    IA
                  </Avatar>
                </Tooltip>
              </div>
              <Typography
                sx={{ padding: 2, fontWeight: "bold", textAlign: "center" }}
              >
                La foto principal seleccionada será implementada en el
                entrenamiento de Generación de Identikits y en la búsqueda por
                Reconocimiento Facial.
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            ></div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              flex: "0 0 calc(60% - 10px)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                flex: "0 0 calc(100% - 10px)",
                overflowY: "auto", // Scroll vertical si hay desbordamiento
                maxHeight: "100vh", // Ajusta esto según el tamaño deseado del contenedor
              }}
            >
              <Controller
                name="lastnameDad"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                    type="text"
                    variant="filled"
                    id="lastnameDad"
                    {...field}
                    label="Apellido Paterno"
                    error={Boolean(errors.lastnameDad)}
                  />
                )}
              />
              <TextField
                style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                type="text"
                variant="filled"
                id="lastnameMom"
                label="Apellido Materno"
                {...register("lastnameMom", { required: false })}
              />
              <Controller
                name="name"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                    type="text"
                    variant="filled"
                    id="name"
                    {...field}
                    label="Nombre"
                    error={Boolean(errors.name)}
                  />
                )}
              />
              <TextField
                style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                type="text"
                label="Alias"
                variant="filled"
                {...register("alias", { required: false })}
              />
              <Controller
                name="departamento"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                    type="text"
                    variant="filled"
                    id="departamento"
                    {...field}
                    label="Departamento"
                    error={Boolean(errors.departamento)}
                  />
                )}
              />
              <Controller
                name="provincia"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                    type="text"
                    variant="filled"
                    id="provincia"
                    {...field}
                    label="Provincia"
                    error={Boolean(errors.provincia)}
                  />
                )}
              />
              <Controller
                name="localidad"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                    type="text"
                    variant="filled"
                    id="localidad"
                    {...field}
                    label="Localidad"
                    error={Boolean(errors.localidad)}
                  />
                )}
              />
              <Controller
                name="address"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                    type="text"
                    variant="filled"
                    id="address"
                    {...field}
                    label="Dirección"
                    error={Boolean(errors.address)}
                  />
                )}
              />
              <div style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}>
                <h5
                  style={{
                    position: "absolute",
                    margin: 0,
                    padding: 5,
                    paddingLeft: 110,
                  }}
                >
                  Estado
                </h5>
                <Select
                  style={{ width: "100%" }}
                  id="status"
                  variant="filled"
                  value={status}
                  label="Estado"
                  {...register("status", { required: false })}
                  onChange={handleChangeStatus}
                >
                  <MenuItem value="Arrestado">Arrestado</MenuItem>
                  <MenuItem value="Aprehendido">Aprehendido</MenuItem>
                  <MenuItem value="Prófugo">Prófugo</MenuItem>
                  <MenuItem value="Con Captura Internacional">
                    Con Captura Internacional
                  </MenuItem>
                </Select>
              </div>
              <Controller
                name="ci"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(15% - 10px)", margin: 5 }}
                    type="text"
                    variant="filled"
                    id="ci"
                    {...field}
                    label="Carnet de Identidad"
                    error={Boolean(errors.ci)}
                  />
                )}
              />
              <Controller
                name="expedido"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(10% - 10px)", margin: 5 }}
                    type="text"
                    variant="filled"
                    id="expedido"
                    {...field}
                    label="Expedido"
                    error={Boolean(errors.ci)}
                  />
                )}
              />
              <Controller
                name="nivelAcademico"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                    type="text"
                    variant="filled"
                    id="nivelAcademico"
                    {...field}
                    label="Nivel Académico"
                    error={Boolean(errors.nivelAcademico)}
                  />
                )}
              />
              <Controller
                name="ocupacion"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                    type="text"
                    variant="filled"
                    id="ocupacion"
                    {...field}
                    label="Ocupación"
                    error={Boolean(errors.ocupacion)}
                  />
                )}
              />
              <TextField
                style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                type="text"
                variant="filled"
                id="centroTrabajo"
                label="Centro Trabajo/Estudio"
                {...register("centroTrabajo", { required: false })}
              />
              <TextField
                style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                type="text"
                variant="filled"
                id="nombrePadre"
                label="Nombre del Padre"
                {...register("nombrePadre", { required: false })}
              />
              <TextField
                style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                type="text"
                variant="filled"
                id="nombreMadre"
                label="Nombre de la Madre"
                {...register("nombreMadre", { required: false })}
              />
              <TextField
                style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                type="text"
                variant="filled"
                id="direccionPadres"
                label="Dirección de los Padres"
                {...register("direccionPadres", { required: false })}
              />
              <Controller
                name="estadoCivil"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                    type="text"
                    variant="filled"
                    id="estadoCivil"
                    {...field}
                    label="Estado Civil"
                    error={Boolean(errors.estadoCivil)}
                  />
                )}
              />
              <TextField
                style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                type="text"
                variant="filled"
                id="nombreConyuge"
                label="Nombre Cónyuge"
                {...register("nombreConyuge", { required: false })}
              />
              <TextField
                style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                type="text"
                variant="filled"
                id="apellidoPaternoConyuge"
                label="Apellido Paterno Cónyuge"
                {...register("apellidoPaternoConyuge", { required: false })}
              />
              <TextField
                style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                type="text"
                variant="filled"
                id="apellidoMaternoConyuge"
                label="Apellido Materno Cónyuge"
                {...register("apellidoMaternoConyuge", { required: false })}
              />
              <>
                {/*  
              <input
                type="file"
                style={{ display: "none" }}
                multiple
                accept="image/*"
                id="photos-upload-input"
                {...register("photos", { required: false })}
                onChange={handlePhotosChange}
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
                  variant="contained"
                  startIcon={<SwitchAccountIcon />}
                >
                  {selectedPhotos.length > 0
                    ? `(${selectedPhotos.length} Fotos seleccionadas)`
                    : "Subir Fotos"}
                </Button>
              </label>*/}
              </>
              <Controller
                name="colorPiel"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(15% - 10px)", margin: 5 }}
                    type="text"
                    variant="filled"
                    id="colorPiel"
                    {...field}
                    label="Color de Piel"
                    error={Boolean(errors.colorPiel)}
                  />
                )}
              />
              <Controller
                name="colorPelo"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(15% - 10px)", margin: 5 }}
                    type="text"
                    variant="filled"
                    id="colorPelo"
                    {...field}
                    label="Color de Pelo"
                    error={Boolean(errors.colorPelo)}
                  />
                )}
              />
              <Controller
                name="colorOjos"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(15% - 10px)", margin: 5 }}
                    type="text"
                    variant="filled"
                    id="colorOjos"
                    {...field}
                    label="Color de Ojos"
                    error={Boolean(errors.colorOjos)}
                  />
                )}
              />
              <Controller
                name="estatura"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(15% - 10px)", margin: 5 }}
                    type="number"
                    variant="filled"
                    id="estatura"
                    {...field}
                    label="Estatura (cm)"
                    error={Boolean(errors.estatura)}
                  />
                )}
              />
              <Controller
                name="peso"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(15% - 10px)", margin: 5 }}
                    type="number"
                    variant="filled"
                    id="peso"
                    {...field}
                    label="Peso (kg)"
                    error={Boolean(errors.peso)}
                  />
                )}
              />
              <div style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}>
                <h5
                  style={{
                    position: "absolute",
                    margin: 0,
                    padding: 5,
                    paddingLeft: 85,
                  }}
                >
                  Género
                </h5>
                <Select
                  style={{ width: "100%" }}
                  id="gender"
                  variant="filled"
                  value={gender}
                  label="Género"
                  {...register("gender", { required: false })}
                  onChange={handleChangeGender}
                >
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Femenino">Femenino</MenuItem>
                </Select>
              </div>
              <Controller
                name="numCaso"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(33.33% - 10px)", margin: 5 }}
                    type="text"
                    variant="filled"
                    id="numCaso"
                    {...field}
                    label="Número de Caso/División"
                    error={Boolean(errors.numCaso)}
                  />
                )}
              />
              <Controller
                name="delito"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(33.33% - 10px)", margin: 5 }}
                    type="text"
                    variant="filled"
                    id="delito"
                    {...field}
                    label="Delito"
                    error={Boolean(errors.delito)}
                  />
                )}
              />
              <Controller
                name="particularSigns"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(33.33% - 10px)", margin: 5 }}
                    type="text"
                    variant="filled"
                    id="particularSigns"
                    {...field}
                    label="Señales Particulares/Comportamiento"
                  />
                )}
              />
              <>
                {/* 
            <input
              type="file"
              style={{ display: "none" }}
              multiple
              accept="image/*"
              id="identikits-upload-input"
              {...register("identikits", { required: false })}
              onChange={handleIdentikitsChange}
            />
            <label
              htmlFor="identikits-upload-input"
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
                variant="contained"
                startIcon={<DrawIcon />}
              >
                {selectedIdentikits.length > 0
                  ? `(${selectedIdentikits.length} Dibujos seleccionados)`
                  : "Subir Dibujos"}
              </Button>
            </label>
            */}
              </>
              <div style={{ flex: "0 0 calc(20% - 10px)", margin: 5 }}>
                <h5
                  style={{
                    position: "absolute",
                    margin: 0,
                    padding: 5,
                    paddingLeft: 40,
                  }}
                >
                  Fecha de nacimiento
                </h5>
                <Controller
                  name="birthday"
                  control={control}
                  rules={{ required: "Este campo es obligatorio" }}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      style={{ width: "100%" }}
                      type="date"
                      variant="filled"
                      id="birthday"
                      {...field}
                      error={Boolean(errors.birthday)}
                    />
                  )}
                />
              </div>
              <Controller
                name="nationality"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(15% - 10px)", margin: 5 }}
                    type="text"
                    variant="filled"
                    id="nationality"
                    {...field}
                    label="Nacionalidad"
                    error={Boolean(errors.nationality)}
                  />
                )}
              />
              <TextField
                style={{ flex: "0 0 calc(15% - 10px)", margin: 5 }}
                type="number"
                id="phone"
                variant="filled"
                label="Celular/Teléfono"
                {...register("phone", { required: false })}
              />
              <Controller
                name="autoridad"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                    type="text"
                    variant="filled"
                    id="autoridad"
                    {...field}
                    label="Autoridad"
                    error={Boolean(errors.autoridad)}
                  />
                )}
              />
              <Controller
                name="funcionario"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                    type="text"
                    variant="filled"
                    id="funcionario"
                    {...field}
                    label="Funcionario"
                    error={Boolean(errors.funcionario)}
                  />
                )}
              />
            </div>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flex: "0 0 calc(33.33% - 10px)",
              }}
            >
              <Controller
                name="dangerousness"
                control={control}
                defaultValue={dng}
                render={({ field }) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Rating
                      style={{ color: "#064887", fontSize: 40 }}
                      value={dng}
                      precision={0.5}
                      getLabelText={getLabelText}
                      onChange={(event, newValue) => {
                        setDng(newValue);
                        field.onChange(newValue);
                      }}
                      onChangeActive={(event, newHover) => {
                        setHover(newHover);
                      }}
                      emptyIcon={
                        <StarIcon
                          style={{ opacity: 0.55 }}
                          fontSize="inherit"
                        />
                      }
                    />
                    {dng !== null && (
                      <Box sx={{ ml: 2 }}>
                        {labels[hover !== -1 ? hover : dng]}
                      </Box>
                    )}
                  </div>
                )}
              />
            </Box>
            {/* IA */}
            <div
              style={{
                flex: "0 0 calc(65% - 10px)",
                margin: 15,
                display: "flex",
                justifyContent: "space-around",
                backgroundColor: "#D9E0F1",
                borderRadius: 50,
                padding: 15,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  padding: 10,
                }}
              >
                <Tooltip title="Campos relacionados a Inteligencia Artificial">
                  <Avatar
                    sx={{
                      outline: "5px solid #064887",
                      bgcolor: "white",
                      color: "#064887",
                      fontWeight: "bolder",
                    }}
                  >
                    IA
                  </Avatar>
                </Tooltip>
              </div>
              <div
                style={{
                  width: 400,
                  margin: 5,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Controller
                  name="specialty" // Nombre del campo en el formulario
                  control={control}
                  defaultValue={personName}
                  render={({ field }) => (
                    <div>
                      <Select
                        style={{ width: "100%" }}
                        multiple
                        value={personName}
                        onChange={(event) => {
                          setPersonName(event.target.value as string[]);
                          field.onChange(event.target.value); // Actualiza el valor del controlador
                        }}
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) =>
                          (selected as string[]).join(", ")
                        }
                      >
                        {names.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox checked={personName.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  )}
                />
              </div>
              <Tooltip title="La Especialidad o Especialidades seleccionadas serán filtros de búsqueda para la Inteligencia Artificial por Reconocimiento Facial">
                <IconButton
                  sx={{
                    "&:hover": {
                      color: "#064887",
                      backgroundColor: "inherit",
                      outline: "none",
                    },
                  }}
                >
                  <HelpIcon></HelpIcon>
                </IconButton>
              </Tooltip>
              <div
                style={{
                  margin: 5,
                  width: 100,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <TextField
                  type="number"
                  id="relapse"
                  defaultValue={1}
                  inputProps={{ min: 1, max: 10 }}
                  {...register("relapse", { required: false })}
                />
              </div>
              <Tooltip title="El valor de la reincidencia afectará al entrenamiento de los Identikits Generativos generados por IA, cuanto mayor se el valor, más probabilidades hay de que el Identikit generado sea más parecido al Criminal">
                <IconButton
                  sx={{
                    "&:hover": {
                      color: "#064887",
                      backgroundColor: "inherit",
                      outline: "none",
                    },
                  }}
                >
                  <HelpIcon></HelpIcon>
                </IconButton>
              </Tooltip>
            </div>
            {/* Footer */}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                margin: 5,
              }}
            >
              <Typography
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignContent: "center",
                  color: "red",
                }}
              >
                <span
                  style={{
                    display: campos.some((campo) => errors[campo])
                      ? "flex"
                      : "none",
                  }}
                >
                  Campos obligatorios:
                </span>
                {errors.lastnameDad && (
                  <span style={{ marginLeft: "5px" }}>APELLIDO</span>
                )}
                {errors.departamento && (
                  <span style={{ marginLeft: "5px" }}>DEPARTAMENTO</span>
                )}
                {errors.provincia && (
                  <span style={{ marginLeft: "5px" }}>PROVINCIA</span>
                )}
                {errors.localidad && (
                  <span style={{ marginLeft: "5px" }}>LOCALIDAD</span>
                )}
                {errors.expedido && (
                  <span style={{ marginLeft: "5px" }}>EXPEDIDO</span>
                )}
                {errors.nivelAcademico && (
                  <span style={{ marginLeft: "5px" }}>NIVEL ACADÉMICO</span>
                )}
                {errors.ocupacion && (
                  <span style={{ marginLeft: "5px" }}>OCUPACIÓN</span>
                )}
                {errors.estadoCivil && (
                  <span style={{ marginLeft: "5px" }}>ESTADO CIVIL</span>
                )}
                {errors.colorPiel && (
                  <span style={{ marginLeft: "5px" }}>COLOR DE PIEL</span>
                )}
                {errors.colorPelo && (
                  <span style={{ marginLeft: "5px" }}>COLOR DE PELO</span>
                )}
                {errors.colorOjos && (
                  <span style={{ marginLeft: "5px" }}>COLOR DE OJOS</span>
                )}
                {errors.estatura && (
                  <span style={{ marginLeft: "5px" }}>ESTATURA</span>
                )}
                {errors.peso && <span style={{ marginLeft: "5px" }}>PESO</span>}
                {errors.delito && (
                  <span style={{ marginLeft: "5px" }}>DELITO</span>
                )}
                {errors.numCaso && (
                  <span style={{ marginLeft: "5px" }}>NÚMERO DE CASO</span>
                )}
                {errors.autoridad && (
                  <span style={{ marginLeft: "5px" }}>AUTORIDAD</span>
                )}
                {errors.funcionario && (
                  <span style={{ marginLeft: "5px" }}>FUNCIONARIO</span>
                )}
                {errors.name && (
                  <span style={{ marginLeft: "5px" }}>NOMBRE</span>
                )}
                {errors.ci && (
                  <span style={{ marginLeft: "5px" }}>CARNET DE IDENTIDAD</span>
                )}
                {errors.address && (
                  <span style={{ marginLeft: "5px" }}>DOMICILIO</span>
                )}
                {errors.description && (
                  <span style={{ marginLeft: "5px" }}>DESCRIPCIÓN</span>
                )}
                {errors.birthday && (
                  <span style={{ marginLeft: "5px" }}>FECHA DE NACIMIENTO</span>
                )}
                {errors.nationality && (
                  <span style={{ marginLeft: "5px" }}>NACIONALIDAD</span>
                )}
              </Typography>
              <div
                style={{
                  flex: "0 0 calc(25% - 10px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Button
                  autoFocus
                  type="submit"
                  onClick={verifyImage}
                  size="large"
                  sx={{
                    backgroundColor: "#0a934e",
                    color: "white",
                    width: "100%",
                    height: "100%",
                    "&:hover": {
                      color: "#0a934e",
                      backgroundColor: "white",
                      outline: "2px solid #0a934e",
                    },
                  }}
                >
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

export default NewCriminalDialog;
