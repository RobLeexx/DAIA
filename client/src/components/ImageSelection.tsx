import React from 'react';
import { Avatar, Button, Box } from '@mui/material';
import SketchDialog from './SketchDialog';
import PhotoDialog from './PhotoDialog';
import UploadDialog from './UploadDialog';

const sketchType = ["Dibujar Identikit", "Subir Foto"];

interface ImageSelectionProps {
  selectedValue: string;
  canvaImage: string;
  photoImage: string;
  open: boolean;
  open2: boolean;
  open3: boolean;
  handleClose: (value: string) => void;
  handleClose2: (value: string) => void;
  handleClose3: () => void;
  handleClickOpen: () => void;
  handleClickOpen2: () => void;
  handleClickOpen3: () => void;
  handleComplete: () => void;
  handlePhoto: () => void;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
}

const ImageSelection: React.FC<ImageSelectionProps> = ({
  selectedValue,
  canvaImage,
  photoImage,
  open,
  open2,
  open3,
  handleClose,
  handleClose2,
  handleClose3,
  handleClickOpen,
  handleClickOpen2,
  handleClickOpen3,
  handleComplete,
  handlePhoto,
  setSelectedImage,
}) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          paddingTop: 50,
        }}
      >
        {selectedValue === "Dibujar Identikit" ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Avatar
              style={{
                position: "absolute",
                margin: 15,
                backgroundColor: "#0a934e",
              }}
            >
              A
            </Avatar>
            <img
              style={{ maxWidth: 500, height: 500 }}
              src={canvaImage}
              alt=""
            />
            <Button
              variant="contained"
              onClick={handleClickOpen}
              style={{ backgroundColor: "#0a934e" }}
            >
              Dibujar Identikit
            </Button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Avatar
              style={{
                position: "absolute",
                margin: 15,
                backgroundColor: "#0a934e",
              }}
            >
              A
            </Avatar>
            <img
              style={{ maxWidth: 500, height: 500, opacity: "50%" }}
              src={canvaImage}
              alt=""
            />
            <Button
              variant="outlined"
              onClick={handleClickOpen}
              style={{ color: "#0a934e" }}
            >
              Dibujar Identikit
            </Button>
          </div>
        )}

        {selectedValue === "Subir Foto" ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Avatar
              style={{
                position: "absolute",
                margin: 15,
                backgroundColor: "#0a934e",
              }}
            >
              B
            </Avatar>
            <img
              style={{ maxWidth: 500, maxHeight: 500 }}
              src={photoImage}
              alt=""
            />
            <Button
              variant="contained"
              onClick={handleClickOpen2}
              style={{ backgroundColor: "#0a934e" }}
            >
              Subir Fotografía
            </Button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Avatar
              style={{
                position: "absolute",
                margin: 15,
                backgroundColor: "#0a934e",
              }}
            >
              B
            </Avatar>
            <img
              style={{
                maxWidth: 500,
                maxHeight: 500,
                opacity: "50%",
              }}
              src={photoImage}
              alt=""
            />
            <Button
              variant="outlined"
              onClick={handleClickOpen2}
              style={{ color: "#0a934e" }}
            >
              Subir Fotografía
            </Button>
          </div>
        )}

        <SketchDialog
          selectedValue={selectedValue}
          open={open}
          onClose={handleClose}
        />

        <PhotoDialog
          selectedValue={selectedValue}
          open={open2}
          onClose={handleClose2}
        />

        <UploadDialog
          selectedValue={selectedValue}
          open={open3}
          onClose={handleClose3}
          handlePhoto={handlePhoto}
          setSelectedImage={setSelectedImage}
        />
      </div>
      <Box sx={{ display: "flex", justifyContent: "end", pt: 2 }}>
        {selectedValue === sketchType[0] ? (
          <Button variant="contained" onClick={handleComplete}>
            Siguiente
          </Button>
        ) : (
          <Button variant="contained" onClick={handleClickOpen3}>
            Siguiente
          </Button>
        )}
      </Box>
    </div>
  );
};

export default ImageSelection;
