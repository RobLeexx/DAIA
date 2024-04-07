import * as React from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import PolicyIcon from "@mui/icons-material/Policy";
import HomeIcon from "@mui/icons-material/Home";
import SourceIcon from "@mui/icons-material/Source";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PortraitIcon from "@mui/icons-material/Portrait";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ContactsIcon from "@mui/icons-material/Contacts";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import Groups3Icon from "@mui/icons-material/Groups3";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const drawerWidth = 300;

interface NavigationProps {
  children?: React.ReactNode;
}

export const Navigation: React.FC<NavigationProps> = ({ children }) => {
  const [open, setOpen] = React.useState(true);
  const [open2, setOpen2] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClick2 = () => {
    setOpen2(!open2);
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#F0F1F4" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#064887",
        }}
      >
        <Toolbar>
          <div
            style={{
              flexGrow: 2,
              display: "flex",
              justifyContent: "start",
              paddingLeft: 80,
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <PolicyIcon></PolicyIcon>
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                DACI
              </Typography>
            </div>
          </div>
          <AccountCircleIcon />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <Link
              to="/inicio"
              style={{
                textDecoration: "none",
                cursor: "default",
                color: "black",
              }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon>
                  <HomeIcon></HomeIcon>
                </ListItemIcon>
                <ListItemText primary={"Inicio"} />
              </ListItemButton>
            </Link>
            <ListItemButton
              onClick={handleClick2}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon>
                <SourceIcon></SourceIcon>
              </ListItemIcon>
              <ListItemText primary={"Registros"} />
              {open2 ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse
              in={open2}
              timeout="auto"
              unmountOnExit
              sx={{ opacity: open2 ? 1 : 0, display: open2 ? 1 : "none" }}
            >
              <List component="div" disablePadding>
                <Link
                  to={"/identikits"}
                  style={{
                    textDecoration: "none",
                    cursor: "default",
                    color: "black",
                  }}
                >
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <ContactsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Identikits" />
                  </ListItemButton>
                </Link>
                <Link
                  to={"/criminales"}
                  style={{
                    textDecoration: "none",
                    cursor: "default",
                    color: "black",
                  }}
                >
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <SwitchAccountIcon />
                    </ListItemIcon>
                    <ListItemText primary="Criminales" />
                  </ListItemButton>
                </Link>
              </List>
            </Collapse>
            <ListItemButton
              onClick={handleClick}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon>
                <SensorOccupiedIcon />
              </ListItemIcon>
              <ListItemText primary={"IA"} />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse
              in={open}
              timeout="auto"
              unmountOnExit
              sx={{ opacity: open ? 1 : 0, display: open ? 1 : "none" }}
            >
              <List component="div" disablePadding>
                <Link
                  to={"/sketch"}
                  style={{
                    textDecoration: "none",
                    cursor: "default",
                    color: "black",
                  }}
                >
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <PortraitIcon />
                    </ListItemIcon>
                    <ListItemText primary="Identikit Generativo" />
                  </ListItemButton>
                </Link>
                <Link
                  to={"/busqueda"}
                  style={{
                    textDecoration: "none",
                    cursor: "default",
                    color: "black",
                  }}
                >
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <PersonSearchIcon />
                    </ListItemIcon>
                    <ListItemText primary="Reconocimiento Facial" />
                  </ListItemButton>
                </Link>
                <Link
                  to={"/modelos"}
                  style={{
                    textDecoration: "none",
                    cursor: "default",
                    color: "black",
                  }}
                >
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <Groups3Icon />
                    </ListItemIcon>
                    <ListItemText primary="Modelos" />
                  </ListItemButton>
                </Link>
              </List>
            </Collapse>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};
