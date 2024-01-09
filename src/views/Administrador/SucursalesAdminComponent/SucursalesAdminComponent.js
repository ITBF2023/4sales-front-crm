import React, { useLayoutEffect, useState} from "react";
import moment from "moment";

import { getSucursalbyCompany, getCompanybyID, getBitacoraByCompany, deleteBitacora, getCountDocumentBitacora} from '../../../Controller/Controller';

// import '../../assets/css/tarjetaPresentacion.css'
import '../../../assets/css/ViewStyles/sucursalComponent.css'
import '../../../assets/css/ViewStyles/sucursalChooseComponent.css'
import { useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import ReactTooltip from 'react-tooltip';


import DataTable from 'react-data-table-component'
import { Container, Row, Button} from "reactstrap";
import Header from "../../../components/Headers/Header";

import ExpandedComponent from "./ExpandedComponent";

const SucursalesAdminComponent = () => {

  const mostrarBotonAcciones = (bitacorId) => {
    return <div className="AccionesBotonesBitacoras">
      <Button color="info" size="sm"data-tip data-for="tooltip-Eliminar-Bitacora" onClick={() => EliminarBitacora(bitacorId)}><i className='mdi mdi-delete-empty'></i></Button>
      <ReactTooltip id="tooltip-Eliminar-Bitacora" place="top" type="dark" effect="float">Eliminar Bitacora</ReactTooltip>
    </div>
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
      name: 'Creado',
      selector: row => <div className="form-check-muted m-0" style={{textAlign: 'center'}}>
      <label className="form-check-label">
          <input type="checkbox"  disabled={true} checked />
      </label>
      </div>,
      center: true,
      allowOverflow: true,
      button: true,
      width: '150px',
  },
  {
    name: 'Acciones',
    selector: row => mostrarBotonAcciones(row.bitacoraID),
    center: true,
    allowOverflow: true,
    button: true,
    width: '150px',
},
  ];

  let path = useParams()

  const getId = () =>{
    let path = window.location.pathname;
    let arraypath = path.split('/');
    let id = arraypath[(arraypath.length-1)]
    return id
  }

  const getSucursales = async() => {
      const sucu = await getSucursalbyCompany(getId());
      if (!sucu[0]){
        setSucursales([]);
      }else{
        setSucursales(sucu);
      }
  }

  const getCompany = async() => {
    const compan = await getCompanybyID(getId());
    // console.log(compan)
    if (!compan){
      setCompany({});
    }else{
      setCompany(compan);
    //   console.log(compan)
    }
  }

  const convert = fecha => {
    return ( (moment(Date.parse(fecha)).format("DD MMMM YYYY")).toString())
  }

  useLayoutEffect(() => {
    getSucursales();
    getCompany();
    getBitacora();
  }, []);

  const [sucursales, setSucursales] = useState([]);
  const [company, setCompany] = useState({});
  const [bitacoras, setBitacora] = useState([]);


  const [pending, setPending] = useState(true)



  const getBitacora = async() => {
    const bitacora = await getBitacoraByCompany(path.id);
    if(!bitacora[0]){
        setBitacora([])
    }else{
      setBitacora(bitacora)
      setPending(false)

    }
  }

  const CustomLoader = () => (
    <div style={{ padding: '24px', alignItems: 'center' }}>
      <CircularProgress />
      <div>Obteniendo Bitacoras...</div>
    </div>
  );

  return(
  <>
    <Header></Header>
    <Container className="mt-5" fluid>
      <div className="col">
        <div className="page-header">
          <h3 className="page-title"> {company?.companyRazonSocial} </h3>
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
        </div><br></br>
        <div className="row">
                    <div className="col-12 grid-margin">
                        <div className="card">
                        <div className="card-body">
                            <div className="page-header">
                            <h3 className="page-title"> Bitacora Compañia {company.companyRazonSocial} </h3>
                            
                            </div>

                              {bitacoras[0] ? 
                                <DataTable
                                columns={columns}
                                data={bitacoras}
                                pagination
                                theme="Bitacoras"
                                paginationComponentOptions={{
                                    rowsPerPageText: 'Filas por Página',
                                    rangeSeparatorText: 'de',
                                    selectAllRowsItem: true,
                                    selectAllRowsItemText: 'Todos'
                                }}
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
                                />
                                : <div style={{textAlign:'center'}}><h4>No hay bitacoras creadas</h4> </div>}

                          </div>
                        </div>
                    </div>
                </div>
        <div className="page-header">
          <h3 className="page-title"> Personas de Contacto Asociadas </h3>
        </div>
        <div className="row">
          <div className="container-card-sucursal">
            <div >
              {(sucursales.length === 0) ? 
                (<div className="row">
                  <div className="container-card-company">
                    <div className="card">
                      <h1>No hay contactos para mostrar</h1>
                    </div>
                  </div>
                </div>) :
                (
                  <div className="container">
                  {sucursales.map((sucursal) => 
                    <div className="card" key={sucursal.sucursalID}>
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
                        <h4></h4>
                        <h5>Cargo Contacto</h5>
                        <p>{sucursal.sucursalCargoContacto}</p>
                        <h5>Correo Contacto</h5>
                        <p>{sucursal.sucursalCorreoContacto}</p>
                          {/* <a href={"/bitacora-sucursal-"+sucursal.sucursalID} className="nav-link btn btn-success create-new-button">Ir a Bitacora <i className="mdi mdi-arrow-top-right"></i><i className="mdi mdi-link"></i> </a> */}
                      </div>
                    </div>

                  )}
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </Container>
  </>
  )
}

export default SucursalesAdminComponent;