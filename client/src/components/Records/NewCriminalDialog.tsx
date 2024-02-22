import React, { useState, ChangeEvent } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";
import { useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { format } from "date-fns";
import maleImage from "../../assets/male.jpg";
import { uploadCriminal } from "../../api/sketch.api";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface NewCriminalDialogProps {
  open: boolean;
  onClose: () => void;
}

const NewCriminalDialog: React.FC<NewCriminalDialogProps> = (props) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const { onClose, open } = props;
  const handleClose = () => {
    onClose();
  };
  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    if (selectedImage) {
      formData.append("mainPhoto", selectedImage);
    }
    formData.append("lastname", data.lastname);
    formData.append("name", data.name);
    if (startDate) {
      const formattedDate = format(startDate, "yyyy-MM-dd");
      setValue("birthday", formattedDate);
    }
    formData.append("alias", data.alias);
    formData.append("ci", data.ci);
    formData.append("description", data.description);
    formData.append("criminal_record", data.criminal_record);
    formData.append("case", data.case);
    uploadCriminal(formData);
    console.log(data);
  });
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedImage(file);
    }
  };
  const [startDate, setStartDate] = useState<Date | null>(null);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  registerLocale("es", es);
  const minDate = new Date(1930, 0, 1);
  const maxDate = new Date(2015, 11, 31);
  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              aria-label="close"
              edge="start"
              onClick={handleClose}
              sx={{
                color: "red",
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "red",
                  color: "white",
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
              Crear nuevo registro
            </Typography>
          </Toolbar>
        </AppBar>
        <form onSubmit={onSubmit} style={{ padding: 50, display: "flex" }}>
          <div
            style={{ flex: "0 0 calc(40% - 10px)", padding: 20, height: 500 }}
          >
            <Input
              type="file"
              style={{ display: "none" }}
              id="image-upload-input"
              {...register("mainPhoto", { required: true })}
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
              <img
                src={
                  selectedImage ? URL.createObjectURL(selectedImage) : maleImage
                }
                alt="Seleccionada"
                style={{
                  maxWidth: 650,
                }}
              />
            </label>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            ></div>
          </div>
          {errors.description && <span>es requerido</span>}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              flex: "0 0 calc(60% - 10px)",
            }}
          >
            <TextField
              style={{ flex: "0 0 calc(33.33% - 10px)", margin: 5 }}
              type="text"
              variant="filled"
              label="Apellidos"
              {...register("lastname", { required: true })}
            />
            {errors.lastname && <span>es requerido</span>}
            <TextField
              style={{ flex: "0 0 calc(33.33% - 10px)", margin: 5 }}
              type="text"
              label="Nombres"
              variant="filled"
              {...register("name", { required: true })}
            />
            {errors.name && <span>es requerido</span>}
            <TextField
              style={{ flex: "0 0 calc(33.33% - 10px)", margin: 5 }}
              type="text"
              label="Alias"
              variant="filled"
              {...register("alias", { required: false })}
            />
            <TextField
              style={{ flex: "0 0 calc(33.33% - 10px)", margin: 5 }}
              type="text"
              label="Casos"
              variant="filled"
              {...register("case", { required: false })}
            />
            <TextField
              style={{ flex: "0 0 calc(33.33% - 10px)", margin: 5 }}
              type="text"
              variant="filled"
              label="Carnet de Identidad"
              {...register("ci", { required: true })}
            />
            {errors.ci && <span>es requerido</span>}
            <TextField
              style={{ flex: "0 0 calc(33.33% - 10px)", margin: 5 }}
              type="text"
              variant="filled"
              label="Antecedentes"
              {...register("criminal_record", { required: false })}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div>
                <DatePicker
                  showIcon
                  minDate={minDate}
                  maxDate={maxDate}
                  showYearDropdown
                  scrollableYearDropdown
                  selected={startDate}
                  locale="es"
                  placeholderText="Fecha de nacimiento"
                  onChange={(date) => {
                    setStartDate(date);
                    setValue("birthday", date); // Actualizar el valor del campo birthday en el estado del formulario
                  }}
                />
              </div>
              <TextField
                sx={{ width: "100%", marginLeft: 3 }}
                type="text"
                variant="filled"
                label="Descripción"
                {...register("description", { required: true })}
              ></TextField>
            </div>
          </div>
          <Button
            autoFocus
            type="submit"
            onClick={onSubmit}
            size="large"
            sx={{
              color: "#0a934e",
              backgroundColor: "white",
              "&:hover": {
                backgroundColor: "#0a934e",
                color: "white",
              },
            }}
          >
            Guardar
          </Button>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

export default NewCriminalDialog;
