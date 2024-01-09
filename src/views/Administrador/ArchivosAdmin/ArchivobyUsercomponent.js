import React, { useLayoutEffect, useState } from "react";

import '../../../assets/css/ViewStyles/archivosAdmin.css'
import { useParams } from "react-router-dom";

import ReactTooltip from 'react-tooltip';

import {getCarpetasByUser, getDocumentosByUser, getDocumentosToDownload} from '../../../Controller/Controller'
import moment from "moment";
import Header from "../../../components/Headers/Header";
import { Container } from "reactstrap";
import { Link } from "react-router-dom/cjs/react-router-dom";


const ArchivosByUserComponent = ({isAdmin}) => {

  const path = useParams();

  const getAllCarpetas = async () => {
    const carpet = await getCarpetasByUser(path.carpetapadre ,path.userId);
    if (!carpet){
      setCarpetas([])
    }else{
      setCarpetas(carpet)
    }
  }

  const getdocumentos = async () => {
    const getdoc = await getDocumentosByUser(path.carpetapadre,path.userId);
    // console.log(getdoc)
    if(!getdoc){
      setDocumentos([])
    }else{
      setDocumentos(getdoc)
    }
  }

  useLayoutEffect(() => {
    if (isAdmin === false){
      window.location.href = "/403-Fordibben"
    }else{
      getAllCarpetas()
      getdocumentos()
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
  const [documentos , setDocumentos] = useState([])

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


  return (
  <>
    <Header></Header>
    <Container className="mt-5" fluid>
      <div className="content-wrapper">
        <div className="row" >
          <div className="col-lg-12 grid-margin" >
            <div className="card" style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
              <div className="card-body">
                <h4 className="card-title">Carpetas</h4>

                {carpetas[0] ? 
                <div className="row icons-list">
                  {carpetas.map((carpeta) => 
                    <div className="col-sm-6 col-md-4 col-lg-3" key={carpeta.carpetaId}>
                      <i className="mdi mdi-folder"></i><a href={"/SISTEMA/ITBF/crm-itbf/archivosadminby-user-"+carpeta.carpetaId+"-"+carpeta.userId}>{carpeta.carpetaName}</a>
                    </div>
                  )}
                </div>
                : <div style={{textAlign:'center'}}> <h4>No hay carpetas creadas</h4></div> }
              </div>
            </div>
          </div>
        </div>
        <br></br>        
        <div className="row ">
          <div className="col-12 grid-margin">
            <div className="card" style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
              <div className="card-body">
                <h4 className="card-title">Archivos</h4>
                <div className="table-responsive">
                  {documentos[0] ? 
                  <table className="table" style={{border: '2px solid green !important'}}>
                    <thead>
                      <tr>
                        <th> #</th>
                        <th> Nombre Documento </th>
                        <th> Nro Orden </th>
                        {/* <th> Propietary </th> */}
                        <th> Tipo de documento </th>
                        <th> Fecha de Creacion </th>
                        <th> Fecha de Modificacion </th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentos.map((documento, index)=>
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
                          {/* <td> ITBF </td> */}
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
                  : <div style={{textAlign:'center'}}><h4>No hay documentos creados</h4> </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
          
  </>
  )
}

export default ArchivosByUserComponent;