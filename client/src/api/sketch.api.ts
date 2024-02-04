import axios from 'axios';

const sketchApi = axios.create({
    baseURL: "http://localhost:8000/sketches/api/v1/sketches/"
});

export const uploadSketch = (sketch) => sketchApi.post('/', sketch);
