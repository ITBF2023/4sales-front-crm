import React, { useLayoutEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import ReactTooltip from 'react-tooltip';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import Fab from "@mui/material/Fab";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon  from "@mui/icons-material/Close";

import './archivos.css'

import {Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label} from 'reactstrap';
import { getMyCarpetas, getMyDocumentos, postCarpetas, postDocumentos, getUserId, deleteDocumentos, 
  updateDocumentos, updateCarpeta, deleteCarpeta, getDocumentosToDownload, reloadDocumentos,
  getDocument} from '../../../Controller/Controller'

import Icon from '@mdi/react'
import { mdiFolderEdit  , mdiDeleteEmpty} from '@mdi/js';
import Header from "../../../components/Headers/Header.js";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

// import ReactFilePreviewer from 'react-file-previewer';
import {OutTable, ExcelRenderer} from 'react-excel-renderer';

import FileViewer from "react-file-viewer";
// import DocViewer from "react-doc-viewer";

const ArchivosUserComponent = () => {

  const parameter = useParams();

  const getcarpetas = useCallback( async () => {
    const getcar = await getMyCarpetas(parameter.carpetapadre);
    if(getcar){
      setCarpetas([])
      setCarpetas(getcar)
    }
  }, [parameter.carpetapadre])

  const getdocumentos = useCallback(async () => {
    const getdoc = await getMyDocumentos(parameter.carpetapadre);
    if(getdoc){
      setDocumentos(getdoc)
    }
  },[parameter.carpetapadre])

  const convert = fecha => {
    return ( (moment(Date.parse(fecha)).format("DD MMM YYYY HH:mm")).toString())
  }

  const getdocumentoDownload = async (idDocumentoDowload) => {
    // const imagen = await getDocument(idDocumentoDowload);
    // console.log(imagen)
    // console.log(typeof imagen)
    const getdocdowloas = await getDocumentosToDownload(idDocumentoDowload);
     //Downloaded file
    if(getdocdowloas){
      var a = document.createElement("a"); //Create <a>
      // a.href = require('/static/media/'+getdocpreview.documentoDirección)
      let blob = await fetch('https://4sales.com.co/SISTEMA/api/documentos/ObtenerDocumento/'+ idDocumentoDowload, { method: 'GET'}).then(r => r.blob());
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function() {
        a.href = reader.result
        a.download = getdocdowloas.documentoTitle; //File name Here
        a.click();
      }
      
    }
  }

  useLayoutEffect(() => {
    getcarpetas();
    getdocumentos();
    getUserId();
  }, [getcarpetas,getdocumentos])

  const [carpetas , setCarpetas] = useState([])
  const [documentos , setDocumentos] = useState([])
  const [abierto , setOpen] = useState(false)
  const [nombreCarpeta , setnombreCarpeta] = useState('')

  // Modal Carge de Arhivos
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


    // Modal Actualizacion de Arhivos
    const [modalUpdate , setModalUpdate] = useState(false)
    const [InputNombreArchivoUpdate, setInputNombreArchivoUpdate] = useState({border: '1px solid red'})
    // Validators Inputs Update
    const [validatorInputnombreUpdate, setvalidatorInputnombreUpdate] = useState('El nombre no puede estar vacio')
    // Button disabled
    const [updateFile, setUpdateFile] = useState(false)
    // Variables
    const [nombreArchivoUpdate, setNombreArchivoUpdate] = useState('')
    const [documentoIdUpdate, setDocumentoIdUpdate] = useState('')


    // Modal Edit Carpetas
    const [modalEditCarpeta , setModalEditCarpeta] = useState(false)
    const [idCarpetaEdit , setIdCarpetaEdit] = useState()

    //Modal Reload Archivo
    const [modalReload, setmodalReload] = useState(false);
    const [idDocumentoReload , setIdDocumentoReload] = useState();

    //Modal Preview Document
    const [modalPreview, setModalPreview] = useState(false);
    const [dataDocumento, setdataDocumento]  = useState("");
    const [typeDocumento, settypeDocumento] = useState("");
    const [filas, setFilas] = useState([]);
    const [columnas, setcolumnas] = useState([]);


  // Validators
  const [validatornombre, setValidator] = useState('El nombre no puede estar vacio')

  const [InputCarpeta, setInputCarpeta] = useState({border: '1px solid red'})

  const [crear, setcrear] = useState(true)

  const abrirModal = () =>{
    setOpen(!abierto)
    setnombreCarpeta('')
    setInputCarpeta({ border: '1px solid red'})
    setValidator('El nombre no puede estar vacio')
    setcrear(true)
  }

  const abrirModalEditCarpeta = (descripcion, idCarpetaEdicion) => {
    setModalEditCarpeta(!modalEditCarpeta)
    setnombreCarpeta(descripcion)
    setIdCarpetaEdit(idCarpetaEdicion)
    setcrear(false)
    setInputCarpeta({})
    setValidator('')
    setcrear(false)
  }

  // Funciones Modal Reload
    const abrirModalReload = (idDocumenReloadd) =>{
      setmodalReload(!modalReload)
      setIdDocumentoReload(idDocumenReloadd)
    }

    const VolverCargarArchivo = async() => {
      let formdata = new FormData();
      formdata.append('titulo', nombreArchivoUpload)
      formdata.append('mymeType', mymeTypeArchivoUpload)
      formdata.append('pathfile', dataNameFileUpload)
      setFileUploadComplete(false)
      setFileUploadError(false)
      setOpenBackdrop(true);
      startUpload();
      const archivo = await reloadDocumentos(idDocumentoReload, formdata)
      if(archivo === "OK"){
        setFileUploadComplete(true)
        setTimeout(() => {
          setOpenBackdrop(false)
        }, 800);
      }else{
        setFileUploadError(true)
        setFileUploadComplete(true)
        setTimeout(() => {
          setOpenBackdrop(false)
        }, 800);
        alert("Ocurrio un problema inesperado")
      }

      getdocumentos();
      setUploadfile(true)
      setNombreArchivoUpload('')
      setmodalReload(false)
      setInputFileArchivoUpload({ border: '1px solid red'})
      setvalidatorInputFileUpload('El archivo a cargar no puede estar vacio')
      setInputNombreArchivoUpload({ border: '1px solid red'})
      setvalidatorInputnombreUpload('El nombre del archivo no puede estar vacio')
    }


  // Funciones Modal Upload
    const abrirModalUpload = () =>{
      setModalUpload(!modalUpload)
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

        if (!e.target.files[0]){
          setInputFileArchivoUpload({ border: '1px solid red'})
          setvalidatorInputFileUpload('El archivo a cargar no puede estar vacio')
          setUploadfile(true)
        }else{
          setInputFileArchivoUpload({})
          setvalidatorInputFileUpload('')
          setUploadfile(false)
        }
    }

    const CargarArchivo = async() => {
      let formdata = new FormData();
      formdata.append('titulo', nombreArchivoUpload)
      formdata.append('mymeType', mymeTypeArchivoUpload)
      formdata.append('pathfile', dataNameFileUpload)
      // formdata.append('correoShared', mail)
      formdata.append('carpetaId', parameter.carpetapadre)
      formdata.append('userId', getUserId())
      setFileUploadComplete(false)
      setFileUploadError(false)
      setOpenBackdrop(true);
      startUpload();
      const archivo = await postDocumentos(formdata)
      if(archivo === "OK"){
        setFileUploadComplete(true)
        setTimeout(() => {
          setOpenBackdrop(false)
        }, 800);
      }else{
        setFileUploadError(true)
        setFileUploadComplete(true)
        setTimeout(() => {
          setOpenBackdrop(false)
        }, 800);
        alert("Ocurrio un problema inesperado")
      }

      getdocumentos();
      setUploadfile(true)
      setNombreArchivoUpload('')
      setModalUpload(false)
      setInputFileArchivoUpload({ border: '1px solid red'})
      setvalidatorInputFileUpload('El archivo a cargar no puede estar vacio')
      setInputNombreArchivoUpload({ border: '1px solid red'})
      setvalidatorInputnombreUpload('El nombre del archivo no puede estar vacio')
    }
  
   // Funciones Modal Update
    const abrirModalUpdate = (documentoIdRecibido, documentoTituloRecibido) =>{
      setNombreArchivoUpdate(documentoTituloRecibido)
      setDocumentoIdUpdate(documentoIdRecibido)
      setInputNombreArchivoUpdate({})
      setvalidatorInputnombreUpdate('')
      setModalUpdate(true)
    }

    const cerrarModalUpdate = () =>{
      setModalUpdate(false)
    }
    const ChangeInputNombreUpdate = (nombre) => {
      setNombreArchivoUpdate(nombre)
      if (nombre === '' || !nombre){
        setInputNombreArchivoUpdate({ border: '1px solid red'})
        setvalidatorInputnombreUpdate('El nombre del archivo no puede estar vacio')
      }else{
        setInputNombreArchivoUpdate({})
        setvalidatorInputnombreUpdate('')
      }

      if(nombre !== "" && nombre){
        setUpdateFile(false)
      }else{
        setUpdateFile(true)
      }
    }

    const UpdateDocumentoDrive = async () => {
      const update = { idDocument: documentoIdUpdate+"", nuevoTitulo: nombreArchivoUpdate }
      setFileUploadComplete(false)
      setFileUploadError(false)
      setOpenBackdrop(true);
      startUpload();
      const up = await updateDocumentos(documentoIdUpdate, update)
      if(up === "OK"){
        setFileUploadComplete(true)
        setTimeout(() => {
          setOpenBackdrop(false)
        }, 800);
      }else{
        setFileUploadError(true)
        setFileUploadComplete(true)
        setTimeout(() => {
          setOpenBackdrop(false)
        }, 800);
        alert("Ocurrio un problema inesperado")
      }
      getdocumentos();
      setUpdateFile(false)
      setModalUpdate(false)
    }

  const DeleteDocumentoDrive = async (idDocumento, IdDocumentoDrive) => {
    if (window.confirm('Estas seguro de eliminar este documento')) {
      setFileUploadComplete(false)
      setFileUploadError(false)
      setOpenBackdrop(true);
      startUpload();
      var del = await deleteDocumentos(idDocumento, IdDocumentoDrive)
      if(del === "OK"){
        setFileUploadComplete(true)
        setTimeout(() => {
          setOpenBackdrop(false)
        }, 800);
      }else{
        setFileUploadError(true)
        setFileUploadComplete(true)
        setTimeout(() => {
          setOpenBackdrop(false)
        }, 800);
        alert("Ocurrio un problema inesperado")
      }
    }
    setdataDocumento("")
    setFilas(null)
    setdocs("")
    getdocumentos();
  }

  const EliminarCarpetaCreada = async(idCarpetaEliminar) => {
    if(window.confirm("¿Esta seguro que desea eliminar la carpeta?")){
      const carpeta = await deleteCarpeta(idCarpetaEliminar)
      if(carpeta === 204){
        getcarpetas();
        alert("Carpeta Eliminada")
      }
    }
  }

  const MostrarImagen = (servicio) => {
    switch (servicio) {
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" :
        return <img src={require("../../../assets/images/google/logoDocExcel.png")} alt="logo google sheets" id="imagenDocument" />;
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation" :
        return <img src={require("../../../assets/images/google/logoDocPowerPoint.png")} alt="logo google slides" id="imagenDocument" />
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document" :
        return <img src={require("../../../assets/images/google/logoDocWord.png")} alt="logo google docs" id="imagenDocument"/>
      case "application/pdf" :
        return <img src={require("../../../assets/images/google/logo-pdf.png")} alt="logo pdf" id="imagenDocument"/>
      case "text/plain" :
        return <img src={require("../../../assets/images/google/logoTxt.webp")} alt="logo txt" id="imagenDocument"/>
      default :
        return <img src={require("../../../assets/images/google/logoDesconocido.png")} alt="logo txt" id="imagenDocument"/>;
    }
  }

  const MostrarTipo = (servicio) => {
    switch (servicio) {
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" :
        return "Microsoft Excel";
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation" :
        return "Power Point"
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document" :
        return "Microsoft Word"
      case "application/pdf" :
        return "Documento PDF"
      case "text/plain" :
        return "Documento Texto"
      default :
        return "Documento";
    }
  }

  const ChangeNombreCarpeta = (nombre) => {
    setnombreCarpeta(nombre)
    if(nombre === '' || !nombre ){
      setInputCarpeta({ border: '1px solid red'})
      setValidator('El nombre no puede estar vacio')
      setcrear(true)
    }else{
      setInputCarpeta({})
      setValidator('')
      setcrear(false)
    }
  }

  const CrearCarpeta = async() => {
    let formdata = new FormData();
    formdata.append('carpetaPadreId', parameter.carpetapadre)
    formdata.append('carpetaName', nombreCarpeta)
    formdata.append('userId', getUserId())
      
    const carpeta = await postCarpetas(formdata)
    if(carpeta){
      setnombreCarpeta('')
      getcarpetas();
      setOpen(false)
      setInputCarpeta({ border: '1px solid red'})
      setValidator('El nombre no puede estar vacio')
      setcrear(true)
      
    }
  }

  const EditarNombreCarpeta = async() => {
    let formdata = new FormData();
    formdata.append('carpetaId', idCarpetaEdit)
    formdata.append('carpetaName', nombreCarpeta)
      
    const carpeta = await updateCarpeta(idCarpetaEdit,formdata)
    if(carpeta === 204){
      setnombreCarpeta('')
      getcarpetas();
      setModalEditCarpeta(false)
      setInputCarpeta({ border: '1px solid red'})
      setValidator('El nombre no puede estar vacio')
      setcrear(true)
      alert("Nombre de Carpeta Modificado")
    }
  }

    // Funciones Modal Preview Document 
    const abrirModalPreview = () =>{
      setModalPreview(!modalPreview)
    }

    const [docs , setdocs] = useState();

    const getDocumentoVisualizar = async (idDocumentoDowload) => {
      setdataDocumento("")
      setFilas(null)
      setdocs("")

      const getdocpreview = await getDocumentosToDownload(idDocumentoDowload);
      if(getdocpreview){
        // var direcion = require('../../../assets/documentos/Users/'+getdocpreview.documentoDirección)
        // var direcion = window.location.protocol+"//"+window.location.host+"/static/media/"+getdocpreview.documentoDirección
        // let blob = await fetch(direcion).then(r => r.blob());
        let blob = await fetch('https://4sales.com.co/SISTEMA/api/documentos/ObtenerDocumento/'+ idDocumentoDowload, { method: 'GET'}).then(r => r.blob());
        // console.log(blob)
        var util = new File([blob], getdocpreview.documentoTitle, {type:getdocpreview.documentoMymeType})
        // console.log(util)
        var reader = new FileReader();
        reader.readAsDataURL(blob);   

        switch (getdocpreview.documentoMymeType) {
          case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            ExcelRenderer(util, (err, resp) => {
              if(err){}else{ setcolumnas(resp.cols)
                setFilas(resp.rows)}});
            break;
          case "application/vnd.ms-excel":
            ExcelRenderer(util, (err, resp) => {
              if(err){}else{ setcolumnas(resp.cols)
                setFilas(resp.rows)}});
            break;
          case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            reader.onloadend = function() {
              setdocs(reader.result)
            }
            break;
          default:
            reader.onloadend = function() {
              setdataDocumento(reader.result)
            }
            settypeDocumento(getdocpreview.documentoMymeType)
            break;
        }
      }

      abrirModalPreview()
    }

    const dataURLtoFile =  (dataurl, filename) => {
 
      var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), 
          n = bstr.length, 
          u8arr = new Uint8Array(n);
          
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      // console.log([u8arr])
      return new File([u8arr], filename, {type:mime});
    }

  const modalStyles={
    position: "absolute",
    top: '60%',
    left: '50%',
    width: '50%',
    transform: 'translate(-50%, -80%)'
  }

  const [openbackdrop, setOpenBackdrop] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileUploadComplete, setFileUploadComplete] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);

  const startUpload  = () => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  };


  return (
    <>
      <Header /><br></br><br></br>
      <div >
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
              
              <button className="btn btn-success" id="createNewFolder"  onClick={abrirModal}>+ Crear Carpeta</button>
              <br></br>
              <br></br>
              <br></br>
              <div className="row">
                <div className="col-lg-12 grid-margin">
                  <div className="card">
                    <div className="card-body">
                      {carpetas[0] ? 
                      <div className="row icons-list">
                        {carpetas.map((carpeta) => 
                          <div className="col-sm-6 col-md-4 col-lg-3" key={carpeta.carpetaId}>
                            <i className="mdi mdi-folder"></i><a style={{width:"100%", float:"left", marginLeft:"5px"}} href={"/SISTEMA/ITBF/crm-itbf/archivos-"+carpeta.carpetaId}>{carpeta.carpetaName}</a>
                            {/* <button style={{position:"relative",float:"left"}}><Icon path={mdiFileEdit} title="Edit" size={1}/></button> */}
                            <div style={{width:"100%", float:"left"}}>
                              <button style={{backgroundColor:'transparent', border:'none', boxShadow:'0 0 0 0 ',float:"right"}}><Icon color="#0090e7" path={mdiDeleteEmpty} title="Delete" size={1} onClick={() => EliminarCarpetaCreada(carpeta.carpetaId)}/></button>
                              <button style={{backgroundColor:'transparent', border:'none', boxShadow:'0 0 0 0 ',float:"right"}}><Icon color="#0090e7" path={mdiFolderEdit } title="Edit" size={1} onClick={() => abrirModalEditCarpeta(carpeta.carpetaName,carpeta.carpetaId)}/></button> 
                            </div>
                          </div>
                        )}
                      </div>
                      : <div style={{textAlign:'center'}}> <h4>No hay carpetas creadas</h4></div> }
                    </div>
                  </div>
                </div>
              </div>
              <br></br>

              {/* <button className="btn btn-success" id="createNewFolder"  onClick={abrirModalArchivos}>+ Crear Nuevo Documento</button> */}
              <button className="btn btn-success" id="createNewFolder" onClick={abrirModalUpload}>+ Cargar Documento</button>
              <br></br>
              <br></br>
              <br></br>
              <div className="row ">
                <div className="col-12 grid-margin">
                  <div className="card">
                    <div className="card-body">
                      <h4 className="card-title">Archivos</h4>
                      <div className="table-responsive">
                        {documentos[0] ? 
                        <table className="table" style={{border: '2px solid green !important'}}>
                          <thead>
                            <tr>
                              <th> #</th>
                              <th> Nombre Documento </th>
                              {/* <th> Nro Orden </th> */}
                              {/* <th> Propietary </th> */}
                              <th> Tipo de documento </th>
                              <th> Fecha de Creacion </th>
                              <th> Fecha de Modificacion </th>
                              {/* <th> Permisos </th> */}
                              <th> Acciones </th>
                            </tr>
                          </thead>
                          <tbody>
                            {documentos.map((documento, index)=>
                              <tr key={documento.documentoId}>
                                <td>
                                    {index+1}
                                </td>
                                <td>
                                  <div style={{ maxWidth: "300px", overflow: "hidden"}}>
                                  {MostrarImagen(documento.documentoMymeType)}
                                  <span className="pl-2">
                                    <Button style={{backgroundColor:'transparent', border:'none', boxShadow:'0 0 0 0 '}} onClick={() => getDocumentoVisualizar(documento.documentoId)} >{documento.documentoTitle}</Button>
                                  </span>
                                  </div>
                                </td>
                                {/* <td> {documento.documentoId} </td> */}
                                {/* <td> ITBF </td> */}
                                <td> {MostrarTipo(documento.documentoMymeType)}</td>
                                <td> {convert(documento.documentoCreateDate)} </td>
                                <td> {convert(documento.documentoModifyDate)} </td>
                                {/* <td>
                                  <div className="badge badge-outline-warning">Lectura</div>
                                  <div className="badge badge-outline-success">Escritura</div>
                                </td> */}
                                <td>
                                  {/* <button className="btn btn-success" data-tip data-for="tooltip-Actualizar-Documento" id="botonComercioUsers" onClick={() => UpdateDocumentoDrive(documento.documentoId, documento.documentoDriveId)}><i className="mdi mdi-account-edit"></i></button> */}
                                  <Button color="info" size="sm" data-tip data-for="tool-tip-preview-documento" onClick={() => getDocumentoVisualizar(documento.documentoId)}><i className="mdi mdi-database-eye-outline"></i></Button>
                                  <ReactTooltip id="tool-tip-preview-documento" place="top" type="dark" effect="float">Visualizar Documento</ReactTooltip>
                                  <Button color="info" size="sm" data-tip data-for="tooltip-Actualizar-Documento" onClick={() => abrirModalUpdate(documento.documentoId, documento.documentoTitle) }><i className="mdi mdi-account-edit"></i></Button>
                                  <ReactTooltip id="tooltip-Actualizar-Documento" place="top" type="dark" effect="float">Actualizar Documento</ReactTooltip>
                                  <Button color="info" size="sm" data-tip data-for="tool-tip-eliminar-documento" onClick={() => DeleteDocumentoDrive(documento.documentoId, documento.documentoDriveId)}><i className="mdi mdi-trash-can"></i></Button>
                                  <ReactTooltip id="tool-tip-eliminar-documento" place="top" type="dark" effect="float">Eliminar Documento</ReactTooltip>
                                  <Button color="info" size="sm" data-tip data-for="tool-tip-download-documento" onClick={() => getdocumentoDownload(documento.documentoId )}><i className="mdi mdi-cloud-download"></i></Button>
                                  <ReactTooltip id="tool-tip-download-documento" place="top" type="dark" effect="float">Descargar Documento</ReactTooltip>
                                  <Button color="info" size="sm" data-tip data-for="tool-tip-reload-documento" onClick={() => abrirModalReload(documento.documentoId)}><i className="mdi mdi-reload"></i></Button>
                                  <ReactTooltip id="tool-tip-reload-documento" place="top" type="dark" effect="float">Volver a cargar Documento</ReactTooltip>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        : <div style={{textAlign:'center'}}><h4>No hay documentos creados</h4> </div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Modal isOpen={abierto} style={modalStyles}>
              <ModalHeader>
                Crear Carpeta
              </ModalHeader>
              <ModalBody>
                <FormGroup>
                  <Label for="usuario">Nombre de Carpeta</Label>
                  <Input type="text" id="nombrecarpeta" onChange={e => ChangeNombreCarpeta(e.target.value)} style={InputCarpeta}/>
                  <Label id="usuario" style={{color:'rgb(207, 125, 125)', marginTop:'2%', paddingRight:'5%', fontWeight:'500'}}> {validatornombre} </Label>
                </FormGroup>
              </ModalBody>

              <ModalFooter>
                  <Button disabled={crear} color="primary" onClick={CrearCarpeta}>Crear</Button>
                  <Button color="secondary" onClick={abrirModal}>Cerrar</Button>
              </ModalFooter>
            </Modal>

            <Modal isOpen={modalEditCarpeta} style={modalStyles}>
              <ModalHeader>
                Editar Carpeta
              </ModalHeader>
              <ModalBody>
                <FormGroup>
                  <Label for="usuario">Nombre de Carpeta</Label>
                  <Input type="text" id="nombrecarpeta" onChange={e => ChangeNombreCarpeta(e.target.value)} style={InputCarpeta} defaultValue={nombreCarpeta}/>
                  <Label id="usuario" style={{color:'rgb(207, 125, 125)', marginTop:'2%', paddingRight:'5%', fontWeight:'500'}}> {validatornombre} </Label>
                </FormGroup>
              </ModalBody>

              <ModalFooter>
                  <Button disabled={crear} color="primary" onClick={EditarNombreCarpeta}>Actualizar</Button>
                  <Button color="secondary" onClick={abrirModalEditCarpeta}>Cerrar</Button>
              </ModalFooter>
            </Modal>

            <Modal isOpen={modalUpdate} style={modalStyles}>
              <ModalHeader>
                Actualizar Archivo
              </ModalHeader>
              <ModalBody>
                <FormGroup>
                  <Label for="archivo">Nombre de Archivo</Label>
                  <Input type="text" id="nombrearchivo" value={nombreArchivoUpdate} onChange={e => ChangeInputNombreUpdate(e.target.value)} style={InputNombreArchivoUpdate}/>
                  <Label id="errorarchivo" style={{color:'rgb(207, 125, 125)', marginTop:'2%', paddingRight:'5%', fontWeight:'500'}}> {validatorInputnombreUpdate} </Label>
                  <br></br>
                  
                </FormGroup>
              </ModalBody>

              <ModalFooter>
                  <Button disabled={updateFile} onClick={UpdateDocumentoDrive} color="primary" >Actualizar</Button>
                  <Button color="secondary" onClick={cerrarModalUpdate}>Cerrar</Button>
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
                  {/* <Label for="archivo">Tipo de Archivo</Label> */}
                  {/* <br></br> */}

                  {/* <Input type={"select"} id="tipoarchivo" style={select_tipo_document_upload} value={selectedOptionInputUpload} onChange={onChangeSelectionTypeFileUpload}>
                    <option value={""} id="optionarchivo">Escoge un tipo de Archivo</option>
                    <option value={"3"}>Google Documents (Documento Word)</option>
                    <option value={"1"}>Google Sheets (Hoja de calculo)</option>
                    <option value={"2"}>Google Slides (Presentacion)</option>
                  </Input> */}
                  
                  {/* <Label id="errortipoarchivo" style={{color:'rgb(207, 125, 125)', marginTop:'2%', paddingRight:'5%', fontWeight:'500'}}> {validatorSelectTypeFileUpload} </Label> */}
                  {/* <br></br> */}
                  {/* <Label for="archivo">Correo con el que se editara</Label>
                  <Input type="text" id="nombrearchivo" value={mail} onChange={e => setMail(e.target.value)} /> */}
                </FormGroup>
              </ModalBody>

              <ModalFooter>
                  <Button disabled={uploadfile} color="primary" onClick={CargarArchivo}>Crear</Button>
                  <Button color="secondary" onClick={abrirModalUpload}>Cerrar</Button>
              </ModalFooter>
            </Modal>

            <Modal isOpen={modalReload} style={modalStyles}>
              <ModalHeader>
                Volver a Cargar Archivo
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
                  <Button disabled={uploadfile} color="primary" onClick={VolverCargarArchivo}>Actualizar</Button>
                  <Button color="secondary" onClick={abrirModalReload}>Cerrar</Button>
              </ModalFooter>
            </Modal>

            <Dialog
              fullWidth={true}
              maxWidth={"lg"}
              open={modalPreview}
              onClose={abrirModalPreview}>
                <DialogTitle>Previsualizacion Documentos </DialogTitle>
                <DialogContent>
                  <DialogContentText></DialogContentText>
                  {dataDocumento == null || dataDocumento == undefined || dataDocumento == "" ? <></> : <>
                    <object 
                    type={typeDocumento}
                    data={dataDocumento}
                    width="95%" 
                    height="600px"
                    style={{display:'block', marginLeft:'auto', marginRight:'auto'}}
                    ></object>
                    </>}
                  {filas === null || filas === undefined || filas.length === 0 ? <></> : 
                    <OutTable data={filas} columns={columnas} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" />
                  }
                  {docs == null || docs == undefined || docs == "" ? <></> : 
                    <FileViewer
                    fileType={"docx"}
                    filePath={docs}
                    />
                  }
                </DialogContent>
                <DialogActions>
                  <Button onClick={abrirModalPreview}>cerrar</Button>
                </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  )
}

export default ArchivosUserComponent;
