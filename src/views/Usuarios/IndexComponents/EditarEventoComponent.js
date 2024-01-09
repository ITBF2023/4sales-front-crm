import React, { useLayoutEffect, useRef, useState } from 'react';
// reactstrap components
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";


import moment from 'moment';
import '../../index.css'
import 'moment/locale/es';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

import Avatar from '@mui/material/Avatar';

import { Chip, FormControl, Icon, IconButton, ListItemIcon, TextareaAutosize } from '@mui/material';
import { getUserId, getUsuariosInvitarEvento, updateEventoCalendario } from '../../../Controller/Controller.js';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TitleRoundedIcon from '@mui/icons-material/TitleRounded';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import TextField from '@mui/material/TextField';

import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VideoCameraFrontOutlinedIcon from '@mui/icons-material/VideoCameraFrontOutlined';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';
import LinkIcon from '@mui/icons-material/Link';

const EditarEventoComponent = ({eventoRecibido , abrirModal,setAbrirModalCrearEvento,RecargarEventos, mesMostrar}) => {

//   const [fechaCrearNuevoEventoMostrar, setFechaCrearNuevoEventoMostrar] = useState("");

  // Crear Nuevo Evento *******************************************************************************
  // const [modalCrearEvento, setModalCrearEvento] =  useState(false);
  const [fechaMinimaDateFin, setFechaMinimaDateFin] = useState(moment(Date.now()).format("YYYY-MM-DD"));
  const [fechaInicioEvento, setFechaInicioEvento] = useState(moment(Date.now()).format("YYYY-MM-DD"));
  const [fechaFinEvento, setFechaFinEvento] = useState(moment(Date.now()).format("YYYY-MM-DD"));
  const [horaMinimaTimeFin, setHoraMinimaTimeFin] = useState("08:00");
  const [horaInicioEvento, setHoraInicioEvento] = useState("08:00");
  const [horaFinEvento, setHoraFinEvento] = useState("08:30");
  const [eventoConReunion, setEventoConReunion] = useState(false);
  const [plataformaEventoSeleccionada, setPlataformaEventoSeleccionada] = useState("de Microsoft Teams")

  const [tituloEvento, setTituloEvento] = useState("")
  const [descripcionEvento, setDescripcionEvento] = useState("")
  const [enlaceEventoConReunion, setEnlaceEventoConReunion] = useState("")

  const AbrirModalCrearNuevoEvento = () => {
    setAbrirModalCrearEvento(!abrirModal)
    setUsuariosInvitados([])
    setUsuariosParaInvitar(usuariosParaInvitarRespaldo)
    setAnchorElListaUsuarios(null);
  }

  const CambiarFechaInicioEvento = (fechaInicioRecibida) => {
    setFechaMinimaDateFin(fechaInicioRecibida)
    setFechaInicioEvento(fechaInicioRecibida)
  }

  const CambiarHoraInicioEvento = (recibido) => {
    setHoraInicioEvento(recibido)

    var fecha = new Date ("2023-01-01T"+recibido)
    fecha = moment(fecha).add(10, 'm').toDate()
    setHoraMinimaTimeFin(moment(fecha).format("HH:mm"))
    fecha = moment(fecha).add(20, 'm').toDate()
    setHoraFinEvento(moment(fecha).format("HH:mm"))

  }

  const CargarDatosEditarEvento = async(e) => {
    e.preventDefault();
    const FechaInicioEnviar = fechaInicioEvento+"T"+horaInicioEvento+":00";
    const FechaFinEnviar = fechaFinEvento+"T"+horaFinEvento+":00";

    var datos = {
      Titulo:tituloEvento,
      Descripcion:descripcionEvento,
      FechaInicio:FechaInicioEnviar,
      FechaFin:FechaFinEnviar,
      UsuarioId:getUserId(),
      UsuariosInvitado: usuariosInvitados,
      EventoConReunion: eventoConReunion,
    }

    if(eventoConReunion){
      datos = {...datos,EnlaceEvento:enlaceEventoConReunion}
      datos = {...datos,TipoEvento:"Reunion "+plataformaEventoSeleccionada}
    }else{
      datos = {...datos,TipoEvento:"Evento"}
      datos = {...datos,EnlaceEvento:""}
    }

    const crear = await updateEventoCalendario(eventoRecibido.eventoId,datos)
    if(crear.status == 201){
      alert("datos editados correctamente")
      AbrirModalCrearNuevoEvento()
      RecargarEventos(mesMostrar)
    }else{
      alert("error")
    }
  }

  const [usuariosInvitados, setUsuariosInvitados] = useState([]);
  const [usuariosParaInvitar, setUsuariosParaInvitar] = useState([]);
  const [usuariosParaInvitarRespaldo, setUsuariosParaInvitarRespaldo] = useState([]);
  const [usuariosInvitarRespaldoBusqueda, setUsuariosInvitarRespaldoBusqueda] = useState([]);
  // const [mostrarListaUsuarios, setMostrarListaUsuarios] = useState(false)
  const [anchorElListaUsuarios, setAnchorElListaUsuarios] = useState(null);
  const openListaUsuarios = Boolean(anchorElListaUsuarios);

  const handleDelete = (chipToDelete) => () => {
    setUsuariosInvitados((chips) => chips.filter((chip) => chip.correoUsuario !== chipToDelete.correoUsuario));
    setUsuariosParaInvitar(antiguo => [...antiguo, chipToDelete].sort((a, b) =>
    a.correoUsuario.toLowerCase() > b.correoUsuario.toLowerCase() ? 1 : -1,
    ));
    setUsuariosInvitarRespaldoBusqueda(antiguo => [...antiguo, chipToDelete].sort((a, b) =>
    a.correoUsuario.toLowerCase() > b.correoUsuario.toLowerCase() ? 1 : -1,
    ));
  };

  const ObtenerUsuariosActivosInvitar = async() =>{
    var usuariosobte = await getUsuariosInvitarEvento();
    if(usuariosobte[0].id){
      if(eventoRecibido?.usuariosInvitados?.length > 0){
        eventoRecibido?.usuariosInvitados.forEach(element => {
          usuariosobte = usuariosobte.filter((chip) => chip.correoUsuario !== element.correoUsuario)
        });
        setUsuariosParaInvitar(usuariosobte)
        setUsuariosInvitarRespaldoBusqueda(usuariosobte)
      }else{
        setUsuariosParaInvitar(usuariosobte)
        setUsuariosInvitarRespaldoBusqueda(usuariosobte)
      }
      setUsuariosParaInvitarRespaldo(usuariosobte)
    }
  }
  const MostrarListaUsuariosActivosInvitar = (event) => {
    setAnchorElListaUsuarios(event.currentTarget);
  }
  const CerrarListaUsuariosActivosInvitar = () => {
    setAnchorElListaUsuarios(null);
  };

  const BuscarListaUsuariosActivosInvitar = (buscar) => {
    const arrayBusqueda = [...usuariosInvitarRespaldoBusqueda]
    if(buscar.trim().length === 0){
      setUsuariosParaInvitar(arrayBusqueda.sort((a, b) =>
      a.correoUsuario.toLowerCase() > b.correoUsuario.toLowerCase() ? 1 : -1,
      ))
    }else{
      const result = arrayBusqueda.filter(user => user.correoUsuario.toLowerCase().includes(buscar.toLowerCase()))

      setUsuariosParaInvitar(result)
    }
  }

  const EscogerUsuarioActivoLista = (usuarioRecibido) => {
    setUsuariosInvitados(antiguo => [...antiguo, usuarioRecibido].sort((a, b) =>
    a.correoUsuario > b.correoUsuario ? 1 : -1,
  ))
    setUsuariosParaInvitar((chips) => chips.filter((chip) => chip.correoUsuario !== usuarioRecibido.correoUsuario))
    setUsuariosInvitarRespaldoBusqueda((chips) => chips.filter((chip) => chip.correoUsuario !== usuarioRecibido.correoUsuario))
    CerrarListaUsuariosActivosInvitar()
  } 

  const MostrarEventoConReunion = (recibido) => {
    setEventoConReunion(recibido)
  }

  useLayoutEffect(() => {
    moment.locale('es')
    ObtenerUsuariosActivosInvitar()
    // setUsuariosInvitados([])
    setAnchorElListaUsuarios(null);
    
    setTituloEvento(eventoRecibido?.titulo ?? "")
    setFechaInicioEvento(moment( eventoRecibido?.fechaInicio ?? Date.now()).format("YYYY-MM-DD"))
    setFechaMinimaDateFin(moment( eventoRecibido?.fechaInicio ?? Date.now()).format("YYYY-MM-DD"))
    setFechaFinEvento(moment( eventoRecibido?.fechaFin ?? Date.now()).format("YYYY-MM-DD"))
    setHoraInicioEvento(eventoRecibido?.fechaInicio.split("T")[1].slice(0,5))
    setHoraMinimaTimeFin(eventoRecibido?.fechaInicio.split("T")[1].slice(0,5))
    setHoraFinEvento(eventoRecibido?.fechaFin.split("T")[1].slice(0,5))
    setDescripcionEvento(eventoRecibido?.descripcion)
    setEventoConReunion(eventoRecibido?.eventoConReunion)
    if(eventoRecibido?.eventoConReunion){
      setPlataformaEventoSeleccionada(eventoRecibido?.tipoEvento.slice(8))
      setEnlaceEventoConReunion(eventoRecibido?.enlaceEvento)
    }
    setUsuariosInvitados(eventoRecibido?.usuariosInvitados ?? [])

  }, []);
  


  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={abrirModal}
        onClose={AbrirModalCrearNuevoEvento}
        className='modal-crear-nuevo-evento-calendario'
      >
        <Form onSubmit={CargarDatosEditarEvento}>
          <DialogTitle>Editar detalles evento</DialogTitle>
          <DialogContent style={{height:'70vh'}}>
            <Container>
              <Chip style={{margin:'0 0 10px 0'}} label={"Todos los invitados seran notificados de los cambios"}></Chip>
              <FormGroup style={{width:'99%', display:'flex', marginBottom:'15px'}}>
                <TitleRoundedIcon style={{margin:'auto 10px auto 10px'}} />
                <Input type='text' placeholder='Ingrese el titulo' className='input-titulo-crear-evento' style={{width:'100%'}} 
                  value={tituloEvento} onChange={(e) => setTituloEvento(e.target.value)}></Input>
              </FormGroup>
              <FormGroup style={{width:'100%', display:'flex', marginBottom:'15px'}}>
                <GroupAddOutlinedIcon style={{margin:'auto 10px auto 10px'}}  />
                <div style={{width:'100%', display:'block'}}>
                <Container
                  // style={{border:'1px solid red'}}
                  className='container-listar-usuarios-invitado'
                >
                  <Box onClick={CerrarListaUsuariosActivosInvitar} className='container-usuarios-invitado container-scroll-calendario'>
                  {usuariosInvitados.map((data) => 
                      <Chip style={{margin:'5px 5px 5px 5px'}} key={data.id}
                        icon={<Avatar style={{width:'25px', height:'25px'}} alt={data.correoUsuario.toUpperCase()}  src={'Images/Users/'+data.imagenUsuario} />}
                        label={data.correoUsuario.toLowerCase()}
                        // onDelete={data.label === 'React' ? undefined : handleDelete(data)}
                        onDelete={handleDelete(data)}
                      />
                  )}
                  </Box>  
                  <Input type='text' placeholder='Invite a otros usuarios' style={{width:'100%', border:'none', boxShadow:'none'}} onChange={(e) => BuscarListaUsuariosActivosInvitar(e.target.value)} onClick={MostrarListaUsuariosActivosInvitar}></Input>
                </Container>
                {openListaUsuarios ? <Box className="contenedor-lista-usuarios-busqueda">
                  <Box style={{width:'100%',display:'flex', alignItems:'center'}}>
                    <Typography sx={{ display: 'inline', width:'100%',margin:'0 0 0 10px'}} component="span" variant="body2" color="text.primary" >
                      Usuarios disponibles 
                    </Typography>
                    <IconButton onClick={CerrarListaUsuariosActivosInvitar}> <CloseIcon fontSize="small" /></IconButton>
                  </Box>
                  <List sx={{ width: '100%', bgcolor: 'background.paper', maxHeight:'20vh', borderRadius:'10px'}} className='container-scroll-calendario'>
                    {usuariosParaInvitar.map((data) => 
                      <Box key={data.id}>
                        <ListItem alignItems="flex-start" disablePadding>
                          <ListItemButton onClick={() => EscogerUsuarioActivoLista(data)}>
                            <ListItemIcon>
                              <Avatar style={{width:'30px', height:'30px'}} alt={data.correoUsuario.toUpperCase()}  src={'Images/Users/'+data.imagenUsuario} />
                            </ListItemIcon>
                            <ListItemText
                              primary={data.correoUsuario.toLowerCase()}
                              
                            />
                          </ListItemButton>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </Box>
                    )}
                    
                  </List>
                </Box> : <></>}
                </div>
                <Chip style={{margin:'auto 10px auto 10px'}} label="Opcional" />
              </FormGroup>
              <FormGroup style={{width:'100%', display:'flex', marginBottom:'10px'}}>
                <EditCalendarOutlinedIcon style={{margin:'10px 10px 0 10px'}} />
                <Box style={{display:'block', width:'100%'}}>
                  <Box style={{width:'100%', display:'flex', margin:'5px 0 5px 0'}}>
                    {/* <TitleRoundedIcon fontSize="large" style={{margin:'auto 10px auto 10px'}} /> */}
                    <Input type="date" style={{width:'30%', margin:'0 10px 0 0'}} value={fechaInicioEvento} onChange={(e) => CambiarFechaInicioEvento(e.target.value)} required></Input>
                    <Input type="time" style={{width:'20%', margin:'0 10px 0 0'}} value={horaInicioEvento} onChange={(e) => CambiarHoraInicioEvento(e.target.value)} required></Input> 
                  </Box>
                  <Box style={{width:'100%', display:'flex', margin:'5px 0 5px 0'}}>
                    {/* <TitleRoundedIcon fontSize="large" style={{margin:'auto 10px auto 10px'}} /> */}
                    <Input type='date' value={fechaFinEvento} style={{width:'30%', margin:'0 10px 0 0'}} onChange={(e) => setFechaFinEvento(e.target.value)} min={fechaMinimaDateFin} required></Input>
                    <Input type="time" style={{width:'20%', margin:'0 10px 0 0'}} value={horaFinEvento} onChange={(e) => setHoraFinEvento(e.target.value)} min={horaMinimaTimeFin} required></Input>
                  </Box>
                </Box>
              </FormGroup>
              <FormGroup style={{width:'100%', display:'flex',marginBottom:'15px'}}>
                <DescriptionOutlinedIcon  style={{margin:'0 10px 0 10px'}} />
                <Box style={{display:'block', width:'100%'}}>
                <TextareaAutosize style={{width:'99%', borderRadius:'7px', padding:'10px 10px 10px 10px', border:'1px solid #adadad'}}
                  id="outlined-multiline-static" minRows={3} maxRows={3} value={descripcionEvento}
                  placeholder='Ingresar una descripcion (Opcional)' onChange={(e) => setDescripcionEvento(e.target.value)}
                />
                </Box>
              </FormGroup>
              <FormGroup style={{width:'100%', display:'flex', marginBottom:'15px'}}>
                <VideoCameraFrontOutlinedIcon style={{margin:'0 10px 0 10px'}} />
                <Box style={{display:'flex', width:'100%', alignItems:'center'}}>
                  Desea agregar una reunion en linea?
                  <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group" sx={{marginLeft:'20px'}}>
                    <FormControlLabel value="" sx={{margin:'0 0 0 0'}} control={<Checkbox size="small" sx={{padding:'0 0 0 0'}} checked={eventoConReunion} onChange={(e) => MostrarEventoConReunion(e.target.checked)} />} label="Si" />
                  </RadioGroup>
                </Box>
              </FormGroup>
              {eventoConReunion ? 
              <><FormGroup style={{width:'100%', display:'flex', marginBottom:'15px'}}>
                <Icon style={{margin:'0 10px 0 10px'}} />
                <Box style={{display:'flex', width:'100%', alignItems:'center'}}>
                  <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">Seleccione la plataforma de la reunion</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={plataformaEventoSeleccionada}
                    onChange={(e) => setPlataformaEventoSeleccionada(e.target.value)}
                  >
                    <FormControlLabel value="de Microsoft Teams" control={<Radio />} label="Teams" />
                    <FormControlLabel value="de Google Meet" control={<Radio />} label="Meet" />
                    <FormControlLabel value="de Zoom" control={<Radio />} label="Zoom" />
                    <FormControlLabel value="en Linea" control={<Radio />} label="Otro" />
                  </RadioGroup>
                  </FormControl>
                </Box>
              </FormGroup>
              <FormGroup style={{width:'100%', display:'flex', marginBottom:'15px'}}>
                <LinkIcon style={{margin:'0 10px 0 10px'}} />
                <Box style={{display:'block', width:'100%'}}>
                  <TextField
                    sx={{width:'99%'}} id="outlined-multiline-static" label="Enlace Reunión" multiline rows={2} value={enlaceEventoConReunion}
                    placeholder='Ingresar en enlace de la reunión' onChange={(e) => setEnlaceEventoConReunion(e.target.value)}
                  />
                </Box>
              </FormGroup></>: <></>}
            </Container>
          </DialogContent>
          <DialogActions>
            <Button type={'submit'}>Editar</Button>
            <Button type='button' onClick={AbrirModalCrearNuevoEvento}>Cerrar</Button>
          </DialogActions>
        </Form>
      </Dialog>

    </>
  );
};

export default EditarEventoComponent;
