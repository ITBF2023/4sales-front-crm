import React, { useState , useLayoutEffect} from "react";

import { getAllMyCompanies, deleteCompany, getUserId} from '../../../Controller/Controller';

import '../../../assets/css/ViewStyles/mantenimientoCompanies.css';

import DataTable from 'react-data-table-component'

import Header from "../../../components/Headers/Header";
import { Button, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";


const MantenimientoCompaniesComponent = ({isAdmin}) => {

  const mostrarRazonSocial = (imagen ,razonSocial,empresaid) => {
    return(
      <div style={{paddingTop: '15px', paddingBottom: '15px'}}>
        <div style={{display: 'flex'}}>
          <img src={('Images/Companies/'+imagen)}  alt='i' width='30px'  style={{borderRadius:'50%', height:'30px'}} />
          <div style={{paddingLeft: '10px', paddingTop: '5px'}}>
            <Link to={'/SISTEMA/ITBF/crm-itbf/actualizarDatosEmpresa-' + empresaid  }>{razonSocial}</Link>
          </div>
        </div>
    </div>
    )
  }
    
  const mostrarBotonAcciones = (empresaid) => {
    return (
      <div style={{display: "flex"}}>
        <Button color="info" size="sm"><Link style={{color:"white"}} to={'/SISTEMA/ITBF/crm-itbf/actualizarDatosEmpresa-'+ empresaid}><i className='mdi mdi-account-edit'></i></Link></Button>
        {/* <Button color="info" size="sm" onClick={() => DeleteCompany(empresaid)}><i className='mdi mdi-trash-can'></i></Button> */}
      </div>
    )
  } 

  const columns = [
    {
      name: '#',
      selector: row => row.compañiaId,
      sortable: true,
      grow: 0.5
    },
    {
        name: 'Razon Social',
        selector: row => mostrarRazonSocial(row.companyImage, row.companyRazonSocial,row.compañiaServiciosId),
        sortable: true,
        grow: 2
    },
    {
        name: 'NIT',
        selector: row => row.companyNIT,
        sortable: true,
        grow: 1
    },
    {
      name: 'Direccion',
      selector: row => row.companyAddress,
      sortable: true,
      grow: 1.5
    },
    {
      name: 'Correo Principal',
      selector: row => row.correoPrincipal,
      sortable: true,
      grow: 1.5
    },
    {
      name: 'Ciudad',
      selector: row => row.companyCity,
      sortable: true
    },
    {
      name: 'Acciones',
      selector: row => mostrarBotonAcciones(row.compañiaServiciosId),
    },
  ];


  const getCompanies = async () => {
    const company = await getAllMyCompanies(getUserId());
    if(!company[0].compañiaServiciosId){
      setCompanies([])
      setCompaniesRespaldo([])
    }else{
      setCompanies(company)
      setCompaniesRespaldo(company)
    }
  }
    
  useLayoutEffect(() => {
    if (isAdmin === true){
      window.location.href = "/*"
    }else{
      getCompanies();
    }
    
  }, [isAdmin]);

  const DeleteCompany = async(id ) => {
    if (window.confirm("Esta Seguro de eliminar esta compañia")) {
      await deleteCompany(id);
      getCompanies();
    }
  }

  const getSearchCompanies = async (cadena) => {
    const compañiasnuevas = [...companiesRespaldo]

    if(cadena.trim()=== "" || cadena.trim().length === 0){
      setCompanies(compañiasnuevas)
    }else{
      const result = compañiasnuevas.filter(compa => compa.companyRazonSocial?.toLowerCase().includes(cadena.toLowerCase()) 
                                        || compa.companyNIT?.toLowerCase().includes(cadena.toLowerCase()) 
                                        || compa.correoPrincipal?.toLowerCase().includes(cadena.toLowerCase()) 
                                        || compa.companyCity?.toLowerCase().includes(cadena.toLowerCase()))

      setCompanies(result)
    }
  }

  const [companies, setCompanies ] = useState([]);
  const [companiesRespaldo, setCompaniesRespaldo ] = useState([]);

  return(
  <>
  <Header></Header>
  <Container className="mt-5" fluid>
    <Row>
      <div className="col">
          <div className="main-panel">
            <div className="content-wrapper">
              <div className="page-header">
              <h3 className="page-title"> Empresas Registradas </h3>
              </div>
              <div className="row">
                  <div className="col-lg-12 grid-margin stretch-card">
                      <div className="card">
                      <div className="card-body">
                          <div className="page-header">
                              <h3 className="page-title"> Tabla de Empresas </h3>
                              <form className="nav-item w-50" style={{float:"right"}}>
                                  <input type="text" className="form-control" onChange={e => getSearchCompanies(e.target.value)}  placeholder="Buscar"/>
                              </form>
                          </div>
                          <br></br>
                          <br></br>
                          <br></br>
                          <div className="table-responsive">
                              <DataTable
                                  columns={columns}
                                  data={companies}
                                  pagination
                                  theme="mantenimientoCompanies"
                                  paginationComponentOptions={{
                                      rowsPerPageText: 'Filas por Página',
                                      rangeSeparatorText: 'de',
                                      selectAllRowsItem: true,
                                      selectAllRowsItemText: 'Todos'
                                  }}
                                  fixedHeader
                                  fixedHeaderScrollHeight="600px"
                              />
                          </div>
                      </div>
                      </div>
                  </div>
              </div>
            </div>
          </div>
      </div>
      </Row>
  </Container>
  </>
  )
}

export default MantenimientoCompaniesComponent;