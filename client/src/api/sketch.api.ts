import axios, { AxiosResponse } from "axios";

// Define una interfaz que represente la estructura esperada del objeto sketch
interface Sketch {
  description: string;
  image: File;
  canvas: boolean;
}

// Crea una instancia de axios
const sketchApi = axios.create({
  baseURL: "http://localhost:8000/sketches/api/v1/sketches/",
});

// Define el tipo de la respuesta que se espera (AxiosResponse<Sketch>)
export const uploadSketch = (
  sketch: Sketch
): Promise<AxiosResponse<Sketch>> => {
  return sketchApi.post("/", sketch);
};

export const getLatestSketch = () => {
  return sketchApi.get("/", {
    params: {
      _sort: "id",
      _order: "desc",
      _limit: 1,
    },
  });
};

export const getSketchs = (id: number) => {
  return axios.get(`http://localhost:8000/sketches/api/v1/sketches/${id}/get_generated_image/`);
};
