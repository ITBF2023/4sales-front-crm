import React, { useLayoutEffect, useState } from 'react';
// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Container,
    Row,
    Col
  } from "reactstrap";
import { Link } from "react-router-dom";

import Header from "../../../components/Headers/Header.js";
import { getUserById, getUserId, updateCambioContraseñaPropioUsuario, updateDatosPersonalesUsuario, updateUser } from '../../../Controller/Controller.js';

const DatosPersonalesComponent = (props) => {

  const userString = localStorage.getItem('usuario');
  const usuario = JSON.parse(userString);

  const [password, setPassword] = useState("");
  const [passwordRepetido, setPasswordRepetido] = useState("");
  const [passwordtrue, setPasswordtrue] = useState(true);

  const [mensajeError, setmensajeError] = useState("");

  const [nombre, setnombre] = useState("");
  const [apellido, setapellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setemail] = useState("");

  const getInformacionUsuario = async () => {
    const informacion = await getUserById(getUserId())
    if(informacion?.userId){
      setnombre(informacion?.userName ?? "")
      setapellido(informacion?.userLastname ?? "")
      setTelefono(informacion?.userPhone ?? "")
      setCelular(informacion?.userCellPhone ?? "")
    }
    
  }

  useLayoutEffect(() => {
    getInformacionUsuario()
    // console.log(usuario)
  },[])

  const EditarValoresPerfil  = async (e) => {
    e.preventDefault()

    let datosPerfil = new FormData()
    datosPerfil.append('NombreUsuario', nombre)
    datosPerfil.append('ApellidoUsuario', apellido)
    datosPerfil.append('TelefonoUsuario', telefono)
    datosPerfil.append('CelularUsuario', celular)
    datosPerfil.append('ImagenUsuario', "")
    datosPerfil.append('ImagenData', null)

    const actualizar = await updateDatosPersonalesUsuario(datosPerfil, getUserId());
    if(actualizar.status === 201){
      alert("Datos Personales Actualizados")
      getInformacionUsuario()
    }else{
      alert("Error")
    }
  }

  const CambiarContraseña  = async (e) => {
    e.preventDefault()

    let datosContraseña = new FormData()
    datosContraseña.append('NuevaContraseña', password)

    const actualizar = await updateCambioContraseñaPropioUsuario(datosContraseña, getUserId());
    if(actualizar.status === 201){
      alert("ContraseñaActualizada")
      setPassword("")
      setPasswordRepetido("")
      setmensajeError("")
      setPasswordtrue(true)
    }else{
      alert("Error")
    }
  }

  const CoincidirContraseña = (valor, valorRepetido) => {
    setPassword(valor)
    setPasswordRepetido(valorRepetido)
    if (valorRepetido === valor){
      setPasswordtrue(false)
      setmensajeError("")
    }else{
      setmensajeError("Las contraseñas no coinciden")
      setPasswordtrue(true)
    }
  }

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt-5" fluid>  
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Mi Cuenta</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <h6 className="heading-small text-muted mb-4">
                  Informacion de Usuario
                </h6>
                <div className="pl-lg-4">
                <Form role="form" onSubmit={EditarValoresPerfil}>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-first-name"
                        >
                          Nombre
                        </label>
                        <Input
                          className="form-control-alternative"
                          defaultValue={nombre}
                          id="input-first-name"
                          placeholder="Ingrese su nombre"
                          type="text"
                          onChange={(e) => setnombre(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-last-name"
                        >
                          Apellido
                        </label>
                        <Input
                          className="form-control-alternative"
                          defaultValue={apellido}
                          id="input-last-name"
                          placeholder="Ingrese su apellido"
                          type="text"
                          onChange={(e) => setapellido(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-telefono-user"
                        >
                          Telefono
                        </label>
                        <Input
                          className="form-control-alternative"
                          defaultValue={telefono}
                          id="input-telefono-user"
                          placeholder="Ingrese un telefono"
                          type="text"
                          onChange={(e) => setTelefono(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-celular-user"
                        >
                          Celular
                        </label>
                        <Input
                          className="form-control-alternative"
                          defaultValue={celular}
                          id="input-celular-user"
                          placeholder="Ingrese su numero de celular"
                          type="text"
                          onChange={(e) => setCelular(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <br></br>
                  <Row>
                    <Col lg="8">
                    </Col>
                    <Col className="text-right" xs="4">
                        {/* <Link> */}
                            <Button color="primary" type="submit">
                                Guardar Cambios
                            </Button>
                        {/* </Link> */}
                    </Col>
                  </Row>
                </Form>
                </div>
                <hr className="my-4" />
                {/* Address */}
                <div className="pl-lg-4">
                  <Form role="form" onSubmit={CambiarContraseña}>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="label-contraseña"
                          >
                            Contraseña
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-contraseña"
                            type="password"
                            placeholder='Ingresa la nueva contraseña' value={password}
                            onChange={(e) => CoincidirContraseña(e.target.value, passwordRepetido)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="label-repetir-contraseña"
                          >
                            Contraseña
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-repetir-contraseña"
                            type="password"
                            placeholder='Repite la contraseña' value={passwordRepetido}
                            onChange={(e)=> CoincidirContraseña(password,e.target.value)}
                          />
                          <label style={{color:"red"}}>
                            {mensajeError}
                          </label>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="8">
                      </Col>
                      <Col className="text-right" xs="4">
                          {/* <Link> */}
                              <Button color="primary" type="submit" disabled={passwordtrue}>
                                  Cambiar contraseña
                              </Button>
                          {/* </Link> */}
                      </Col>
                    </Row>
                  </Form>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DatosPersonalesComponent;
