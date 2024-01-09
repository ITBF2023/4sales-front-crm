import React, { forwardRef, useLayoutEffect, useState } from "react";
import moment from "moment";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Form } from 'reactstrap';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

import Fab from "@mui/material/Fab";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { useParams } from "react-router-dom";

import DataTable from 'react-data-table-component'
import ReactTooltip from 'react-tooltip';

import {getUserId, postObservacionGestion, getObservacionsByGestion, 
  getCountDocumentObservaciones, deleteObservacionGestion, updateObservacionGestion, 
  postDocumentosObservacionesGestion, getCasoByID, getTodasObservacionsPorGestion} from '../../../../Controller/Controller';
import { FormControl  } from "@mui/material";

import ExpandedComponent from "./ExpandedComponent";

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import '../../../../assets/css/ViewStyles/ObservacionGestion.css'

const ObservacionesGestionComponent = ({estadoCaso}) => {
  let path = useParams()

  //ObtenerEstadoActual
  const getDatosGestion = async () => {
    const dato = await getCasoByID(path.id);
    if (!dato.casoId) {
      setEstadoActualCaso("");
    } else {
      setEstadoActualCaso(dato.estado);
    }
  }

  const mostrarBotonAcciones = (observacionId, observacionDescrip) => {
    return <div className="AccionesBotonesBitacoras">
      <Button color="info" size="sm" data-tip data-for="tooltip-Actualizar-Observacion" onClick={() => openEditObservacion(observacionDescrip, observacionId)}><i className='mdi mdi-tooltip-edit'></i></Button>
      <ReactTooltip id="tooltip-Actualizar-Observacion" place="top" type="dark" effect="float">Actualizar Observacion</ReactTooltip>
      <Button color="info" size="sm" data-tip data-for="tooltip-Eliminar-Observacion" onClick={() => EliminarObservacion(observacionId)}><i className='mdi mdi-delete-empty'></i></Button>
      <ReactTooltip id="tooltip-Eliminar-Observacion" place="top" type="dark" effect="float">Eliminar Observacion</ReactTooltip>
      <Button color="info" size="sm" data-tip data-for="tooltip-Cargar-Documento" onClick={() => abrirModalUpload(observacionId)}><i className='mdi mdi-file-plus'></i></Button>
      <ReactTooltip id="tooltip-Cargar-Documento" place="top" type="dark" effect="float">Cargar Documento</ReactTooltip>
    </div>
  }

  const CustomLoader = () => (
    <div align='center' style={{ padding: '24px', alignItems: 'center' }}>
      <CircularProgress />
      <div>Obteniendo Observaciones...</div>
    </div>
  );

  const columns = [
    {
      name: 'Secuencia',
      selector: row => row.secuencia,
      sortable: true,
      grow: "10px",
    },
    {
      name: 'Descripcion',
      selector: row => row.descripcion,
      sortable: true,
      wrap: true,
      grow: 2,
      format: row => `${row.descripcion.slice(0, 200)}...`,
    },
    {
      name: 'Estado',
      selector: row => row.estadoEvolucion,
      sortable: true,
      grow: 0.5
    },
    {
      name: 'Creación',
      selector: row => convert(row.fechaCreación),
      sortable: true,
      grow: 0.5
    },
    {
      name: 'Modificación',
      selector: row => convert(row.fechaModificación),
      sortable: true,
      grow: 0.5
    },
    {
      name: 'Acciones',
      selector: row => mostrarBotonAcciones(row.observaciónId, row.descripcion),
      center: true,
      allowOverflow: true,
      button: true,
      width: '150px',

    },
  ];

  const convert = fecha => {
    return ((moment(Date.parse(fecha)).format("DD MMMM YYYY")).toString())
  }

  const [estado, setEstado] = useState(estadoCaso)
  const [estadoActualCaso, setEstadoActualCaso] = useState()
  const [observaciones, setObservaciones] = useState([]);
  const [observacionConDocumento, setObservacionConDocumento] = useState(false)

  //Variables Nueva observacion ********************************
  const [modalObservacion, setModalObservacion] = useState(false)
  const [descripcion, setDescripcion] = useState("");
  const [mensajeValidarDescripcion, setMensajeValidarDescripcion] = useState("");
  const [enabledButton, setenabledButton] = useState(false);
  const [descripcionValida, setDescripcionValida] = useState(true)

  const [styleTextArea, setstyleTextArea] = useState();

  // Edit Observación
  const [modalEditObservacion, setModalEditObservacion] = useState(false)
  const [descripcionEditObservacion, setDescripcionEditObservacion] = useState("");
  const [inputDescripcionEditObservacion, setinputDescripcionEditObservacion] = useState("");
  const [enabledButtonEditObservacion, setenabledButtonEditObservacion] = useState(true);
  const [styleTextAreaEditObservacion, setstyleTextAreaEditObservacion] = useState();

  const [idEditObservacion, setIdEditObservacion] = useState()

  const [pending, setPending] = useState(true)

  // Estilo Modal
  const modalStyles = {
    top: '10%',
  }

  //******************************************************************************************/
  // Backdrop Circule Progress 
  const [openbackdrop, setOpenBackdrop] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileUploadComplete, setFileUploadComplete] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);
  //

  const startUpload = () => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  };
  //******************************************************************************************/


  // Modal Upload Documents 
  const [modalUpload, setModalUpload] = useState(false)
  const [InputNombreArchivoUpload, setInputNombreArchivoUpload] = useState({ border: '1px solid red' })
  const [InputFileArchivoUpload, setInputFileArchivoUpload] = useState({ border: '1px solid red' })
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
  const [fileCargadoValido, setFileCargadoValido] = useState(false)


  //*****************************************************************
  // FUNCIONES MODAL UPLOAD

    const abrirModalUpload = (idObservacion) => {
      setModalUpload(!modalUpload)
      setIdEditObservacion(idObservacion)
      setInputFileArchivoUpload({ border: '1px solid red' })
      setvalidatorInputFileUpload('El archivo a cargar no puede estar vacio')
      setInputNombreArchivoUpload({ border: '1px solid red' })
      setvalidatorInputnombreUpload('El nombre del archivo no puede estar vacio')
      setUploadfile(true)

      setdataNameFileUpload(null)
      setNombreArchivoUpload("")
      setMymeTypeArchivoUpload("")
    }
    const ChangeInputNombreUpload = (nombre) => {
      setNombreArchivoUpload(nombre)
      if (nombre === '' || !nombre) {
        setUploadfile(true)
        setInputNombreArchivoUpload({ border: '1px solid red' })
        setvalidatorInputnombreUpload('El nombre del archivo no puede estar vacio')
      } else {
        setInputNombreArchivoUpload({})
        setvalidatorInputnombreUpload('')
        if(fileCargadoValido){
          setUploadfile(false)
        }
      }
    }
    const ChangeInputFileUpload = (e) => {
      // setDataFileUpload(e.target.files[0])
      if (!e.target.files[0]) {
        setInputFileArchivoUpload({ border: '1px solid red' })
        setvalidatorInputFileUpload('El archivo a cargar no puede estar vacio')
        setUploadfile(true)
        // Boton crear observacion con documento
        setenabledButton(true)
        setFileCargadoValido(false)

      } else {
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
        // Boton crear observacion con documento
        // para reutilizar componentes
        setFileCargadoValido(true)
        if (descripcionValida) {
          setenabledButton(false)
        }else{
          setenabledButton(true)
        }
      }
    }
    const CargarArchivo = async () => {
      let formdata = new FormData();
      formdata.append('documentoNombre', nombreArchivoUpload)
      formdata.append('documentoMymeType', mymeTypeArchivoUpload)
      formdata.append('documentoFile', dataNameFileUpload)
      formdata.append('observacionId', idEditObservacion)
      setFileUploadComplete(false)
      setFileUploadError(false)
      setOpenBackdrop(true);
      startUpload();
      const archivo = await postDocumentosObservacionesGestion(formdata)
      if (archivo === "OK") {
        setFileUploadComplete(true)
        setTimeout(() => {
          setOpenBackdrop(false)
          alert("Reduce y vuelve a expandir la observacion seleccionada para ver los cambios reflejados")
        }, 800);
      } else {
        setFileUploadError(true)
        setFileUploadComplete(true)
        setTimeout(() => {
          setOpenBackdrop(false)
        }, 800);
        alert("Ocurrio un problema inesperado")
      }

      abrirModalUpload(idEditObservacion)
    }


    // Funciones Editar observacion************************************************************

    const openEditObservacion = (descripcion, idObservacion) => {
      setIdEditObservacion(idObservacion)
      setModalEditObservacion(!modalEditObservacion)
      setinputDescripcionEditObservacion(null)
      setDescripcionEditObservacion(descripcion)
      setstyleTextAreaEditObservacion({})
    }

    const validatorEditObservacion = descrip => {
      // e.preventDefault()
      setDescripcionEditObservacion(descrip)
      if (!descrip || descrip === "") {
        setinputDescripcionEditObservacion("La descripcion no puede estar vacia")
        setenabledButtonEditObservacion(true)
        setstyleTextAreaEditObservacion({ border: '1px solid rgb(255, 42, 42)' })
      } else if (/^\s+$/.test(descrip)) {
        setinputDescripcionEditObservacion("La descripcion no puede contener solo espacios")
        setenabledButtonEditObservacion(true)
        setstyleTextAreaEditObservacion({ border: '1px solid rgb(255, 42, 42)' })
      } else {
        setinputDescripcionEditObservacion(null)
        setenabledButtonEditObservacion(false)
        setstyleTextAreaEditObservacion({})
      }
    }

    const handleSubmitEdit = async () => {
      const form = new FormData();
      form.append('observacionDescripcion', descripcionEditObservacion);

      const observ = await updateObservacionGestion(idEditObservacion, form)
      if (observ === 204) {
        setmensajeNotificacionMostrar("Observacion actualizada correctamente!")
        setMostrarNotificacion(true)
        getObservaciones()
        openEditObservacion("")
      }
    }


  // Funciones Modal Crear nueva Observacion *************************************************************************************
    const openModalCrearObservacion = () => {
      setModalObservacion(!modalObservacion)
      setMensajeValidarDescripcion("La descripcion no puede estar vacia")
      setDescripcion("")
      setstyleTextArea({ border: '1px solid red' })
      setObservacionConDocumento(false)
      setInputFileArchivoUpload({ border: '1px solid red' })
      setvalidatorInputFileUpload('El archivo a cargar no puede estar vacio')
      setenabledButton(true)

      setdataNameFileUpload(null)
      setNombreArchivoUpload("")
      setMymeTypeArchivoUpload("")
    }

    const validarDescripcionObservacion = descrip => {
      setDescripcion(descrip)
      if (!descrip || descrip === "") {
        setMensajeValidarDescripcion("La descripcion no puede estar vacia")
        setenabledButton(true)
        setDescripcionValida(false)
        setstyleTextArea({ border: '1px solid rgb(255, 42, 42)' })
      } else if (/^\s+$/.test(descrip)) {
        setMensajeValidarDescripcion("La descripcion no puede contener solo espacios")
        setenabledButton(true)
        setDescripcionValida(false) 
        setstyleTextArea({ border: '1px solid rgb(255, 42, 42)' })
      } else {
        setMensajeValidarDescripcion(null)
        setDescripcionValida(true) 
        setenabledButton(false)
        setstyleTextArea({})
        if(observacionConDocumento){
          if(fileCargadoValido){
            setenabledButton(false)
          }else{
            setenabledButton(true)
          }
        }
      }
    }

    const handleSubmit = async () => {
      const form = new FormData();
      form.append('observacionDescripcion', descripcion);
      form.append('estadoEvolucion', estadoActualCaso);
      form.append('usuarioId', getUserId());
      form.append('gestionCasoId', path.id);
      form.append('observacionConDocumento', observacionConDocumento);

      form.append('documentoNombre', nombreArchivoUpload);
      form.append('documentoMymeType', mymeTypeArchivoUpload);
      form.append('documentoFile', dataNameFileUpload);

      const observ = await postObservacionGestion(form)
      if (observ.status === 201) {
        setmensajeNotificacionMostrar("Observación añadida correctamente!")
        setMostrarNotificacion(true)
        getObservaciones()
        openModalCrearObservacion()
      }
    }

    const AgregarDocumento = (valor) => {
      setObservacionConDocumento(valor)
      setenabledButton(true)
      setInputFileArchivoUpload({ border: '1px solid red' })
      setvalidatorInputFileUpload('El archivo a cargar no puede estar vacio')
      setdataNameFileUpload(null)
      setNombreArchivoUpload("")
      setMymeTypeArchivoUpload("")

      if(valor == false){
        if(descripcionValida){
          setenabledButton(false)
        }else{
          setenabledButton(true)
        }
      }
    }
    
    //Eliminar Observacion *******************************************************************************************************
    const EliminarObservacion = async (idObservacionEliminar) => {
      const getcountdocument = await getCountDocumentObservaciones(idObservacionEliminar);
      if (getcountdocument === 0) {
        if (window.confirm("Esta Seguro de eliminar esta observación")) {
          const observ = await deleteObservacionGestion(idObservacionEliminar)
          if (observ === 204) {
            setmensajeNotificacionMostrar("Observacion Eliminada!")
            setMostrarNotificacion(true)
            getObservaciones()
          }
        }
      } else if (getcountdocument > 0) {
        if (window.confirm(`Esta observación tiene ${getcountdocument} documentos anexados \n¿Esta Seguro de eliminarla junto con los documentos? `)) {
          const observ = await deleteObservacionGestion(idObservacionEliminar)
          if (observ === 204) {
            setmensajeNotificacionMostrar("Observación Eliminada!")
            setMostrarNotificacion(true)
            getObservaciones()
          }
        }
      }
    }

    //Obtener Observaciones
    const getObservaciones = async () => {
      if(estado !== "TODOS"){
        const observaciones = await getObservacionsByGestion(path.id, estado);
        if (observaciones[0]) {
          setObservaciones([])
          setObservaciones(observaciones)
          setPending(false)
        } else {
          setObservaciones([])
          setPending(false)
        }
      }else{
        const observaciones = await getTodasObservacionsPorGestion(path.id);
        // console.log(observaciones)
        if (observaciones[0]) {
          setObservaciones([])
          setObservaciones(observaciones)
          setPending(false)
        } else {
          setObservaciones([])
          setPending(false)
        }
      }
    }

  useLayoutEffect(() => {
    getObservaciones();
    getDatosGestion();
  }, []);

  const [mostrarNotificacion, setMostrarNotificacion] = useState(false)
  const [mensajeNotificacionMostrar, setmensajeNotificacionMostrar] = useState("")
  
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const cerrarNotificacion = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMostrarNotificacion(false);
  };

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10 }}
        open={openbackdrop}
      >
        {!fileUploadComplete ? <p></p> :
          <Fab
            aria-label="save"
            color="primary"
            sx={{ width: "10rem", height: "10rem", backgroundColor: "green" }}>
            <CheckIcon sx={{ fontSize: "10rem" }} />
          </Fab>}

        {!fileUploadError ? <p></p> :
          <Fab
            aria-label="save"
            color="primary"
            sx={{ width: "10rem", height: "10rem", backgroundColor: "red" }}>
            <CloseIcon sx={{ fontSize: "10rem" }} />
          </Fab>}

        {fileUploadComplete ? <p></p> : <CircularProgress variant="determinate" size="12rem" value={progress}
          sx={{
            color: "green",
            position: 'absolute'
          }} />}

      </Backdrop>
      <div className="page-header">
        {estadoCaso === "TODOS" ? <nav >
          <ol style={{ float: "right", listStyle: "none" }}>
            <li className="nav-item d-lg-block">
                <Button color="info" onClick={openModalCrearObservacion} >+ Agregar Observacion</Button>
            </li>
          </ol>
        </nav>: <></>}
      </div>
      <DataTable
      columns={columns}
      data={observaciones}
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
      <Modal isOpen={modalObservacion} style={modalStyles}>
        <ModalHeader>
          Agregar Nueva Observacion
        </ModalHeader>
        <ModalBody>
          <Form>
            <Label for="descripcion">Descripcion</Label>
            <textarea className="form-control" rows="5" placeholder="Ingrese la nueva observacion"
              onChange={e => validarDescripcionObservacion(e.target.value)} value={descripcion} style={styleTextArea}></textarea>
            {mensajeValidarDescripcion ? <span><Label for="description-valid" className="LabelValidador">{mensajeValidarDescripcion}</Label></span> : <span></span>}
            <br></br>
            <FormControl style={{ margin: '0 0 0 0 !important' }}>
              <FormControlLabel
                value="end"
                control={<Checkbox onClick={(e)=>AgregarDocumento(e.target.checked)}/>}
                label="Adjuntar un documento"
                labelPlacement="end"
              />
            </FormControl>
            {observacionConDocumento ? <>
              <FormControl style={{ margin: '0 0 0 0 !important' }}>
                <Label for="archivo">Seleccione un Archivo</Label>
                <Input type="file" id="uploadArchivo" onChange={e => ChangeInputFileUpload(e)} style={InputFileArchivoUpload} />
                <Label id="errorarchivo" className="LabelValidadorFileCargado"> {validatorInputFileUpload} </Label>
              </FormControl>
            </> : <></>}
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" disabled={enabledButton} onClick={handleSubmit}>Crear</Button>
          <Button color="secondary" onClick={openModalCrearObservacion}>Cerrar</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditObservacion} style={modalStyles}>
        <ModalHeader>
          Edicion de observaciones
        </ModalHeader>
        <ModalBody>
          <Form>
            <Label for="descripcion">Descripcion</Label>
            <textarea className="form-control" rows="5" placeholder="Ingresa la observacion"
              onChange={e => validatorEditObservacion(e.target.value)} value={descripcionEditObservacion} style={styleTextAreaEditObservacion}></textarea>
            {inputDescripcionEditObservacion ? <span><br></br><Label for="description-valid" className="LabelValidador">{inputDescripcionEditObservacion}</Label></span> : <span></span>}

          </Form>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" disabled={enabledButtonEditObservacion} onClick={handleSubmitEdit}>Actualizar</Button>
          <Button color="secondary" onClick={openEditObservacion}>Cerrar</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalUpload} style={modalStyles}>
        <ModalHeader>
          Cargar Archivo
        </ModalHeader>
        <ModalBody>
          <Form>

            <Label for="archivo">Seleccione un Archivo</Label>
            <Input type="file" id="uploadArchivo" onChange={e => ChangeInputFileUpload(e)} style={InputFileArchivoUpload} />
            <Label id="errorarchivo" className="LabelValidadorFileCargado"> {validatorInputFileUpload} </Label>
            <br></br>
            <Label for="archivo">Nombre de Archivo</Label>
            <Input type="text" id="nombrearchivoUploas" value={nombreArchivoUpload} onChange={e => ChangeInputNombreUpload(e.target.value)} style={InputNombreArchivoUpload} />
            <Label id="errorarchivo" className="LabelValidadorFileCargado"> {validatorInputnombreUpload} </Label>
            <br></br>
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button disabled={uploadfile} color="primary" onClick={() => CargarArchivo(null)}>Crear</Button>
          <Button color="secondary" onClick={abrirModalUpload}>Cerrar</Button>
        </ModalFooter>
      </Modal>

      <Snackbar open={mostrarNotificacion} autoHideDuration={6000} onClose={cerrarNotificacion} anchorOrigin={{vertical: 'top', horizontal:'center' }}>
        <Alert onClose={cerrarNotificacion} severity="success" sx={{ width: '100%' }}>
          {mensajeNotificacionMostrar}
        </Alert>
      </Snackbar>
    </>
    
  )
}

export default ObservacionesGestionComponent;