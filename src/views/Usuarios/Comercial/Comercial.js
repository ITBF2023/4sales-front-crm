import {Button, Card, CardHeader, Container, Row } from "reactstrap";

import '../../../assets/css/comercio.css'
import React, { useLayoutEffect, useState} from "react";

import { getAllMyCompanies, getUserId} from '../../../Controller/Controller';
import DataTable from 'react-data-table-component'
import Header from "../../../components/Headers/Header.js";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
  
  const Comercial = () => {

  const mostrarRazonSocial = (imagen ,razonSocial, empresaid) => {
    return (
      <div style={{paddingTop: '15px', paddingBottom: '15px'}}>
        <div style={{display: 'flex'}}>
          <img src={('Images/Companies/'+imagen)}  alt='i' width='30px'  style={{borderRadius:'50%', height:'30px'}} />
          <div style={{paddingLeft: '10px', paddingTop: '5px'}}>
            <Link to={'/SISTEMA/ITBF/crm-itbf/companie-sucursal/' + empresaid  }>{razonSocial}</Link>
          </div>
        </div>
    </div>
    )
  }
    
  const mostrarBotonVerMas = (empresaid) => {
    return <Button color="info" size="sm"><Link style={{color:"white"}} to={'/SISTEMA/ITBF/crm-itbf/companie-sucursal/' + empresaid }>Ver +</Link></Button>
  } 
    
  const columns = [
    {
      name: '',
      selector: row => "",
      sortable: true,
      width: "1px"
    },
    {
      name: 'Razon Social',
      selector: row => mostrarRazonSocial(row.companyImage, row.companyRazonSocial, row.compañiaServiciosId),
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
      selector: row => row.fechaFormateada, 
      sortable: true
    },
    {
      name: 'Acciones',
      selector: row => mostrarBotonVerMas(row.compañiaServiciosId),
    },
  ];
  
  const [companies, setcompanies ] = useState([]);
  const [companiesRespaldo, setCompaniesRespaldo ] = useState([]);

  const getCompanies = async () => {
    const comp = await getAllMyCompanies(getUserId())
    if (!comp[0]) {
      setcompanies([])
      setCompaniesRespaldo([])
      setPending(false)
    }else{
      setcompanies(comp)
      setCompaniesRespaldo(comp)
      setPending(false)
    }
  }
  
  const getSearchCompanies = async (cadena) => {
    const compañiasnuevas = [...companiesRespaldo]

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

  useLayoutEffect(() => {
    // if(isAdmin){
    //   window.location.href = "/indexadmin"
    // }else{
    getCompanies()
    // }
    
  }, []);

  const [pending, setPending] = useState(true)

  const CustomLoader = () => (
    <div align='center' style={{ padding: '24px', alignItems: 'center' }}>
      <CircularProgress />
      <div>Obteniendo Compañias...</div>
    </div>
  );

    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt-5" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Comercial</h3>
                  <div className="page-header">
                    <form className="nav-item w-50" style={{float:"right", display:"flex"}}>
                      <label style={{marginTop:"auto", marginRight:"10px"}}>Filtro</label>
                      <input type="text" className="form-control" onChange={e => getSearchCompanies(e.target.value)} placeholder="Buscar"/>
                    </form>
                  </div>
                </CardHeader>
                
                <DataTable
                  columns={columns}
                  data={companies}
                  pagination
                  theme="solarized"
                  fixedHeaderScrollHeight="600px"
                  highlightOnHover
                  pointerOnHover
                  progressPending={pending}
                  progressComponent={<CustomLoader />}
                />
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  };
  
  export default Comercial;
  