import React, { useLayoutEffect } from "react";
import Header from "../../../components/Headers/Header";
import { Container, Card, Row, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Col} from "reactstrap";
import { Button, Chip, Divider, ListItemButton, Tooltip } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import DataTable,  { defaultThemes }from 'react-data-table-component';
import './TareasComponent.css'
// import DangerousIcon from '@mui/icons-material/Dangerous';
import ReportIcon from '@mui/icons-material/Report';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useState } from "react";
import moment from "moment";
import { getMisTareasPersonales, getUserId, postCrearNuevaTareaUsuario } from "../../../Controller/Controller";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import MisTareasComponent from "./MisTareasComponent/MisTareasComponent";

const TareasComponent = () =>{

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return(
    <>
    <Header></Header>
    <Container className="mt-3" fluid >
      <Card style={{margin:'0'}} >
        <CardBody>
          <TabContext value={value}>
            <Box display="flex" justifyContent="center" width="100%">
              <TabList variant="scrollable" scrollButtons onChange={handleChange} aria-label="TabListGestionCaso" allowScrollButtonsMobile>
                <Tab label="Tareas Asignadas" value="1" />
                <Tab label="Tareas Compartidas" value="2" />
                <Tab label="Mis Tareas" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <MisTareasComponent></MisTareasComponent>
            </TabPanel>
            <TabPanel value="2">Item Two</TabPanel>
            <TabPanel value="3">Item Three</TabPanel>
          </TabContext>
        </CardBody>
        
      </Card>
    </Container>
    </> 
  )
}

export default TareasComponent;