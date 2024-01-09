import React, { useLayoutEffect, useState} from "react";
import '../../../assets/css/comercio.css'
import { deleteCompany, getAsesoresActivos, getCompaniasSinSeguimiento, getDatosAsesoresComercialesActivos, postAsignarNuevasCompaniasAsesor} from '../../../Controller/Controller';
import moment from "moment";

import DataTable from 'react-data-table-component'
import Header from "../../../components/Headers/Header";
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Container, Input, InputGroup, InputGroupText, Modal, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { CircularProgress, Tooltip, Button as ButtonMUI, Chip, List, ListItemButton, ListItem, Divider, ListItemAvatar, ListItemText, Avatar, Typography, IconButton, Skeleton, Zoom} from "@mui/material";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ClearIcon from '@mui/icons-material/Clear';
import FaceIcon from '@mui/icons-material/Face';
import './CambioCompañias.css'

const CambioCompañiasComponent = () =>{

  const columns = [
    {
      name: '#',
      selector: row => row.compañiaId,
      sortable: true,
      width: "60px"
    },
    {
      name: 'Razon Social',
      selector: row => mostrarRazonSocial(row.companyImage, row.companyRazonSocial, row.compañiaServiciosId),
      sortable: true,
      wrap: true,
      grow: 2,
    },
    {
      name: 'NIT',
      selector: row => row.companyNIT,
      sortable: true,
      grow: 1.5
    },
    {
      name: 'Servicio Descripcion',
      selector: row => row.servicioDescripcion,
      sortable: true,
      wrap: true,
      grow: 1.5,
    },
    {
      name: 'Agente Bloqueado',
      selector: row => row.nombreUsuario,
      sortable: true,
      wrap: true,
      grow: 1.5
    },
    {
      name: 'Fecha de Creación',
      selector: row => (moment(Date.parse(row.companyCreateDate)).format("DD MMM YYYY")).toString(),
      wrap: true,
      sortable: true
    },
  ];
  const [companies, setcompanies ] = useState([]);
  const [companiesRespaldo, setcompaniesRespaldo ] = useState([]);
  const mostrarRazonSocial = (imagen ,razonSocial, empresaid) => {
    return (
      <div style={{paddingTop: '15px', paddingBottom: '15px'}}>
        <div style={{display: 'flex'}}>
          <img src={('Images/Companies/'+imagen)}  alt='i' width='30px'  style={{borderRadius:'50%', height:'30px'}} />
          <div style={{paddingLeft: '10px', paddingTop: '5px'}}>
            <Tooltip title={"Ir a la descripcion del comercial "+ razonSocial}>
              <Link to={'companyadmin-sucursal/' + empresaid  }>{razonSocial}</Link>
            </Tooltip>
          </div>
        </div>
    </div>
    )
  }
  const getCompanies = async () => {
    const comp = await getCompaniasSinSeguimiento()
    // console.log(comp)
    if(comp.status === 200){
      setcompanies(comp.data)
      setcompaniesRespaldo(comp.data)
      setPending(false)
    }else{
      setcompanies([])
      setcompaniesRespaldo([])
      setPending(false)
    }
  }
  const getSearchCompanies = async (cadena) => {
    const compañiasnuevas = [...companiesRespaldo]

    // console.log(companiesRespaldo)

    if(cadena.trim()=== "" || cadena.trim().length === 0){
      setcompanies(compañiasnuevas)
    }else{
      const result = compañiasnuevas.filter(compa => compa.companyRazonSocial?.toLowerCase().includes(cadena.toLowerCase()) 
                                        || compa.companyNIT?.toLowerCase().includes(cadena.toLowerCase()) 
                                        || compa.contactoPrincipal?.toLowerCase().includes(cadena.toLowerCase()) 
                                        || compa.companyAddress?.toLowerCase().includes(cadena.toLowerCase()))

      setcompanies(result)
    }
  }
  const [pending, setPending] = useState(true)
  const CustomLoader = () => (
    <div align='center' style={{ padding: '24px', alignItems: 'center' }}>
      <CircularProgress />
      <div>Obteniendo Compañias...</div>
    </div>
  );
  const [mensajeTooltip, setMensajeTooltip] = useState("Para habilitar la funcion primero debes seleccionar una compañia")
  const [deshabilitarButtonEscogerAgente, setDeshabilitarButtonEscogerAgente] = useState(true)
  const [toggleCleared, setToggleCleared] = useState(false);
  const handleChangeSelectedRows = (event) =>{
    // console.log(event)
    if(event.selectedCount === 0){
      setDeshabilitarButtonEscogerAgente(true)
      setMensajeTooltip("Para habilitar la funcion primero debes seleccionar una compañia")
      setCompañiasSeleccionadasTabla([])
      setCantidadCompañiasSeleccionadasTabla(0)
    }else{
      setDeshabilitarButtonEscogerAgente(false)
      setMensajeTooltip("")
      setCompañiasSeleccionadasTabla(event.selectedRows)
      setCantidadCompañiasSeleccionadasTabla(event.selectedCount)
    }
  }
  
  // Modal Listar Usuarios Activos ******************************
    const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([])
    const [asesoresComercialesActivos, setAsesoresComercialesActivos] = useState([])
    const [asesoresComercialesRespaldo, setAsesoresComercialesRespaldo] = useState([])
    const [obteniendoAsesores, setObteniendoAsesores] = useState(false)
    const [modalEscogerAsesores, setModalEscogerAsesores] = useState(false)
    const [deshabilitarAsignarCompañia, setDeshabilitarAsignarCompañia] = useState(true)
    const ObtenerDatosAsesoresActivos = async () => {
      setObteniendoAsesores(true)
      const datos = await getDatosAsesoresComercialesActivos()
      if(datos.status == 200){
        setAsesoresComercialesActivos(datos.data)
        setAsesoresComercialesRespaldo(datos.data)
      }else{
        setAsesoresComercialesActivos([])
        setAsesoresComercialesRespaldo([])
        alert("Error:"+datos.status+"\n Ocurrio un problema obteniendo los asesores activos:\n"+datos.data)
      }
      setObteniendoAsesores(false)
    }

    const AbrilModalEscogerAsesores = () =>{
      setUsuariosSeleccionados([])
      setDeshabilitarAsignarCompañia(true)
      setModalEscogerAsesores(true)
      ObtenerDatosAsesoresActivos();
    }
    const CerrarModalEscogerAsesor = () => {
      setModalEscogerAsesores(false)
    }
    const BuscadorNombreAsesores = (datoBuscarRecibido) =>{
      if(datoBuscarRecibido.trim().length === 0){
        setAsesoresComercialesActivos(asesoresComercialesRespaldo)
      }else{
        const asesoresCoincidencia = asesoresComercialesActivos.filter(asesor => asesor.usuarioNombre.toLowerCase().includes(datoBuscarRecibido.toLowerCase()) || 
                                                                        asesor.usuarioCorreo.toLowerCase().includes(datoBuscarRecibido.toLowerCase()))
        setAsesoresComercialesActivos(asesoresCoincidencia)
      }
    }
    const SeleccionarAsesorActivo = (datoRecibido) => {
      setUsuariosSeleccionados([datoRecibido])
      setDeshabilitarAsignarCompañia(false)
    }
    const EliminarAsesorActivoSelecciona = () => {
      setUsuariosSeleccionados([])
      setDeshabilitarAsignarCompañia(true)
    }

    const AsignarCompañiasSeleccionadas = async() =>{
      var compañiasCambiar = {
        "UsuarioId": usuariosSeleccionados[0].usuarioId,
        "CompañiasAsignar": compañiasSeleccionadasTabla
      }

      const respuesta = await postAsignarNuevasCompaniasAsesor(compañiasCambiar)
      if(respuesta.status === 201){
        alert(`Las ${cantidadCompañiasSeleccionadasTabla} compañias fueron asignadas correctamente al usuario ${usuariosSeleccionados[0].usuarioNombre}`)
        getCompanies()
        setToggleCleared(!toggleCleared); 
        setDeshabilitarButtonEscogerAgente(true)
        setMensajeTooltip("Para habilitar la funcion primero debes seleccionar una compañia")
      }else{
        alert(`Error ${respuesta.status} \n Ocurrio un Problema:\n ${respuesta.data}`)
      }
      CerrarModalEscogerAsesor()
    }

  // ************************************************************

  // Modal Mostrar Compañias Selecciondas

  const [modalCompañiasSelecciondas, setModalCompañiasSeleccionadas] = useState(false)
  const [compañiasSeleccionadasTabla, setCompañiasSeleccionadasTabla] = useState([])
  const [cantidadCompañiasSeleccionadasTabla, setCantidadCompañiasSeleccionadasTabla] = useState(0)
  const AbrilModalCompañiasSeleccionadas = () => {
    setModalCompañiasSeleccionadas(!modalCompañiasSelecciondas)
  }

  useLayoutEffect(() => {
      // if (isAdmin === false){
      //   window.location.href = "/403-Fordibben"
      // }else{
        getCompanies();
      // }
      
    }, []);
  return (<>
    <Header></Header>
    <Container className="mt-3" fluid>
      <div className="content-wrapper">
        <div className="page-header" style={{margin:' 0 0 10px 0'}}>
          <Chip avatar={<KeyboardDoubleArrowRightIcon/>}  sx={{
            "& .MuiChip-label": {whiteSpace:'normal'}, height:'auto !important', padding:'5px 0 5px 0'}} label="En esta seccion se muestran todas las empresas las cuales no cuentan con seguimiento debido a que su agente comercial fue bloqueado"></Chip>
        </div>
        <div className="row ">
            <div className="col-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <Row style={{margin:'0'}}>
                    <h3 className="page-title"> Empresas sin seguimiento </h3>
                  </Row>
                  <Row style={{margin:'0'}}>
                    <Col sm="3" style={{marginBottom:'5px'}}>
                      <Tooltip title={mensajeTooltip}
                        arrow followCursor TransitionComponent={Zoom}>
                        <div>
                        <ButtonMUI variant="outlined" sx={{textTransform:'capitalize'}} onClick={AbrilModalEscogerAsesores} 
                          disabled={deshabilitarButtonEscogerAgente}>Escoger Agente Comercial</ButtonMUI>
                        </div>
                      </Tooltip>
                    </Col >
                    <Col sm="3" style={{marginBottom:'5px'}}>
                      <Tooltip title={mensajeTooltip}
                          arrow followCursor TransitionComponent={Zoom}>
                        <div>
                        <ButtonMUI variant="outlined" sx={{textTransform:'capitalize'}} onClick={AbrilModalCompañiasSeleccionadas}
                          disabled={deshabilitarButtonEscogerAgente}>Ver compañias Seleccionadas</ButtonMUI>
                        </div>
                      </Tooltip>
                    </Col>
                    <Col sm="6">
                      <InputGroup>
                        <Input type="text" className="form-control" onChange={e => getSearchCompanies(e.target.value)} placeholder="Buscar por Razon Social / NIT / Contacto / Direccion"/>
                        <InputGroupText>
                          <ContentPasteSearchIcon fontSize="small" />
                        </InputGroupText>
                      </InputGroup>
                    </Col>
                  </Row>
                  
                  <br></br>
                  <br></br>
                  <DataTable
                    columns={columns}
                    data={companies}
                    pagination
                    theme="companiesAdmin"
                    fixedHeaderScrollHeight="600px"
                    highlightOnHover
                    pointerOnHover
                    selectableRows 
                    onSelectedRowsChange={handleChangeSelectedRows}
                    clearSelectedRows={toggleCleared}
                    progressPending={pending}
                    progressComponent={<CustomLoader />}
                  />
                  
                </div>
              </div>
            </div>
        </div>
      </div>
    </Container>
    <Modal isOpen={modalEscogerAsesores} className="modal-asignar-compañia-asesor">
      <Card>
        <CardHeader className="header-card-listado-asesores-activos">
          Asesores Comerciales Activos
        </CardHeader>
        <CardBody>
          <Chip sx={{"& .MuiChip-label": {whiteSpace:'normal'}, height:'auto !important', padding:'5px 0 5px 0',marginBottom:'5px'}} 
            avatar={<KeyboardDoubleArrowRightIcon/>} label="Se listaran todos los asesores comerciales activos"></Chip>
          <Chip sx={{"& .MuiChip-label": {whiteSpace:'normal'}, height:'auto !important', padding:'5px 0 5px 0',marginBottom:'5px'}} 
            avatar={<KeyboardDoubleArrowRightIcon/>} label="Debe escoger un asesor para asignarle las compañias seleccionadas"></Chip>
          
          {obteniendoAsesores ? 
            <List className="listado-asesores-activos-escoger style-scrollbar">
              <Typography variant="subtitle1" gutterBottom sx={{textAlign:'center'}}>
                <CircularProgress size={15}/> Obteniendo Asesores...
              </Typography>
              <ListItem key={"1"}>
                <ListItemAvatar>
                  <Skeleton variant="circular" height={60} ></Skeleton>
                </ListItemAvatar>
                <ListItemText>
                  <Skeleton variant="rectangular" height={28} sx={{margin:'8px'}}/>
                  <Skeleton variant="rectangular" height={17} sx={{margin:'8px'}}/>
                </ListItemText>
              </ListItem>
              <Divider variant="inset" component="li"></Divider>
              <ListItem key={"2"}>
                <ListItemAvatar>
                  <Skeleton variant="circular" height={60} ></Skeleton>
                </ListItemAvatar>
                <ListItemText>
                  <Skeleton variant="rectangular" height={28} sx={{margin:'8px'}}/>
                  <Skeleton variant="rectangular" height={17} sx={{margin:'8px'}}/>
                </ListItemText>
              </ListItem>
              <Divider variant="inset" component="li"></Divider>
            </List> : 
            <>
              <InputGroup>
                <Input type="text" placeholder="Buscador de usuarios" onChange={(e) => BuscadorNombreAsesores(e.target.value)}/>
                <InputGroupText><PersonSearchIcon fontSize="small" /></InputGroupText>
              </InputGroup>
              <List className="listado-asesores-activos-escoger style-scrollbar">
                {asesoresComercialesActivos.map((asesor, key) => 
                <div key={key}>
                  <ListItemButton onClick={() => SeleccionarAsesorActivo(asesor)}>
                    <ListItemAvatar>
                      <Avatar alt={asesor.usuarioNombre} src={"Images/Users/"+asesor.usuarioImagen} />
                    </ListItemAvatar>
                    <ListItemText primary={asesor.usuarioNombre} secondary={asesor.usuarioCorreo}></ListItemText>
                  </ListItemButton>
                  <Divider variant="inset" component="li"></Divider>
                </div>)}
              </List>
            </>
          }
          {usuariosSeleccionados.map((usuario, key) => 
            <div key={key}>
              <Typography variant="subtitle1" gutterBottom>Usuario Seleccionado:</Typography>
              <ListItem  className="listado-asesores-activos-escoger"
              secondaryAction={
                <IconButton edge="end" aria-label="comments" onClick={() => EliminarAsesorActivoSelecciona()}>
                  <ClearIcon />
                </IconButton>
              }
              disablePadding>

                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar alt={usuario.usuarioNombre} src={"Images/Users/"+usuario.usuarioImagen} />
                  </ListItemAvatar>
                  <ListItemText primary={usuario.usuarioNombre} secondary={usuario.usuarioCorreo}></ListItemText>
                </ListItemButton>
              </ListItem>
            </div> 
          )}
        </CardBody>
        <CardFooter style={{textAlign:'right', paddingTop:'0'}}>
          <ButtonMUI variant="contained" sx={{textTransform:'capitalize', marginRight:'5px'}} disabled={deshabilitarAsignarCompañia} onClick={() => AsignarCompañiasSeleccionadas()}>
            Asignarle {cantidadCompañiasSeleccionadasTabla} compañias
          </ButtonMUI>
          <ButtonMUI variant="outlined" sx={{textTransform:'capitalize'}} onClick={CerrarModalEscogerAsesor}>Cancelar</ButtonMUI>
        </CardFooter>
      </Card>
    </Modal>

    <Modal isOpen={modalCompañiasSelecciondas} className="modal-asignar-compañia-asesor">
      <Card>
        <CardHeader className="header-card-listado-asesores-activos">
          {cantidadCompañiasSeleccionadasTabla} Compañias Seleccionadas
        </CardHeader>
        <CardBody>
          <Chip sx={{"& .MuiChip-label": {whiteSpace:'normal'}, height:'auto !important', padding:'5px 0 5px 0',marginBottom:'5px'}} 
            avatar={<KeyboardDoubleArrowRightIcon/>} label="En esta seccion puedes validar todas las compañias que fueron seleccionadas"></Chip>
          <List className="listado-asesores-activos-escoger style-scrollbar">
            {compañiasSeleccionadasTabla.map((compañia, key) => 
            <div key={key}>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar alt={compañia.companyRazonSocial} src={"Images/Companies/"+compañia.companyImage} />
                </ListItemAvatar>
                <ListItemText primary={compañia.companyRazonSocial+" => "+compañia.servicioDescripcion} secondary={compañia.companyNIT}></ListItemText>
              </ListItemButton>
              <Divider variant="inset" component="li"></Divider>
            </div>)}
          </List>
        </CardBody>
        <CardFooter style={{textAlign:'right', paddingTop:'0'}}>
          {/* <ButtonMUI variant="contained" sx={{textTransform:'capitalize', marginRight:'5px'}} disabled={deshabilitarAsignarCompañia}>Asignarle compañias</ButtonMUI> */}
          <ButtonMUI variant="outlined" sx={{textTransform:'capitalize'}} onClick={AbrilModalCompañiasSeleccionadas}>Cerrar</ButtonMUI>
        </CardFooter>
      </Card>
    </Modal>
  </>)
}

export default CambioCompañiasComponent;