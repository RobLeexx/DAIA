import React, { useState, ChangeEvent, useEffect } from "react";
import { Navigation } from "../Navigation";
import { Button, Input, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { format } from "date-fns";
import maleImage from "../../assets/male.jpg";
import { uploadCriminal, getCriminal } from "../../api/sketch.api";
import { useParams } from "react-router-dom";

export const CriminalCard: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [dataCriminal, setDataCriminal] = useState();
  const [img, setImg] = useState();
  const params = useParams();

  const fetchImage = async () => {
    try {
      const { data } = await getCriminal(params.id);
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
      const { data } = await getCriminal(params.id);
      setDataCriminal(data);
      setValue("lastname", data.lastname);
      setValue("name", data.name);
      setValue("birthday", data.birthday);
      setValue("alias", data.alias);
      setValue("description", data.description);
      setValue("criminal_record", data.criminal_record);
      setValue("ci", data.ci);
      setValue("case", data.case);
      fetchImage();
    }
    loadCriminal();
  }, [params.id, setValue]);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
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
    formData.append("birthday", data.birthday);
    formData.append("alias", data.alias);
    formData.append("ci", data.ci);
    formData.append("description", data.description);
    formData.append("criminal_record", data.criminal_record);
    formData.append("case", data.case);
    console.log(data);
    uploadCriminal(formData);
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
    <Navigation>
      <form onSubmit={onSubmit} style={{ padding: 50, display: "flex" }}>
        <div style={{ flex: "0 0 calc(40% - 10px)", padding: 20, height: 500 }}>
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
              src={img}
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
            variant="outlined"
            {...register("lastname", { required: true })}
          />
          {errors.lastname && <span>es requerido</span>}
          <TextField
            style={{ flex: "0 0 calc(33.33% - 10px)", margin: 5 }}
            type="text"
            variant="outlined"
            {...register("name", { required: true })}
          />
          {errors.name && <span>es requerido</span>}
          <TextField
            style={{ flex: "0 0 calc(33.33% - 10px)", margin: 5 }}
            type="text"
            variant="outlined"
            {...register("alias", { required: false })}
          />
          <TextField
            style={{ flex: "0 0 calc(33.33% - 10px)", margin: 5 }}
            type="text"
            variant="outlined"
            {...register("case", { required: false })}
          />
          <TextField
            style={{ flex: "0 0 calc(33.33% - 10px)", margin: 5 }}
            type="text"
            variant="outlined"
            {...register("ci", { required: true })}
          />
          {errors.ci && <span>es requerido</span>}
          <TextField
            style={{ flex: "0 0 calc(33.33% - 10px)", margin: 5 }}
            type="text"
            variant="outlined"
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
              variant="outlined"
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
    </Navigation>
  );
};
