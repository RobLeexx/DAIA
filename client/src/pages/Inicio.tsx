import React, { useEffect, useState } from "react";
import { Navigation } from "../components/Navigation";
import { getAllCriminals } from "../api/sketch.api";
import {
  Box,
  Card,
  CardMedia,
  Typography,
  CardContent,
  CardActions,
  Button,
  Divider,
  Rating,
} from "@mui/material";

interface Criminal {
  id: number;
  lastname: string;
  name: string;
  alias?: string;
  mainPhoto: string;
  ci: string;
  birthday: Date;
  nationality: string;
  dangerousness: number;
  description: string;
  criminalRecord: string;
  createdAt: Date;
}

const CriminalCard: React.FC<Criminal> = ({
  id,
  alias,
  name,
  lastname,
  mainPhoto,
  dangerousness,
  criminalRecord,
}) => (
  <Card key={id} sx={{ height: 600, width: 500, backgroundColor: "#064887" }}>
    <CardMedia sx={{ height: 300 }} image={mainPhoto} />
    {!alias && <br />}
    <CardContent>
      <Typography
        gutterBottom
        variant="h5"
        component="div"
        fontWeight={"bolder"}
        textAlign={"center"}
        color={"white"}
        sx={{ textTransform: "uppercase", fontFamily: "Josefin Sans" }}
      >
        {lastname} <span> </span>
        {name}
      </Typography>
      {alias ? (
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          fontWeight={"bolder"}
          textAlign={"center"}
          color={"white"}
          sx={{ textTransform: "uppercase", fontFamily: "Josefin Sans" }}
        >
          "{alias}"
        </Typography>
      ) : (
        <br />
      )}
      <Divider style={{ borderColor: "white" }}></Divider>
      <div style={{ display: "flex", justifyContent: "center", padding: 5 }}>
        <Rating
          style={{ color: "white", fontSize: 60 }}
          value={dangerousness}
          precision={0.5}
          readOnly
        />
      </div>
      <Divider style={{ borderColor: "white" }}></Divider>
      <Typography variant="body2" color="white" paddingTop={2}>
        Buscado por: {criminalRecord}
      </Typography>
    </CardContent>
    <CardActions style={{ display: "flex", justifyContent: "center" }}>
      <Button
        variant="outlined"
        size="large"
        sx={{ color: "white", borderColor: "white" }}
      >
        Leer Más
      </Button>
    </CardActions>
  </Card>
);

export const Inicio: React.FC = () => {
  const [criminals, setCriminals] = useState<Criminal[] | undefined>(undefined);
  useEffect(() => {
    async function loadCriminals() {
      const res = await getAllCriminals();
      const withInternationalCapture = res.data.filter(
        (criminal: { status: string }) =>
          criminal.status === "Con Captura Internacional"
      );
      const sortedCriminals = withInternationalCapture.sort(
        (a: { dangerousness: number }, b: { dangerousness: number }) =>
          b.dangerousness - a.dangerousness
      );
      const topThreeCriminals = sortedCriminals.slice(0, 3);

      setCriminals(topThreeCriminals);
      console.log(criminals);
    }
    loadCriminals();
  }, []);

  return (
    <Navigation>
      <Box sx={{ marginTop: 2 }}>
        <div
          style={{
            backgroundColor: "#AB0707",
            textAlign: "center",
            color: "white",
            fontSize: 40,
            padding: 20,
            fontFamily: "Russo One",
          }}
        >
          CRIMINALES MÁS BUSCADOS
        </div>
        <div
          style={{
            backgroundColor: "#064887",
            textAlign: "center",
            color: "white",
            fontSize: 20,
            padding: 10,
            fontWeight: "bolder",
            fontFamily: "Josefin Sans",
          }}
        >
          A NIVEL INTERNACIONAL
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {criminals &&
            criminals.map((criminal) => (
              <CriminalCard key={criminal.id} {...criminal} />
            ))}
        </div>
        <div
          style={{
            backgroundColor: "#4C7100",
            textAlign: "center",
            color: "white",
            fontSize: 20,
            padding: 10,
            marginTop: 20,
            fontWeight: "bolder",
            fontFamily: "Josefin Sans",
          }}
        >
          A NIVEL NACIONAL
        </div>
      </Box>
    </Navigation>
  );
};
