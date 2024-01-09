import React,{ useLayoutEffect } from "react";
import { useState } from "react";
import ReportIcon from '@mui/icons-material/Report';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { Link } from "react-router-dom/cjs/react-router-dom";
import DataTable,  { defaultThemes }from 'react-data-table-component';
import AvatarGroup from '@mui/material/AvatarGroup';
import { Button, Tooltip } from "@mui/material";
import {Row, FormGroup, Col} from "reactstrap";
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import {getTareasPersonalesUsuarios, getUserId} from "../../../../Controller/Controller";
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const CabeceraTablaTareas = ({setData, respaldoTareas, usuarioActivos}) => {

  const listaEstados=[
    {descripcion: "No Iniciado"},
    {descripcion: "En curso"},
    {descripcion: "Culminado"},
    {descripcion: "Detenido"}
  ]
  const listaPrioridad=[
    {descripcion: "Baja"},
    {descripcion: "Media"},
    {descripcion: "Alta"},
    {descripcion: "Critica"}
  ]
  
  const [filtroPorUsuario, setFiltroPorUsuario] = useState(null)
  const [filtroPorEstado, setFiltroPorEstado] = useState(null)
  const [filtroPorPrioridad, setFiltroPorPrioridad] = useState(null)

  const CargarTareasPorFiltroUsuarios = (usuarioCargado) => {
    const nuevaListaTareas = [...respaldoTareas]
    if(usuarioCargado === null || !usuarioCargado){
    setData(nuevaListaTareas)
    }else{
      const result = nuevaListaTareas.filter(tarea => tarea.usuarioEncargadoNombre?.toLowerCase().includes(usuarioCargado.nombreUsuario.toLowerCase()))
      setData(result)
    }
  }
  const CargarTareasPorFiltroEstado = (estadoCargado) => {
    const nuevaListaTareas = [...respaldoTareas]
    if(estadoCargado === null || !estadoCargado){
    setData(nuevaListaTareas)
    }else{
      const result = nuevaListaTareas.filter(tarea => tarea.estado?.toLowerCase().includes(estadoCargado.descripcion.toLowerCase()))
      setData(result)
    }
  }
  const CargarTareasPorFiltroPrioridad = (prioridadCargada) => {
    const nuevaListaTareas = [...respaldoTareas]
    if(prioridadCargada === null || !prioridadCargada){
    setData(nuevaListaTareas)
    }else{
      const result = nuevaListaTareas.filter(tarea => tarea.prioridad?.toLowerCase().includes(prioridadCargada.descripcion.toLowerCase()))
      setData(result)
    }
  }
    return(
      <>
      <div >
        <Row style={{alignContent:'center', alignItems:'center'}}>
          <Col xl={3} lg={6}>
            <div>Tareas</div>
          </Col>
          <Col xl={3} lg={6}>
            <FormGroup>
              <Autocomplete
                options={usuarioActivos}
                getOptionLabel={(option) => option.nombreUsuario}
                id="controlled-demo"
                value={filtroPorUsuario}
                onChange={(event, newValue) => {
                  setFiltroPorUsuario(newValue);
                  CargarTareasPorFiltroUsuarios(newValue);
                }}
                renderOption={(props, option) => (
                  <ListItem {...props} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={option.nombreUsuario} src={"Images/Users/"+option.imagenUsuario} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={option.nombreUsuario}
                      secondary={
                        <React.Fragment>
                          <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {option.correoUsuario}
                            </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Filtrar por usuario" variant="standard"/>
                )}
              />
            </FormGroup>
          </Col>
          <Col xl={3} lg={6}>
            <FormGroup>
              <Autocomplete
                options={listaEstados}
                getOptionLabel={(option) => option.descripcion}
                id="controlled-demo"
                value={filtroPorEstado}
                onChange={(event, newValue) => {
                  setFiltroPorEstado(newValue);
                  CargarTareasPorFiltroEstado(newValue)
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Filtrar por estado" variant="standard"/>
                )}
              />
            </FormGroup>
          </Col>
          <Col xl={3} lg={6}>
            <FormGroup>
              <Autocomplete
                options={listaPrioridad}
                getOptionLabel={(option) => option.descripcion}
                id="controlled-demo"
                value={filtroPorPrioridad}
                onChange={(event, newValue) => {
                  setFiltroPorPrioridad(newValue);
                  CargarTareasPorFiltroPrioridad(newValue)
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Filtrar por prioridad" variant="standard"/>
                )}
              />
            </FormGroup>
          </Col>
        </Row>
      </div>
      </>
    )
  }

export default CabeceraTablaTareas;