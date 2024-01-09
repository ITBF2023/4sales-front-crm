import React, { useLayoutEffect, useState} from "react";
          
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Row, Col, CardBody, CustomInput, Card, CardText, CardTitle} from 'reactstrap';

import { useParams } from "react-router-dom";

import { getUserId, postGestionCaso, getCasosByCompany} from '../../../../Controller/Controller';

import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";

const GestionCasosComponent = () => {

  const modalStyles={
    top: '10%',
  }

  const styleLink={
    color: "gray",
    backgroundColor:"red"
  }

  let path = useParams()

  // Datos Gestios Casos

  const [modalCasos, setModalCasos] = useState(false);
  const [prioridad, setPrioridad] = useState("");
  const [nombreClienteCaso, setNombreClienteCaso] = useState("");
  const [descripcionCaso, setDescripcionCaso] = useState("");
  const [crearCasoDisabled, setCrearCasoDisabled] = useState(false);
  const [casosObtenidos, setCasosobtenidos] = useState([]);

  const abrirModalCasos = () => {
    setModalCasos(!modalCasos)
  }

  const CrearCaso = async() => {
    setCrearCasoDisabled(true)
    const form = new FormData();
    form.append('NombreCliente',nombreClienteCaso);
    form.append('DescripcionCaso',descripcionCaso);
    form.append('Prioridad',prioridad);
    form.append('EncargadoCaso',getUserId());
    form.append('CompañiaServicioId',path.id);

    const caso = await postGestionCaso(form)
    if(caso === "OK"){
      alert("Caso Creado")
      setCrearCasoDisabled(false)
      abrirModalCasos()
      setNombreClienteCaso("")
      setDescripcionCaso("")
      setPrioridad("")
      ObtenerCasosCreados()
    }
  }
  
  const ObtenerCasosCreados = async() => {
    const casos = await getCasosByCompany(path.id)
    if(casos[0]){
      setCasosobtenidos(casos)
    }else{
      setCasosobtenidos([])
    }
  }

  const ObtenerPrioridad = (prioridad) => {
    switch(prioridad){
      case "BAJA":
        return {border: "1px solid rgb(62, 210, 221)"}
      case "MEDIA":
        return {border: "1px solid rgb(255, 230, 0)"}
      case "ALTA":
        return {border: "1px solid rgb(255, 131, 131)"}
      default:
        return {}
    }
  }

  const FiltrarCasos = (valor) =>{

  }


  useLayoutEffect(() => {
    ObtenerCasosCreados()
  }, []);

  return(
    <>
      <Row>
      <Col xl="12">
        <div style={{display:"flex", margin:"20px 20px 0 20px"}}>
          <div style={{width:"100%"}}>
            <h3 className="page-title"> Gestion de Casos</h3>
          </div>
          <div >
            <Button style={{display:"flex", height:"auto"}} color="info" onClick={abrirModalCasos}><AddIcon color="white" fontSize="small" style={{float:"left"}}/>Crear</Button>
          </div>
        </div>
      </Col>
      {/* <Col xl="12">
        <CardBody>
          Filtrar Casos:
          <CustomInput type="select" id="FiltroCasos" name="FiltroCasos" onChange={e => FiltrarCasos(e.target.value)}>
            <option value={"TODOS"}>Todos</option>
            <option value={"RECIBIDO"}>Recibidos</option>
            <option value={"EN PROCESO"}>En proceso</option>
            <option value={"RESUELTO"}>Resueltos</option>
          </CustomInput>
        </CardBody>
      </Col> */}
      </Row>
      <Row style={{maxHeight:"600px", overflow:"scroll", overflowX:"hidden"}} id="style-scrollbar">
        {casosObtenidos.map((caso) =>
            <div key={caso.casoId} style={{width:"100%", padding:"1% 3% 1% 5%"}}>
              <Link to={"/SISTEMA/ITBF/crm-itbf/GestionDeCaso/"+caso.casoId} style={styleLink}>
              {/* <Link to={"index"} style={styleLink}>x */}
                <Card style={ObtenerPrioridad(caso.prioridad)}>
                  <CardBody>
                    <div style={{display:"block", float:"right"}}>
                      <h5 style={{color:"gray", fontFamily:"'PT Sans', sans-serif"}}>P: {caso.prioridad}</h5>
                      <h5 style={{color:"gray", fontFamily:"'PT Sans', sans-serif"}}>E: {caso.estado}</h5>
                    </div>
                    {caso.descripcionCaso != null ? <div>
                      {caso.descripcionCaso.substring(0, 100)}...
                    </div>:<>caso.descripcionCaso</>}
                    
                  </CardBody>
                </Card>
              </Link>
            </div>
        )}
      </Row>  
          
      <Modal isOpen={modalCasos} style={modalStyles}>
        <ModalHeader>
          Crear nuevo Caso
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="nombreClienteCaso">Nombre del cliente</Label>
            <Input type="text" id="nombreClienteCaso" onChange={e => setNombreClienteCaso(e.target.value)}/>
            <Label for="descripcionCaso">Descripcion</Label>
            <Input type="textarea" id="descripcionCaso" onChange={e => setDescripcionCaso(e.target.value)}/>
            <Label for="prioridadCaso">Prioridad</Label>
            <CustomInput type="select" id="prioridadCaso" name="prioridadCaso" onChange={e => setPrioridad(e.target.value)}>
              <option value="">Selecciona una prioridad</option>
              <option value={"BAJA"}>BAJA</option>
              <option value={"MEDIA"}>MEDIA</option>
              <option value={"ALTA"}>ALTA</option>
            </CustomInput>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
            <Button disabled={crearCasoDisabled} color="primary" onClick={() => CrearCaso()}>Crear</Button>
            <Button color="secondary" onClick={abrirModalCasos}>Cerrar</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default GestionCasosComponent;