import React, { useLayoutEffect, useState} from "react";
import {getMyDocumentosBitacora, getDocumentosBitacoraToDownload} from '../../../Controller/Controller';
import ReactTooltip from 'react-tooltip';
import moment from "moment";
import CircularProgress from '@mui/material/CircularProgress';
import DataTable from 'react-data-table-component'


const ExpandedComponent = ({ data }) => {

  const [pendingDocumentos, setPendingDocumentos] = useState(true)
  const [documentosBitacoras, setDocumentosBitacora] = useState([]);


  const columnsDocumentos = [
    {
        name: 'Nombre Documento',
        selector: row => row.documentoNombre,
        sortable: true,
        wrap: true,
        grow: 2,
        format: row => `${row.documentoNombre.slice(0, 200)}`,
    },
    {
      name: 'Tipo Documento',
      selector: row => row.documentoMymeType,
      sortable: true,
      grow: 1,
      style: {
          textAlign: 'center',
        },
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
        button: true,
        width: '150px',
    
    },
    ];

  const mostrarBotonAccionesDocumentos = (documentobitacoraId, DocumentoName) => {
    return (
    <div>
      <button className="btn btn-success" data-tip data-for="tool-tip-download-documento" id="botonComercioUsers" onClick={() => getdocumentoBitacoraDownload(documentobitacoraId )}><i className="mdi mdi-cloud-download"></i></button>
      <ReactTooltip id="tool-tip-download-documento" place="top" type="dark" effect="float">Descargar Documento</ReactTooltip>
    </div>)
  } 

  const convert = fecha => {
    return ( (moment(Date.parse(fecha)).format("DD MMMM YYYY")).toString())
  }

  const getDocumentosBitacora = async(idBitacora) => {
    const bitacora = await getMyDocumentosBitacora(idBitacora);
    if(bitacora[0]){
      setDocumentosBitacora([])
      setDocumentosBitacora(bitacora)
    }else{
      setDocumentosBitacora([])
    }
    setPendingDocumentos(false)
  }

  useLayoutEffect(() => {
    getDocumentosBitacora(data.bitacoraID);
  }, []);


  //*****************************************************************
  // FUNCIONES DOWLOAD DOCUMENT BITACORA
  const getdocumentoBitacoraDownload = async (idDocumentoDowload) => {
    const getdocdowloas = await getDocumentosBitacoraToDownload(idDocumentoDowload);
    //Downloaded file
    if(getdocdowloas){
      var a = document.createElement("a"); //Create <a>
      a.href = getdocdowloas.documentoDataBase64; //Image Base64 Goes here
      a.download = getdocdowloas.documentoNombre; //File name Here
      a.click();
    }
  }
  //************************************************************

  const CustomLoader = () => (
    <div style={{ padding: '24px', alignItems: 'center' }}>
      <CircularProgress />
      <div>Obteniendo Bitacoras...</div>
    </div>
  );



  return(
    <pre>
      <div style={{marginLeft:"50px", marginRight:"50px", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", marginTop:"10px", marginBottom:"10px"}}>
        <br></br>
        <div style={{paddingBottom: "15px", paddingRight: "15px", paddingLeft: "15px", color: '#646d91'}}>
          <h3>Descripcion completa</h3>
          <br></br>
          <div >
            <textarea style={{width: '100%',}} rows={5} disabled={true} defaultValue={data.bitacoraDescripcion}></textarea>
          </div>
        </div>
        { !documentosBitacoras[0] ? 
        <div style={{paddingBottom: "15px", paddingRight: "15px", paddingLeft: "15px", color: '#646d91'}}> 
          <h4>Documentos Anexados</h4>
          <div >
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
          // progressPending={false}
          progressComponent={<CustomLoader />}
          />
  
        }
   
      </div>
    </pre>
  )
}

export default ExpandedComponent