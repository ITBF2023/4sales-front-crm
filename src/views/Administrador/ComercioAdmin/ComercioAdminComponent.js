import React, { useLayoutEffect, useState} from "react";
import '../../../assets/css/comercio.css'
import { deleteCompany, getAllCompanies} from '../../../Controller/Controller';
import moment from "moment";

import DataTable from 'react-data-table-component'
import Header from "../../../components/Headers/Header";
import { Button, Container } from "reactstrap";
import { Link } from "react-router-dom";
import { CircularProgress, Tooltip, Button as ButtonMUI} from "@mui/material";

const ComercioAdminComponent = ({isAdmin}) => {

  const columns = [
    {
      name: '#',
      selector: row => row.companyID,
      sortable: true,
      width: "60px"
    },
    {
      name: 'Razon Social',
      selector: row => mostrarRazonSocial(row.companyImage, row.companyRazonSocial, row.compañiaServiciosId),
      sortable: true,
      grow: 2
    },
    {
      name: 'NIT',
      selector: row => row.companyNIT,
      sortable: true,
      grow: 1.5
    },
    {
      name: 'Contacto Principal',
      selector: row => row.contactoPrincipal,
      sortable: true,
      grow: 1.5
    },
    {
      name: 'Direccion',
      selector: row => row.companyAddress,
      sortable: true,
      grow: 1.5
    },
    {
      name: 'Fecha de Creación',
      selector: row => convert(row.companyCreateDate),
      sortable: true
    },
    {
      name: 'Acciones',
      selector: row => mostrarBotonVerMas(row.compañiaServiciosId),
      width: "140px"
    },
  ];

  const DeleteCompany = async(id ) => {
    if (window.confirm("Esta Seguro de eliminar esta compañia")) {
      await deleteCompany(id);
      getCompanies();
    }
  }

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

  const mostrarBotonVerMas = (empresaid) => {
    return( 
    <>
      <Link to={"/SISTEMA/ITBF/crm-itbf/companyadmin-sucursal/"+empresaid}>
        <Tooltip title="Ir a la descripcion del comercial">
          <ButtonMUI variant="contained" size="small" className="botonEliminarCompañia">Ver +</ButtonMUI>
        </Tooltip>
      </Link>
      <Tooltip title="Eliminar Compañia">
        <ButtonMUI variant="contained" size="small" onClick={() => DeleteCompany(empresaid)} className="botonEliminarCompañia" ><i className='mdi mdi-trash-can'></i></ButtonMUI>
      </Tooltip>
    </>)
  } 


  const getCompanies = async () => {
    const comp = await getAllCompanies()
    // console.log(comp)
    if(comp[0].compañiaId != 0){
      setcompanies(comp)
      setcompaniesRespaldo(comp)
      setPending(false)
    }else{
      setcompanies([])
      setcompaniesRespaldo([])
      setPending(false)
    }
  }

  const convert = fecha => {
    return ( (moment(Date.parse(fecha)).format("DD MMM YYYY")).toString())
  }

  useLayoutEffect(() => {
    if (isAdmin === false){
      window.location.href = "/403-Fordibben"
    }else{
      getCompanies();
    }
    
  }, []);

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

  return(
    <>
      <Header></Header>
      <Container className="mt-5" fluid>
        <div className="content-wrapper">
          <div className="page-header">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <h3 className="page-title"> Fuerza de ventas </h3>
              </ol>
            </nav>
          </div>
          <div className="row ">
              <div className="col-12 grid-margin">
                <div className="card">
                  <div className="card-body">
                    <div className="page-header">
                      <h3 className="page-title"> Todas las Empresas </h3>
                      <form className="nav-item w-50" style={{float:"right"}}>
                        <input type="text" className="form-control" onChange={e => getSearchCompanies(e.target.value)} placeholder="Buscar por Razon Social / NIT / Contacto / Direccion"/>
                      </form>
                    </div>
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
                      progressPending={pending}
                      progressComponent={<CustomLoader />}
                    />
                    
                  </div>
                </div>
              </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default ComercioAdminComponent;