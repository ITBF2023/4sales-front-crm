import React, { useLayoutEffect, useState } from "react";

import '../../../assets/css/ViewStyles/archivosAdmin.css'
import { useParams } from "react-router-dom";

import ReactTooltip from 'react-tooltip';

import {getCarpetasAdmin, getDocumentosToDownload} from '../../../Controller/Controller'
import moment from "moment";
import Header from "../../../components/Headers/Header";
import { Container, Row } from "reactstrap";
import { Link } from "react-router-dom/cjs/react-router-dom";
// import { BottomNavigation, BottomNavigationAction, Box, CssBaseline, Paper } from "@mui/material";

// import ArchiveIcon from '@mui/icons-material/Archive';
// import GroupIcon from '@mui/icons-material/Group';
// import ArchivosUserComponent from "../../../views/Usuarios/ArchivosUsuario/ArchivosUserComponent";
// import MisArchivosComponent from "./MisArchivosComponent";


const ArchivosAdminComponent = ({isAdmin}) => {

  const path = useParams();

  const getAllCarpetas = async () => {
    const carpet = await getCarpetasAdmin(path.carpetapadre);
    if (!carpet){
      setCarpetas([])
    }else{
      setCarpetas(carpet)
    }
  }

  useLayoutEffect(() => {
    if (isAdmin === false){
      window.location.href = "/403-Fordibben"
    }else{
      getAllCarpetas()
    }
  },[]);

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

  const convert = fecha => {
    return ( (moment(Date.parse(fecha)).format("DD MMM YYYY HH:mm")).toString())
  }

  const [carpetas , setCarpetas] = useState([])

  const getdocumentoDownload = async (idDocumentoDowload) => {
    const getdocdowloas = await getDocumentosToDownload(idDocumentoDowload);
     //Downloaded file
    if(getdocdowloas){
      var a = document.createElement("a"); //Create <a>
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

  // const [value, setValue] = React.useState(0);
  // const [show, setShow] = useState(0);

  return (
  <>
    <Header></Header>
    <Container className="mt-5" fluid>
    <div className="content-wrapper">
            <div className="page-header">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <h3 className="page-title"> Carpetas </h3>
              </ol>
            </nav>
            </div>
            {carpetas.map((carpeta, index) =>
            <div key={index}>
            <div style={{border: '2px solid rgb(129, 125, 184)', padding:'10px', borderRadius: '10px'}}>

              <h4>Usuario : {carpeta.nombreUser}</h4>
              <div className="row">
                <div className="col-lg-12 grid-margin">
                  <div className="card">
                    <div className="card-body">
                      <div>
                        {carpeta.carpetas[0] ?
                          
                        <div className="row icons-list">
                          {carpeta.carpetas.map((carpet)=>                       
                          <div className="col-sm-6 col-md-4 col-lg-3" key={carpet.carpetaId}> 
                            <i className="mdi mdi-folder"></i><Link to={"/SISTEMA/ITBF/crm-itbf/archivosadminby-user-"+carpet.carpetaId+"-"+carpeta.userid}>{carpet.carpetaName}</Link>
                          </div>
                          )}
                        </div>
                        : <div style={{textAlign:'center'}}> <h4>Este Usuario no tiene Carpetas creadas</h4></div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row ">
                <div className="col-12 grid-margin">
                  <div className="card">
                    <div className="card-body">
                      <h4 className="card-title">Archivos</h4>
                      <div className="table-responsive">
                        {carpeta.documentos[0] ? 
                        <table className="table">
                          <thead>
                            <tr>
                              <th> #</th>
                              <th> Nombre Documento </th>
                              <th> Nro Orden </th>
                              <th> Tipo de documento </th>
                              <th> Fecha de Creacion </th>
                              <th> Ultima Modificacion </th>
                              <th> Acciones </th>
                            </tr>
                          </thead>
                          <tbody>
                            {carpeta.documentos.map((documento, index)=>
                            <tr key={documento.documentoId}>
                              <td>
                                  {index+1}
                              </td>
                              <td>
                                {MostrarImagen(documento.documentoMymeType)}
                                <span className="pl-2">
                                  {documento.documentoTitle}
                                </span>
                              </td>
                              <td> {documento.documentoId} </td>
                              <td> {MostrarTipo(documento.documentoMymeType)}</td>
                              <td> {convert(documento.documentoCreateDate)} </td>
                              <td> {convert(documento.documentoModifyDate)} </td>
                              <td>
                                <button className="btn btn-success" data-tip data-for="tool-tip-download-documento" id="botonComercioUsers" onClick={() => getdocumentoDownload(documento.documentoId )}><i className="mdi mdi-cloud-download"></i></button>
                                <ReactTooltip id="tool-tip-download-documento" place="top" type="dark" effect="float">Descargar Documento</ReactTooltip>
                              </td>
                            </tr>
                            )}
                          </tbody>
                        </table>
                        : <div style={{textAlign:'center'}}><h4>El usuario no tiene archivos creados</h4></div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br></br>
            </div>
            )}
          </div> 

      {/* <Box sx={{ pb: 7 }}>
      <CssBaseline />
      
      
      
      <Paper sx={{ top: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            setShow(newValue)
          }}
        >
          <BottomNavigationAction label="Mis Archivos" icon={<ArchiveIcon />} />
          <BottomNavigationAction label="Archivos Usuarios" icon={<GroupIcon />}/>
        </BottomNavigation>
      </Paper>
      </Box>

        { show === 0 ?  
          <MisArchivosComponent></MisArchivosComponent>
          :
          <div className="content-wrapper">
            <div className="page-header">
            <h3 className="page-title"> Carpetas </h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="#">Carpetas</a></li>
                <li className="breadcrumb-item active" aria-current="page">Directorio</li>
              </ol>
            </nav>
            </div>
            {carpetas.map((carpeta, index) =>
            <div key={index}>
            <div style={{border: '2px solid rgb(129, 125, 184)', padding:'10px', borderRadius: '10px'}}>

              <h4>Usuario : {carpeta.nombreUser}</h4>
              <div className="row">
                <div className="col-lg-12 grid-margin">
                  <div className="card">
                    <div className="card-body">
                      <div>
                        {carpeta.carpetas[0] ?
                          
                        <div className="row icons-list">
                          {carpeta.carpetas.map((carpet)=>                       
                          <div className="col-sm-6 col-md-4 col-lg-3" key={carpet.carpetaId}> 
                            <i className="mdi mdi-folder"></i><a href={"/archivosadminby-user-"+carpet.carpetaId+"-"+carpeta.userid}>{carpet.carpetaName}</a>
                          </div>
                          )}
                        </div>
                        : <div style={{textAlign:'center'}}> <h4>Este Usuario no tiene Carpetas creadas</h4></div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row ">
                <div className="col-12 grid-margin">
                  <div className="card">
                    <div className="card-body">
                      <h4 className="card-title">Archivos</h4>
                      <div className="table-responsive">
                        {carpeta.documentos[0] ? 
                        <table className="table">
                          <thead>
                            <tr>
                              <th> #</th>
                              <th> Nombre Documento </th>
                              <th> Nro Orden </th>
                              <th> Tipo de documento </th>
                              <th> Fecha de Creacion </th>
                              <th> Ultima Modificacion </th>
                              <th> Acciones </th>
                            </tr>
                          </thead>
                          <tbody>
                            {carpeta.documentos.map((documento, index)=>
                            <tr key={documento.documentoId}>
                              <td>
                                  {index+1}
                              </td>
                              <td>
                                {MostrarImagen(documento.documentoMymeType)}
                                <span className="pl-2">
                                  {documento.documentoTitle}
                                </span>
                              </td>
                              <td> {documento.documentoId} </td>
                              <td> {MostrarTipo(documento.documentoMymeType)}</td>
                              <td> {convert(documento.documentoCreateDate)} </td>
                              <td> {convert(documento.documentoModifyDate)} </td>
                              <td>
                                <button className="btn btn-success" data-tip data-for="tool-tip-download-documento" id="botonComercioUsers" onClick={() => getdocumentoDownload(documento.documentoId )}><i className="mdi mdi-cloud-download"></i></button>
                                <ReactTooltip id="tool-tip-download-documento" place="top" type="dark" effect="float">Descargar Documento</ReactTooltip>
                              </td>
                            </tr>
                            )}
                          </tbody>
                        </table>
                        : <div style={{textAlign:'center'}}><h4>El usuario no tiene archivos creados</h4></div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br></br>
            </div>
            )}
          </div> 
        } */}
      
    </Container>
  </>
  )
}

export default ArchivosAdminComponent;