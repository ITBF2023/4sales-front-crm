import React, { useLayoutEffect, useState} from "react";
import moment from "moment";
          
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Container, Row, Col, Card, CardBody, CardTitle, CustomInput} from 'reactstrap';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

import Fab from "@mui/material/Fab";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon  from "@mui/icons-material/Close";

import Header from "../../../components/Headers/Header";

import '../../../assets/css/ViewStyles/sucursalComponent.css'
import '../../../assets/css/ViewStyles/sucursalChooseComponent.css'
import { useParams } from "react-router-dom";

import DataTable from 'react-data-table-component'
import ReactTooltip from 'react-tooltip';

import { getSucursalbyCompany, getCompanybyID, getBitacoraByCompany, getUserId, postBitacora, updateBitacora, deleteBitacora, 
  postDocumentosBitacora, getCountDocumentBitacora, getTiposBitacora} from '../../../Controller/Controller';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

import ExpandedComponent from "./ExpandedComponent";
import AddIcon from '@mui/icons-material/Add';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import GestionCasosComponent from "./GestionCasosComponent/GestionCasosComponent";

const SucursalesCompaniesComponent = () => {

  let path = useParams()

  const mostrarBotonAcciones = (bitacorId, bitacorDescripcion) => {
      return <div className="AccionesBotonesBitacoras">
        <Button color="info" size="sm"data-tip data-for="tooltip-Actualizar-Bitacora" onClick={() => openEditBitacora(bitacorDescripcion, bitacorId)}><i className='mdi mdi-tooltip-edit'></i></Button>
        <ReactTooltip id="tooltip-Actualizar-Bitacora" place="top" type="dark" effect="float">Actualizar Bitacora</ReactTooltip>
        {/* <Button color="info" size="sm"data-tip data-for="tooltip-Eliminar-Bitacora" onClick={() => EliminarBitacora(bitacorId)}><i className='mdi mdi-delete-empty'></i></Button>
        <ReactTooltip id="tooltip-Eliminar-Bitacora" place="top" type="dark" effect="float">Eliminar Bitacora</ReactTooltip> */}
        <Button color="info" size="sm"data-tip data-for="tooltip-Cargar-Documento" onClick={() => abrirModalUpload(bitacorId)}><i className='mdi mdi-file-plus'></i></Button>
        <ReactTooltip id="tooltip-Cargar-Documento" place="top" type="dark" effect="float">Cargar Documento</ReactTooltip>
      </div>
  } 

  const CustomLoader = () => (
    <div align='center' style={{ padding: '24px', alignItems: 'center' }}>
      <CircularProgress />
      <div>Obteniendo Bitacoras...</div>
    </div>
  );

  const columns = [
  {
      name: 'Descripcion',
      selector: row => row.bitacoraDescripcion,
      // selector: row => <div style={{width:"530px"}}><textarea className="form-control" rows="3" disabled={true} style={{background: "transparent", outline:"transparent", color: "#646d91", border: "none", width:"100%"}} defaultValue={row.bitacoraDescripcion}></textarea ></div>,
      sortable: true,
      wrap: true,
      grow: 2,
      format: row => `${row.bitacoraDescripcion.slice(0, 200)}...`,
  },
  {
    name: 'Secuencia',
    selector: row => row.bitacoraID,
    sortable: true,
    grow: 0.5,
    style: {
        textAlign: 'center',
      },
    },
  {
      name: 'Fecha de Creación',
      selector: row => convert(row.bitacoraCreateDate),
      sortable: true,
      grow: 0.5
  },
  {
      name: 'Fecha de Modificación',
      selector: row => convert(row.bitacoraModifyDate),
      sortable: true,
      grow: 0.5
  },
  {
      name: 'Acciones',
      selector: row => mostrarBotonAcciones(row.bitacoraID, row.bitacoraDescripcion),
      center: true,
      allowOverflow: true,
      button: true,
      width: '150px',

  },
  ];

  const getId = () =>{
    let path = window.location.pathname;
    let arraypath = path.split('/');
    let id = arraypath[(arraypath.length-1)]
    return id
  }

  const getSucursales = async() => {
      const sucu = await getSucursalbyCompany(getId());
      // console.log(sucu)
      if (!sucu[0]){
        setSucursales([]);
      }else{
        setSucursales(sucu);
      }
  }

  const getCompany = async() => {
    const compan = await getCompanybyID(getId());
    // console.log(compan);
    if (!compan.compañia?.companyID){
      setCompany({});
    }else{
      setCompany(compan);
    }
  }

  const convert = fecha => {
    return ( (moment(Date.parse(fecha)).format("DD MMMM YYYY")).toString())
  }

  useLayoutEffect(() => {
    getSucursales();
    getCompany();
    getBitacora();
    getTiposdeBitacoras();
  }, []);

  const [sucursales, setSucursales] = useState([]);
  const [company, setCompany] = useState({});

  const [bitacoras, setBitacora] = useState([]);
  const [tipo, settipo] = useState([]);
  const [radioTipobitacora, setRadioTipoBitacora] = useState("8421547c-42a6-ed11-b2d0-1cbfce4880c6")
  const [bitacoraconDocumento, setbitacoracondocumentos] = useState(false)


  const [modalBitacora , setModalBitacora] = useState(false)
  const [descripcion, setDescripcion] = useState("");
  const [inputDescripcion, setinputDescripcion] = useState("");
  const [enabledButton, setenabledButton] = useState(true);

  const stylevalid = {color : 'rgb(255, 42, 42)', fontWeight : '500'}
  const [styleTextArea, setstyleTextArea] = useState();
  const [styleValidLabel] = useState(stylevalid);

  // Edit Bitacora
  const [modalEditBitacora , setModalEditBitacora] = useState(false)
  const [descripcionEditBitacora, setDescripcionEditBitacora] = useState("");
  const [inputDescripcionEditBitacora, setinputDescripcionEditBitacora] = useState("");
  const [enabledButtonEditBitacora, setenabledButtonEditBitacora] = useState(true);
  const [styleTextAreaEditBitacora, setstyleTextAreaEditBitacora] = useState();
  const [styleValidLabelEditBitacora] = useState(stylevalid);

  const [idEditBitacora , setIdEditBitacora] = useState()

  const [pending, setPending] = useState(true)

  // Estilo Modal
    const modalStyles={
        top: '10%',
    }

    //******************************************************************************************/
    // Backdrop Circule Progress 
    const [openbackdrop, setOpenBackdrop] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileUploadComplete, setFileUploadComplete] = useState(false);
    const [fileUploadError, setFileUploadError] = useState(false);
    //

    const startUpload  = () => {
      const timer = setInterval(() => {
        setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
      }, 800);
      return () => {
        clearInterval(timer);
      };
    };
    //******************************************************************************************/
  

    // Modal Upload Documents 
    const [modalUpload , setModalUpload] = useState(false)
    const [InputNombreArchivoUpload, setInputNombreArchivoUpload] = useState({border: '1px solid red'})
    const [InputFileArchivoUpload, setInputFileArchivoUpload] = useState({border: '1px solid red'})
    // Validators Inputs Upload
    const [validatorInputnombreUpload, setvalidatorInputnombreUpload] = useState('El nombre no puede estar vacio')
    const [validatorInputFileUpload, setvalidatorInputFileUpload] = useState('El archivo a cargar no puede estar vacio')
    // Button disabled
    const [uploadfile, setUploadfile] = useState(true)
    // Variables
    const [nombreArchivoUpload, setNombreArchivoUpload] = useState('')
    const [mymeTypeArchivoUpload, setMymeTypeArchivoUpload] = useState('')
    // const [dataFileUpload, setDataFileUpload] = useState(null)
    const [dataNameFileUpload, setdataNameFileUpload] = useState(null)


    //*****************************************************************
    // FUNCIONES MODAL UPLOAD

      const abrirModalUpload = (idBitacora) =>{
        setModalUpload(!modalUpload)
        setIdEditBitacora(idBitacora)
      }
      const ChangeInputNombreUpload = (nombre) => {
        setNombreArchivoUpload(nombre)
        if (nombre === '' || !nombre){
          setInputNombreArchivoUpload({ border: '1px solid red'})
          setvalidatorInputnombreUpload('El nombre del archivo no puede estar vacio')
        }else{
          setInputNombreArchivoUpload({})
          setvalidatorInputnombreUpload('')
        }

        if(nombre !== "" && nombre){
          setUploadfile(false)
        }else{
          setUploadfile(true)
        }
      }
      const ChangeInputFileUpload = (e) => {
        // setDataFileUpload(e.target.files[0])
        if (!e.target.files[0]){
          setInputFileArchivoUpload({ border: '1px solid red'})
          setvalidatorInputFileUpload('El archivo a cargar no puede estar vacio')
          setUploadfile(true)
          // Boton crear bitacora con documento
          setenabledButton(true)
        }else{
          let imageFil = e.target.files[0];
          const reader = new FileReader();
          reader.onload = x => {
              // setDataFileUpload(x.target.result)
              // console.log(x.target.result)
              // setImagenfile(imageFil)
              // console.log(imageFil.type)
              // console.log(imageFil.size  + " bytes")
              // console.log(reader)
              setdataNameFileUpload(imageFil)
              setNombreArchivoUpload(imageFil.name)
              setMymeTypeArchivoUpload(imageFil.type)
              setInputNombreArchivoUpload({})
              setvalidatorInputnombreUpload('')

          }
          reader.readAsDataURL(imageFil)
          setInputFileArchivoUpload({})
          setvalidatorInputFileUpload('')
          setUploadfile(false)
          // Boton crear bitacora con documento
          if(!inputDescripcion){
            setenabledButton(false)
          }
        }       
      }
      const CargarArchivo = async( idrecibido) => {
        let formdata = new FormData();
        formdata.append('titulo', nombreArchivoUpload)
        formdata.append('mymeType', mymeTypeArchivoUpload)
        formdata.append('pathfile', dataNameFileUpload)
        formdata.append('bitacoraId', (idrecibido !== null) ? idrecibido : idEditBitacora)
        formdata.append('userId', getUserId())
        setFileUploadComplete(false)
        setFileUploadError(false)
        setOpenBackdrop(true);
        startUpload();
        const archivo = await postDocumentosBitacora(formdata)
        if(archivo === "OK"){
          setFileUploadComplete(true)
          setTimeout(() => {
            setOpenBackdrop(false)
            alert("Reduce y vuelve a expandir la bitacora seleccionada para ver los cambios reflejados")
          }, 800);
        }else{
          setFileUploadError(true)
          setFileUploadComplete(true)
          setTimeout(() => {
            setOpenBackdrop(false)
          }, 800);
          alert("Ocurrio un problema inesperado")
        }

        setUploadfile(true)
        setNombreArchivoUpload('')
        setModalUpload(false)
        setInputFileArchivoUpload({ border: '1px solid red'})
        setvalidatorInputFileUpload('El archivo a cargar no puede estar vacio')
        setInputNombreArchivoUpload({ border: '1px solid red'})
        setvalidatorInputnombreUpload('El nombre del archivo no puede estar vacio')
      }
    //************************************************************

  const getBitacora = async() => {
    const bitacora = await getBitacoraByCompany(path.id);
    if(bitacora[0]){
        setBitacora([])
        setBitacora(bitacora)
        setPending(false)
    }else{
      setBitacora([])
      setPending(false)
    }
  }

  const getTiposdeBitacoras = async() => {
    const tipobit = await getTiposBitacora();
    if(tipobit){
      settipo([])
      settipo(tipobit)
  }
  }

  const openNewBitacora = () => {
    setModalBitacora(!modalBitacora)
    setinputDescripcion("La descripcion no puede estar vacia")
    setDescripcion("")
    setenabledButton(true)
    setstyleTextArea({border: '1px solid red'})
    setInputFileArchivoUpload({ border: '1px solid red'})
    setvalidatorInputFileUpload('El archivo a cargar no puede estar vacio')
    setUploadfile(true)
    // reestablecer valores del modal Upload Documents (Reutilizado)
    setdataNameFileUpload(null)
    setNombreArchivoUpload('')
    setMymeTypeArchivoUpload('')
    setInputNombreArchivoUpload({ border: '1px solid red'})
    setvalidatorInputnombreUpload('El nombre del archivo no puede estar vacio')
  }  

  const openEditBitacora = (descripcion, idBitacora) => {
    setIdEditBitacora(idBitacora)
    setModalEditBitacora(!modalEditBitacora)
    setinputDescripcionEditBitacora(null)
    setDescripcionEditBitacora(descripcion)
    setstyleTextAreaEditBitacora({})
  }

  const validator = descrip => {
    // e.preventDefault()
    setDescripcion(descrip)
    if(!descrip || descrip === ""){
        setinputDescripcion("La descripcion no puede estar vacia")
        setenabledButton(true)
        setstyleTextArea({border : '1px solid rgb(255, 42, 42)'})
    }else if (/^\s+$/.test(descrip)){
        setinputDescripcion("La descripcion no puede contener solo espacios")
        setenabledButton(true)
        setstyleTextArea({border : '1px solid rgb(255, 42, 42)'})
    }else{
        setinputDescripcion(null)
        setenabledButton(false)
        setstyleTextArea({})
    }
    if(!radioTipobitacora.includes("8421547c-42a6-ed11-b2d0-1cbfce4880c6")){
      if(!dataNameFileUpload){
        setenabledButton(true)
      }
    }
  }

  const validatorEditBitacora = descrip => {
    // e.preventDefault()
    setDescripcionEditBitacora(descrip)
    if(!descrip || descrip === ""){
        setinputDescripcionEditBitacora("La descripcion no puede estar vacia")
        setenabledButtonEditBitacora(true)
        setstyleTextAreaEditBitacora({border : '1px solid rgb(255, 42, 42)'})
    }else if (/^\s+$/.test(descrip)){
        setinputDescripcionEditBitacora("La descripcion no puede contener solo espacios")
        setenabledButtonEditBitacora(true)
        setstyleTextAreaEditBitacora({border : '1px solid rgb(255, 42, 42)'})
    }else{
        setinputDescripcionEditBitacora(null)
        setenabledButtonEditBitacora(false)
        setstyleTextAreaEditBitacora({})
    }
  }

  const handleSubmit = async() =>{
      const form = new FormData();
      form.append('bitacoraDescripcion',descripcion);
      form.append('compañiaServicioId',path.id);
      form.append('userID',getUserId());
      form.append('tipoBitacoraId',radioTipobitacora);

      const bita = await postBitacora(form)
      // console.log(bita)
      if(bita.status === 200){
        // setIdEditBitacora(bita.data.bitacoraID)
        if(!radioTipobitacora.includes("8421547c-42a6-ed11-b2d0-1cbfce4880c6")){
          CargarArchivo(bita.data.bitacoraID);
        }
        getBitacora()
        openNewBitacora()
      }
  }

  const handleSubmitEdit = async() =>{
    const form = new FormData();
    form.append('bitacoraId',idEditBitacora);
    form.append('bitacoraDescripcion',descripcionEditBitacora);

    const bita = await updateBitacora(idEditBitacora,form)
    if(bita === 204){
        alert("Bitacora Actualizada")
        getBitacora()
        openEditBitacora("")
    }
  }

  const ChangeRadioValue = (event) => {
    setRadioTipoBitacora(event.target.value)
    
    if(event.target.value.includes("8421547c-42a6-ed11-b2d0-1cbfce4880c6")){
      setbitacoracondocumentos(false)
      if(!inputDescripcion){
        setenabledButton(false)
      }
      // Reestablecer validar y estilos input file
      setInputFileArchivoUpload({ border: '1px solid red'})
      setvalidatorInputFileUpload('El archivo a cargar no puede estar vacio')
      setdataNameFileUpload(null)
    }else{
      setenabledButton(true)
      setbitacoracondocumentos(true)
    }
  }

  const EliminarBitacora = async(idBitacoraEliminar) =>{

    const getcountdocument = await getCountDocumentBitacora(idBitacoraEliminar);
    if(getcountdocument === 0){
      if (window.confirm("Esta Seguro de eliminar esta bitacora")) {
        const bita = await deleteBitacora(idBitacoraEliminar)
        if(bita === 204){
            alert("Bitacora Eliminada")
            getBitacora()
        }
      }
    }else if (getcountdocument > 0){
      if (window.confirm(`Esta Bitacora tiene ${getcountdocument} documentos anexados \n¿Esta Seguro de eliminar esta junto con los documentos? `)) {
        const bita = await deleteBitacora(idBitacoraEliminar)
        if(bita === 204){
            alert("Bitacora Eliminada")
            getBitacora()
        }
      }
    }
    
  }

  // const onRowClicked = (row, event) => {
  //   // console.log(row)
  //   // console.log(event)
  // };

  return(
    <>
    <Header></Header>
    <Container className="mt-5" fluid>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10 }}
        open={openbackdrop}
      >
          {!fileUploadComplete ? <p></p> :
          <Fab
            aria-label="save"
            color="primary"
            sx={{width: "10rem", height: "10rem", backgroundColor: "green"}}>
            <CheckIcon  sx={{ fontSize: "10rem" }} /> 
          </Fab>}

          {!fileUploadError ? <p></p> :
          <Fab
            aria-label="save"
            color="primary"
            sx={{width: "10rem", height: "10rem", backgroundColor: "red"}}>
            <CloseIcon  sx={{ fontSize: "10rem" }} /> 
          </Fab>}

          {fileUploadComplete ? <p></p> : <CircularProgress variant="determinate" size="12rem" value={progress}
          sx={{
            color: "green",
            position: 'absolute'
          }}/>}

      </Backdrop>
      
      <div className="container-fluid page-body-wrapper">
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="page-header">
              <h3 className="page-title"> {company.compañia?.companyRazonSocial} </h3>
            </div>
            <div className="row">
                <div className="col-12 grid-margin container-card-company">
                  <div className="card">
                    <div className="card-body">
                    <Row>
                      <div className="col-right col-sm-3 container-img-sucursal-choose ">
                        <img src={'Images/Companies/'+company.compañia?.companyImage} className="card__image col-right" alt="brown couch" />
                      </div>
                      <div className="col-right col-sm-8 container-img-sucursal-choose">
                        <time dateTime="2021-03-30" className="card__date" style={{marginBottom:'8px'}}>{convert(company.compañia?.companyCreateDate)}</time>
                        <time className="card__date">Razón Social:</time>
                        <p className="card__title">{company.compañia?.companyRazonSocial}</p>
                        <time className="card__date">Actividad principal:</time>
                        <p className="card__title">{company.planDeTrabajo}</p>
                        <time className="card__date">Direccion:</time>
                        <p className="card__title">{company.compañia?.companyAddress}</p>
                      </div>
                    </Row>
                    </div>

                  </div>
                </div>
            </div>
            <br></br>
            <div className="row">
              <div className="col-12 grid-margin">
                <div className="card">
                  <div className="card-body">
                    <div className="page-header">
                      <h3 className="page-title"> Bitacora Compañia </h3>
                      <nav >
                        <ol style={{float:"right", listStyle:"none"}}>
                          <li className="nav-item d-lg-block">
                              <Button color="info" onClick={openNewBitacora} >+ Agregar nueva bitacora</Button>
                          </li>
                        </ol>
                      </nav>
                    </div>
                    <DataTable
                    columns={columns}
                    data={bitacoras}
                    pagination
                    paginationComponentOptions={{
                        rowsPerPageText: 'Filas por Página',
                        rangeSeparatorText: 'de',
                        selectAllRowsItem: true,
                        selectAllRowsItemText: 'Todos'
                    }}
                    fixedHeader
                    fixedHeaderScrollHeight="600px"
                    highlightOnHover
                    pointerOnHover
                    expandableRows={true}
                    expandableRowsComponent={ExpandedComponent}
                    expandOnRowClicked={true}
                    expandOnRowDoubleClicked={false}
                    expandableRowsHideExpander={false}
                    progressPending={pending}
                    progressComponent={<CustomLoader />}
                    // onRowClicked={onRowClicked}
                    />
                  </div>
                </div>
              </div>
            </div>
            <br></br>
            <br></br>
            <Row>
              <Col xl="7">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <div className="page-header">
                      <h3 className="page-title"> Contactos Asociados: {sucursales.length}</h3>
                    </div>
                  </CardBody>
                  <div className="row" style={{maxHeight:"600px", overflow:"scroll", overflowX:"hidden"}} id="style-scrollbar">
                    <div className="container-card-sucursal">
                      <div >
                        {(sucursales.length === 0) ? 
                          (<div className="row">
                            <div className="container-card-company">
                              <div className="card"><h1>No hay contactos asociados para mostrar</h1></div>
                            </div>
                          </div>) : 
                          (<div className="container">
                            {sucursales.map((sucursal) => 
                              <div className="cardSucu" key={sucursal.sucursalID}>
                                <div className="card__header">
                                  <div className="card__footer">
                                    <div className="user">
                                      <img src={require("../../../assets/images/faces-clipart/pic-1.png")} alt="user__image" className="user__image" />
                                      <div className="user__info" style={{paddingTop: "8px"}}>
                                        <h5>{sucursal.sucursalNombreContacto}</h5>
                                        <small>{sucursal.sucursalCelularContacto}</small>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="card__body">
                                  <span className="tag tag-blue">{sucursal.sucursalCity}</span>
                                  <></>
                                  <h5>Cargo Contacto</h5>
                                  <p>{sucursal.sucursalCargoContacto}</p>
                                  <h5>Correo Contacto</h5>
                                  <p>{sucursal.sucursalCorreoContacto}</p>
                                </div>
                              </div>)}
                            </div> )}
                          </div>
                      </div>
                  </div>
                </Card>
              </Col>
              <Col xl="5">
                <Card className="card-stats mb-4 mb-xl-0">
                  <GestionCasosComponent></GestionCasosComponent>
                  <Card></Card>
                </Card>
              </Col>
            </Row>
          </div>
          <Modal isOpen={modalBitacora} style={modalStyles}>
            <ModalHeader>
              Crear Nueva Bitacora
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="descripcion">Descripcion Bitacora</Label>
                {/* <Input type="text" id="nombrearchivo" onChange={e => setDescripcion(e.target.value)}/> */}
                <textarea className="form-control" rows="5" placeholder="descripcion de la bitacora"
                    onChange={e => validator(e.target.value)} value={descripcion} style={styleTextArea}></textarea>
                {inputDescripcion ? <span><Label for="description-valid" style={styleValidLabel}>{inputDescripcion}</Label></span> : <span></span>}
                <br></br>
                <FormControl style={{margin:'0 0 0 0 !important'}}>
                  <FormLabel id="demo-row-radio-buttons-group-label">Tipo de Bitacora</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={radioTipobitacora}
                    onChange={(e) => ChangeRadioValue(e)}
                  >
                    {tipo.map((tipos, index) =>
                      <FormControlLabel key={index} value={tipos.tipoBitacoraId} id={tipos.tipoBitacoraId} control={<Radio />} label={tipos.descripcion} />
                    )}
                  </RadioGroup>
                </FormControl>
                {bitacoraconDocumento ? <>
                  <Label for="archivo">Seleccione un Archivo</Label>
                  <Input type="file" id="uploadArchivo" onChange={e => ChangeInputFileUpload(e)} style={InputFileArchivoUpload}/>
                  <Label id="errorarchivo" style={{color:'rgb(207, 125, 125)', marginTop:'2%', paddingRight:'5%', fontWeight:'500'}}> {validatorInputFileUpload} </Label>
                </> : <></>}
              </FormGroup>
            </ModalBody>

            <ModalFooter>
                <Button color="primary" disabled={enabledButton} onClick={handleSubmit}>Crear</Button>
                <Button color="secondary" onClick={openNewBitacora}>Cerrar</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={modalEditBitacora} style={modalStyles}>
            <ModalHeader>
            Edicion
            </ModalHeader>
            <ModalBody>
            <FormGroup>
                <Label for="descripcion">Descripcion Bitacora</Label>
                <textarea className="form-control" rows="5" placeholder="bitacora"
                    onChange={e => validatorEditBitacora(e.target.value)} value={descripcionEditBitacora} style={styleTextAreaEditBitacora}></textarea>
                {inputDescripcionEditBitacora ? <span><br></br><Label for="description-valid" style={styleValidLabelEditBitacora}>{inputDescripcionEditBitacora}</Label></span> : <span></span>}

            </FormGroup>
            </ModalBody>

            <ModalFooter>
                <Button color="primary" disabled={enabledButtonEditBitacora} onClick={handleSubmitEdit}>Actualizar</Button>
                <Button color="secondary" onClick={openEditBitacora}>Cerrar</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={modalUpload} style={modalStyles}>
            <ModalHeader>
              Cargar Archivo
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                
                <Label for="archivo">Seleccione un Archivo</Label>
                <Input type="file" id="uploadArchivo" onChange={e => ChangeInputFileUpload(e)} style={InputFileArchivoUpload}/>
                <Label id="errorarchivo" style={{color:'rgb(207, 125, 125)', marginTop:'2%', paddingRight:'5%', fontWeight:'500'}}> {validatorInputFileUpload} </Label>
                <br></br>
                <Label for="archivo">Nombre de Archivo</Label>
                <Input type="text" id="nombrearchivoUploas" value={nombreArchivoUpload} onChange={e => ChangeInputNombreUpload(e.target.value)} style={InputNombreArchivoUpload}/>
                <Label id="errorarchivo" style={{color:'rgb(207, 125, 125)', marginTop:'2%', paddingRight:'5%', fontWeight:'500'}}> {validatorInputnombreUpload} </Label>
                <br></br>
              </FormGroup>
            </ModalBody>

            <ModalFooter>
                <Button disabled={uploadfile} color="primary" onClick={() => CargarArchivo(null)}>Crear</Button>
                <Button color="secondary" onClick={abrirModalUpload}>Cerrar</Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    </Container>
    </>
  )
}

export default SucursalesCompaniesComponent;