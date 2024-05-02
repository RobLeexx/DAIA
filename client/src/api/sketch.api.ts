import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { Sketch } from "../pages/Sketch";
import _ from "lodash";

// Define una interfaz que represente la estructura esperada del objeto sketch
interface Sketch {
  description: string;
  input: File;
  output?: File;
  canvas: boolean;
}

interface Image {
  input: File;
  database?: string;
  results?: JSON;
  description: string;
}

interface Model {
  type: string;
  name: string;
  length: number;
  data: { id: number; img: string }[];
  description: string;
}

// Crea una instancia de axios
const sketchApi = axios.create({
  baseURL: "http://localhost:8000/sketches/api/v1/sketches/",
});

const imageApi = axios.create({
  baseURL: "http://localhost:8000/images/api/v1/images/",
});

const criminalApi = axios.create({
  baseURL: "http://localhost:8000/criminal/api/v1/criminal/",
});

const modelApi = axios.create({
  baseURL: "http://localhost:8000/modelos/api/v1/modelos/",
});

// Define el tipo de la respuesta que se espera (AxiosResponse<Sketch>)
export const uploadSketch = (
  sketch: Sketch
): Promise<AxiosResponse<Sketch>> => {
  return sketchApi.post("/", sketch);
};

export const uploadImage = (image: Image): Promise<AxiosResponse<Image>> => {
  return imageApi.post("/", image);
};

export const uploadModel = (model: Model): Promise<AxiosResponse<Model>> => {
  return modelApi.post("/", model);
};

export const updateSketch = (
  sketchId: number,
  description: string,
  input: File
): Promise<AxiosResponse<Sketch>> => {
  const patchConfig: AxiosRequestConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const updatedData = {
    description: description,
    input: input,
  };
  return sketchApi.patch(`/${sketchId}/`, updatedData, patchConfig);
};

export const getAllSketches = () => {
  return sketchApi.get("/");
};

export const getAllImages = () => {
  return imageApi.get("/");
};

export const getAllCriminals = () => {
  return criminalApi.get("/");
};

export const getAllModels = () => {
  return modelApi.get("/");
};

export const getCriminal = (id: string) => {
  return criminalApi.get(`/${id}/`);
};

export const getSketch = (id: string) => {
  return sketchApi.get(`/${id}/`);
};

export const uploadCriminal = (criminal: FormData) => {
  return criminalApi.post("/", criminal);
};

export const updateCriminal = (id: string, criminal: FormData) => {
  return criminalApi.put(`/${id}/`, criminal);
};

export const getGAN = (
  id: number,
  config?: AxiosRequestConfig,
  model?: string
) => {
  return axios.get(
    `http://localhost:8000/sketches/api/v1/sketches/${id}/get_generated_image/?model=${model}`,
    config
  );
};

export const getOF = (id: number, name: string) => {
  return axios.get(
    `http://localhost:8000/images/api/v1/images/${id}/get_recognition_wheel/?name=${name}`
  );
};

export const getOF2 = (id: number, name: string) => {
  return axios.get(
    `http://localhost:8000/criminal/api/v1/criminal/${id}/get_recognition_wheel2/?name=${name}`
  );
};

export const getOF3 = (id: number, name: string) => {
  return axios.get(
    `http://localhost:8000/sketches/api/v1/sketches/${id}/get_recognition_wheel3/?name=${name}`
  );
};
