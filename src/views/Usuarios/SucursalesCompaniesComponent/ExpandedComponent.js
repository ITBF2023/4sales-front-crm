import React, { useLayoutEffect, useState} from "react";
import moment from "moment";
          
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input} from 'reactstrap';
import CircularProgress from '@mui/material/CircularProgress';

import Backdrop from '@mui/material/Backdrop';

import Fab from "@mui/material/Fab";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon  from "@mui/icons-material/Close";

import '../../../assets/css/ViewStyles/sucursalComponent.css'
import '../../../assets/css/ViewStyles/sucursalChooseComponent.css'

import DataTable from 'react-data-table-component'
import ReactTooltip from 'react-tooltip';

import { getUserId, getMyDocumentosBitacora, postDocumentosBitacora, updateDocumentosBitacora, getDocumentosBitacoraToDownload, deleteDocumentosBitacora, 
  reloadDocumentosBitacora} from '../../../Controller/Controller';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import FileViewer from "react-file-viewer";
import {OutTable, ExcelRenderer} from 'react-excel-renderer';


const ExpandedComponent = ({ data }) => { 

  const [idEditBitacora , setIdEditBitacora] = useState()

  const [pendingDocumentos, setPendingDocumentos] = useState(true)

  // Estilo Modal
  const modalStyles={
    top: '10%',
  }


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

  //******************************************************************************************/
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
  //******************************************************************************************/

  //******************************************************************************************/
  // Modal Reload Archivo
    const [modalReload, setmodalReload] = useState(false);
    const [idDocumentoReload , setIdDocumentoReload] = useState();
  //******************************************************************************************/

  //******************************************************************************************/
  // Backdrop Circule Progress 
  const [openbackdrop, setOpenBackdrop] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileUploadComplete, setFileUploadComplete] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);
  //


  const [documentosBitacoras, setDocumentosBitacora] = useState([]);


  const columnsDocumentos = [
    {
      name: 'Nombre Documento',
      selector: row => row.documentoNombre,
      // selector: row => <div style={{width:"530px"}}><textarea className="form-control" rows="3" disabled={true} style={{background: "transparent", outline:"transparent", color: "#646d91", border: "none", width:"100%"}} defaultValue={row.bitacoraDescripcion}></textarea ></div>,
      sortable: true,
      wrap: true,
      grow: 2,
      format: row => `${row.documentoNombre.slice(0, 15)}`,
    },
    {
      name: 'Tipo Documento',
      selector: row => row.documentoMymeType,
      sortable: true,
      grow: 1,
      format: row => `${row.documentoMymeType.slice(0, 15)}`
    },
    {
      name: 'Fecha de Creación',
      selector: row => convert(row.documentoCreateDate),
      sortable: true,
      grow: 1
    },
    {
      name: 'Fecha de Modificación',
      selector: row => convert(row.documentoModifyDate),
      sortable: true,
      grow: 1
    },
    {
      name: 'Acciones',
      selector: row => mostrarBotonAccionesDocumentos(row.documentosBitacoraId, row.documentoNombre),
      center: true,
      allowOverflow: true,
      grow:2
    },
  ];

  const mostrarBotonAccionesDocumentos = (documentobitacoraId, DocumentoName) => {
    return (
    <div>
      <Button color="info" size="sm" data-tip data-for="tool-tip-preview-documento" onClick={() => getDocumentoVisualizar(documentobitacoraId)}><i className="mdi mdi-database-eye-outline"></i></Button>
      <ReactTooltip id="tool-tip-preview-documento" place="top" type="dark" effect="float">Visualizar Documento</ReactTooltip>
      <Button color="info" size="sm" data-tip data-for="tooltip-Actualizar-Documento" onClick={() => abrirModalUpdate(documentobitacoraId, DocumentoName) } ><i className="mdi mdi-account-edit"></i></Button>
      <ReactTooltip id="tooltip-Actualizar-Documento" place="top" type="dark" effect="float">Actualizar Documento</ReactTooltip>
      <Button color="info" size="sm" data-tip data-for="tool-tip-eliminar-documento" onClick={() => deleteDocumentoBita(documentobitacoraId)}><i className="mdi mdi-trash-can"></i></Button>
      <ReactTooltip id="tool-tip-eliminar-documento" place="top" type="dark" effect="float">Eliminar Documento</ReactTooltip>
      <Button color="info" size="sm" data-tip data-for="tool-tip-download-documento" onClick={() => getdocumentoBitacoraDownload(documentobitacoraId )}><i className="mdi mdi-cloud-download"></i></Button>
      <ReactTooltip id="tool-tip-download-documento" place="top" type="dark" effect="float">Descargar Documento</ReactTooltip>
      <Button color="info" size="sm" data-tip data-for="tool-tip-reload-documento" onClick={() => abrirModalReload(documentobitacoraId)}><i className="mdi mdi-reload"></i></Button>
      <ReactTooltip id="tool-tip-reload-documento" place="top" type="dark" effect="float">Volver a cargar Documento</ReactTooltip>
    </div>)
  } 

  const CustomLoader = () => (
    <div align='center' style={{ padding: '24px', alignItems: 'center' }}>
      <CircularProgress />
      <div>Obteniendo Bitacoras...</div>
    </div>
  );

  const convert = fecha => {
    return ( (moment(Date.parse(fecha)).format("DD MMMM YYYY")).toString())
  }

  const startUpload  = () => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  };
  //******************************************************************************************/


  useLayoutEffect(() => {
    getDocumentosBitacora(data.bitacoraID)
  }, []);

  const getDocumentosBitacora = async(idBitacora) => {
    const bitacora = await getMyDocumentosBitacora(idBitacora);
    if(bitacora){
      setDocumentosBitacora([])
      setDocumentosBitacora(bitacora)
    }else{
      setDocumentosBitacora([])
    }
    setPendingDocumentos(false)
  }


  //*****************************************************************
    // FUNCIONES DELETE DUCUMENT BITACORA
    const deleteDocumentoBita = async (idDocumento) => {
      if (window.confirm('Estas seguro de eliminar este documento')) {
        setFileUploadComplete(false)
        setFileUploadError(false)
        setOpenBackdrop(true);
        startUpload();
        var del = await deleteDocumentosBitacora(idDocumento)
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
      getDocumentosBitacora(data.bitacoraID)
      setdataDocumento("")
      setFilas(null)
      setdocs("")
    }
  //************************************************************

  //*****************************************************************
  // FUNCIONES DOWLOAD DOCUMENT BITACORA
    const getdocumentoBitacoraDownload = async (idDocumentoDowload) => {
      const getdocdowloas = await getDocumentosBitacoraToDownload(idDocumentoDowload);
      //Downloaded file
      if(getdocdowloas){
        var a = document.createElement("a"); //Create <a>
        let blob = await fetch('https://4sales.com.co/SISTEMA/api/documentosBitacora/ObtenerDocumento/'+ idDocumentoDowload, { method: 'GET'}).then(r => r.blob());
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
          a.href = reader.result
          a.download = getdocdowloas.documentoNombre; //File name Here
          a.click();
        }
      }
      
    }
  //************************************************************

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
      }else{
        let imageFil = e.target.files[0];
        const reader = new FileReader();
        reader.onload = x => {
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

  //*****************************************************************
  // FUNCIONES MODAL UPDATE
  const abrirModalUpdate = (documentoIdRecibido , documentoTituloRecibido) =>{
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
    const update = { idDocument: documentoIdUpdate, nuevoTitulo: nombreArchivoUpdate }
    setFileUploadComplete(false)
    setFileUploadError(false)
    setOpenBackdrop(true);
    startUpload();
    const up = await updateDocumentosBitacora(update)
    if(up === "OK"){
      getDocumentosBitacora(data.bitacoraID)
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
    setUpdateFile(false)
    setModalUpdate(false)
  }
  //************************************************************

  //*****************************************************************
  // FUNCIONES MODAL RELOAD
    const abrirModalReload = (idDocumenReloadd) =>{
      setmodalReload(!modalReload)
      setIdDocumentoReload(idDocumenReloadd)
    }
    const VolverCargarArchivo = async() => {
      let formdata = new FormData();
      formdata.append('titulo', nombreArchivoUpload)
      formdata.append('mymeType', mymeTypeArchivoUpload)
      formdata.append('pathfile', dataNameFileUpload)
      formdata.append('documentoBitacoraId', idDocumentoReload)
      setFileUploadComplete(false)
      setFileUploadError(false)
      setOpenBackdrop(true);
      startUpload();
      const archivo = await reloadDocumentosBitacora(formdata)
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
      getDocumentosBitacora(data.bitacoraID)
      setUploadfile(true)
      setNombreArchivoUpload('')
      setmodalReload(false)
      setInputFileArchivoUpload({ border: '1px solid red'})
      setvalidatorInputFileUpload('El archivo a cargar no puede estar vacio')
      setInputNombreArchivoUpload({ border: '1px solid red'})
      setvalidatorInputnombreUpload('El nombre del archivo no puede estar vacio')
    }
  //************************************************************


  //*****************************************************************
  // FUNCIONES PREVIEW DOCUMENTS
  const [modalPreview, setModalPreview] = useState(false);
  const [dataDocumento, setdataDocumento]  = useState("");
  const [typeDocumento, settypeDocumento] = useState("");
  const [filas, setFilas] = useState([]);
  const [columnas, setcolumnas] = useState([]);
  const [docs , setdocs] = useState();

  const abrirModalPreview = () =>{
    setModalPreview(!modalPreview)
  }

  const getDocumentoVisualizar = async (idDocumentoDowload) => {
    setdataDocumento("")
    setFilas(null)
    setdocs("")

    const getdocpreview = await getDocumentosBitacoraToDownload(idDocumentoDowload);
    if(getdocpreview){
      // var direcion = require('../../../assets/documentos/Bitacora/'+getdocpreview.documentoDireccion)
      // let blob = await fetch(direcion).then(r => r.blob());
      let blob = await fetch('https://4sales.com.co/SISTEMA/api/documentosBitacora/ObtenerDocumento/'+ idDocumentoDowload, { method: 'GET'}).then(r => r.blob());
      var util = new File([blob], getdocpreview.documentoTitle, {type:blob.type})
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

  const onRowClicked = (row, event) => {
    getDocumentoVisualizar(row.documentosBitacoraId)
  }

  
  //************************************************************

  return(
  <div>
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
    <pre>
      <div style={{marginLeft:"50px", marginRight:"50px", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", marginTop:"10px", marginBottom:"10px"}}>
        <br></br>
        <div style={{paddingBottom: "15px", paddingRight: "15px", paddingLeft: "15px"}}>
          <h3>Descripcion completa</h3>
          <br></br>
          <div>
            <textarea style={{width: '100%',}} rows={5} disabled={true} defaultValue={data.bitacoraDescripcion}></textarea>
          </div>
        </div>
        { !documentosBitacoras[0] ? 
        <div style={{paddingBottom: "15px", paddingRight: "15px", paddingLeft: "15px", color: '#646d91'}}> 
          <h4>Documentos Anexados</h4>
          <div>
            <textarea style={{width: '100%',}} rows={1} disabled={true} defaultValue={"No hay documentos anexados a esta bitacora"}></textarea>
          </div>
        </div> :

        <DataTable
          columns={columnsDocumentos}
          data={documentosBitacoras}
          title={"Documentos Anexados"}
          pagination
          theme="mantenimientoCompanies"
          paginationComponentOptions={{
              rowsPerPageText: 'Filas por Página',
              rangeSeparatorText: 'de',
              selectAllRowsItem: true,
              selectAllRowsItemText: 'Todos'
          }}

          fixedHeaderScrollHeight="600px"
          highlightOnHover
          pointerOnHover
          progressPending={pendingDocumentos}
          onRowClicked={onRowClicked}
          progressComponent={<CustomLoader />}
          />

        }

      </div>
    </pre>
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
  )
}

export default ExpandedComponent;