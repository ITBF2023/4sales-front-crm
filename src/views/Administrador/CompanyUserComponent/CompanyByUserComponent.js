import React, { useLayoutEffect, useState} from "react";
import '../../../assets/css/comercio.css'
import { getAllMyCompanies, getUserById } from '../../../Controller/Controller';
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import { Container } from "reactstrap";
import Header from "../../../components/Headers/Header";
import DataTable from 'react-data-table-component'
import { CircularProgress } from "@mui/material";

const CompanyByUserComponent = ({isAdmin}) => {

  var param = useParams()

  const [companies, setcompanies ] = useState([]);
  const [usuario, setUsuario ] = useState([]);

  const getCompanies = async () => {
    const comp = await getAllMyCompanies(param.id)
    if(comp[0].compañiaServiciosId != 0){
      setcompanies(comp)
      setPending(false)
    }else{
      setcompanies([])
      setPending(false)
    }
  }

  const getUserData = async () => {
    const get_user = await getUserById(param.id)
    // console.log(get_user)
    setUsuario(get_user)
  }

  const convert = fecha => {
    return ( (moment(Date.parse(fecha)).format("DD MMM YYYY")).toString())
  }

  useLayoutEffect(() => {
    if (isAdmin === false){
      window.location.href = "/403-Fordibben"
    }else{
      getCompanies();
      getUserData()
    }
    
  }, []);

  const columns = [
    {
      name: '#',
      selector: row => row.compañiaId,
      sortable: true,
      grow: 0.5
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
      selector: row => <Link className='btn' id='botonComercioUsers' to={"companyadmin-sucursal/"+ row.compañiaServiciosId }>Ver +</Link>,
    },
];


  const mostrarRazonSocial = (imagen ,razonSocial,empresaid) => {
    return(
      <div style={{paddingTop: '15px', paddingBottom: '15px'}}>
        <div style={{display: 'flex'}}>
          <img src={('Images/Companies/'+imagen)}  alt='i' width='30px'  style={{borderRadius:'50%', height:'30px'}} />
          <div style={{paddingLeft: '10px', paddingTop: '5px'}}>
            <Link to={'companyadmin-sucursal/' + empresaid  }>{razonSocial}</Link>
          </div>
        </div>
      </div>
    )
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
          <div className="row ">
            <div className="col-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <div className="page-header">
                    <h3 className="page-title"> Empresas a Cargo del Usuario: <span style={{color: 'green'}}>{usuario.userName}</span></h3>
                  </div>

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
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default CompanyByUserComponent;