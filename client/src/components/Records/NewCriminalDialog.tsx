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

const names = ["Lancero", "Monrrero", "Jalador", "Plumero", "Autoridad"];

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
  const [value1, setValue1] = React.useState<number | null>(2);
  const [dataCriminal, setDataCriminal] = useState();
  const [img, setImg] = useState("");
  const [hover, setHover] = React.useState(-1);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [errorImage, setErrorImage] = useState(false);
  const params = useParams();
  const [gender, setGender] = useState("Masculino");
  const [status, setStatus] = useState("Arrestado");
  const [personName, setPersonName] = React.useState<string[]>([]);

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    // 18
    if (selectedImage) {
      formData.append("mainPhoto", selectedImage);
    }
    formData.append("lastname", data.lastname);
    formData.append("name", data.name);
    formData.append("birthday", data.birthday);
    formData.append("alias", data.alias);
    formData.append("ci", data.ci);
    formData.append("description", data.description);
    formData.append("criminalRecord", data.criminalRecord);
    formData.append("phone", data.phone);
    formData.append("address", data.address);
    formData.append("gender", data.gender);
    formData.append("nationality", data.nationality);
    formData.append("criminalOrganization", data.criminalOrganization);
    formData.append("dangerousness", data.dangerousness);
    formData.append("relapse", data.relapse);
    formData.append("particularSigns", data.particularSigns);
    formData.append("specialty", data.specialty);
    formData.append("status", data.status);
    /* if (selectedImages) {
      formData.append("photos", selectedImages);
    } */
    if (!params.id) {
      uploadCriminal(formData);
    } else {
      updateCriminal(params.id, formData);
    }
    window.location.reload();
  });

  const localPersonName = async () => {
    if (params.id) {
      const { data } = await getCriminal(params.id as string);
      return data.specialty;
    } else return ["Lancero"];
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
        setDataCriminal(data);
        setValue("lastname", data.lastname);
        setValue("name", data.name);
        setValue("birthday", data.birthday);
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
        setValue("status", data.status);
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
          const resultArray = data.specialty.flatMap((item: string) => item.split(","));
          return resultArray;
        } else {
          return ["Lancero"];
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        return ["Lancero"];
      }
    };

    localPersonName().then((result) => setPersonName(result));
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
  const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newImages = Array.from(event.target.files); // Convert FileList to array
      setSelectedImages([...selectedImages, ...newImages]); // Append new images
    }
  };

  const handleChangeGender = (event: SelectChangeEvent) => {
    setGender(event.target.value as string);
  };
  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };
  const campos = [
    "lastname",
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
            <Controller
              name="lastname"
              control={control}
              rules={{ required: "Este campo es obligatorio" }}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  style={{ flex: "0 0 calc(33.33% - 10px)", margin: 5 }}
                  type="text"
                  variant="filled"
                  id="lastname"
                  {...field}
                  label="Apellidos"
                  error={Boolean(errors.lastname)}
                />
              )}
            />
            <Controller
              name="name"
              control={control}
              rules={{ required: "Este campo es obligatorio" }}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  style={{ flex: "0 0 calc(33.33% - 10px)", margin: 5 }}
                  type="text"
                  variant="filled"
                  id="name"
                  {...field}
                  label="Nombre"
                  error={Boolean(errors.name)}
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
                  style={{ flex: "0 0 calc(33.33% - 10px)", margin: 5 }}
                  type="text"
                  variant="filled"
                  id="address"
                  {...field}
                  label="Domicilio"
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
            <TextField
              style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
              type="text"
              label="Alias"
              variant="filled"
              {...register("alias", { required: false })}
            />
            <Controller
              name="ci"
              control={control}
              rules={{ required: "Este campo es obligatorio" }}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
                  type="text"
                  variant="filled"
                  id="ci"
                  {...field}
                  label="Carnet de Identidad"
                  error={Boolean(errors.ci)}
                />
              )}
            />
            <TextField
              style={{ flex: "0 0 calc(25% - 10px)", margin: 5 }}
              type="text"
              variant="filled"
              label="Antecedentes"
              {...register("criminalRecord", { required: false })}
            />
            <Controller
              name="description"
              control={control}
              rules={{ required: "Este campo es obligatorio" }}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  style={{ flex: "0 0 calc(75% - 10px)", margin: 5 }}
                  type="text"
                  variant="filled"
                  id="description"
                  {...field}
                  label="Descripción"
                  error={Boolean(errors.description)}
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
                variant="contained"
                startIcon={<SwitchAccountIcon />}
              >
                Subir Fotos
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
                  variant="filled"
                  id="particularSigns"
                  {...field}
                  label="Señales Particulares"
                />
              )}
            />

            <Button
              style={{ flex: "0 0 calc(25% - 10px)", margin: 5, height: "10%" }}
              component="label"
              variant="contained"
              startIcon={<DrawIcon />}
            >
              Subir Dibujos
            </Button>
            <div style={{ flex: "0 0 calc(20% - 10px)", margin: 5 }}>
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
                  style={{ flex: "0 0 calc(20% - 10px)", margin: 5 }}
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
              style={{ flex: "0 0 calc(20% - 10px)", margin: 5 }}
              type="number"
              id="phone"
              variant="filled"
              label="Celular/Teléfono"
              {...register("phone", { required: false })}
            />

            <TextField
              style={{ flex: "0 0 calc(20% - 10px)", margin: 5 }}
              type="text"
              variant="filled"
              id="criminalOrganization"
              label="Organización Criminal"
              {...register("criminalOrganization", { required: false })}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flex: "0 0 calc(33.33% - 10px)",
              }}
            >
              <h5
                style={{
                  position: "absolute",
                  paddingBottom: 100,
                  paddingLeft: 140,
                }}
              >
                Peligrosidad
              </h5>
              <Controller
                name="dangerousness"
                control={control}
                defaultValue={2}
                render={({ field }) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Rating
                      style={{ color: "#064887", fontSize: 40 }}
                      value={value1}
                      precision={0.5}
                      getLabelText={getLabelText}
                      onChange={(event, newValue) => {
                        setValue1(newValue);
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
                    {value1 !== null && (
                      <Box sx={{ ml: 2 }}>
                        {labels[hover !== -1 ? hover : value1]}
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
                <h5
                  style={{
                    position: "absolute",
                    paddingLeft: 150,
                    margin: 0,
                    paddingBottom: 90,
                  }}
                >
                  Especialidad
                </h5>
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
                <h5
                  style={{
                    position: "absolute",
                    paddingLeft: 10,
                    margin: 0,
                    paddingBottom: 90,
                  }}
                >
                  Reincidencia
                </h5>
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
                {errors.lastname && (
                  <span style={{ marginLeft: "5px" }}>APELLIDOS</span>
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
                  onClick={!params.id ? verifyImage : onSubmit}
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
