import React, { useState , useLayoutEffect} from "react";

import { updateUserExternoFixYouWeb, getUserExternosFixYouWebById} from '../../../../Controller/Controller';

import '../../../../assets/css/ViewStyles/registerUser.css';
import { Container } from "reactstrap";
import Header from "../../../../components/Headers/Header";
import AlertComponent from "../../../Usuarios/AlertComponent/AlertComponent";
import { Link, useHistory } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom";

const EditarUsuariosFixYouComponent = ( {isAdmin} ) => {


    useLayoutEffect(() => {
      if (isAdmin === false){
          window.location.href = "/403-Fordibben"
      }else{
        ObtenerDatosUsuario()
      }
        
    }, []);  

    const imagenDefault = require('../../../../assets/images/components/user-default.png');
    const imageform = require('../../../../assets/images/components/user-form.png');

    const [rolUsuario, setRol] = useState("3");

    const [userNombre, setUserNombre] = useState("");
    const [userCorreo, setUserCorreo] = useState("");
    const [userDireccion, setUserDireccion] = useState("");
    const [userCellPhone, setUserCellPhone] = useState("");
    const [userNumeroIdentidad, setUserNumeroIdentidad] = useState("");

    const [alert , setAlert] = useState(true)
    const [mensa , setMensaje] = useState(true)
    const [erro , setError] = useState(true)

    // const hiddenFileInput = React.useRef(null);
    const history = useHistory()
    const path = useParams();

    const ObtenerDatosUsuario = async() => {
      const datos = await getUserExternosFixYouWebById(path.id)
    //   console.log(datos)
      if(datos.usuarioId > 0){
        setUserNombre(datos.usuarioNombre)
        setUserCorreo(datos.usuarioCorreo)
        setUserDireccion(datos.usuarioDireccion)
        setUserCellPhone(datos.usuarioTelefono1)
        setUserNumeroIdentidad(datos.usuarioNumeroIdentificacion)
        setRol(datos.perfilId+"")
      }
    }

    const RegisterUser = async() =>{
      let formData = new FormData()
      formData.append('usuarioNombre', userNombre)
      formData.append('usuarioDireccion', userDireccion)
      formData.append('usuarioTelefono1', userCellPhone)
      formData.append('tipoIdentificacionId', '1')
      formData.append('usuarioNumeroIdentificacion', userNumeroIdentidad)
      formData.append('UsuarioCorreo', userCorreo)
      formData.append('perfilId', rolUsuario)
      formData.append('usuarioActivo', true)

    //   console.log(rolUsuario)
      
      const register = await updateUserExternoFixYouWeb(formData, path.id)
      if(register === "OK"){
        setError(false)
        setMensaje("El usuario se actualizo exitosamente")
        setAlert(false)
        setTimeout(() => {
            history.push("EdicionUsuarioFixYou");
        }, 2000);
      }else if (register === "ERROR") {
        setError(true)
        setMensaje("Ocurrio un problema inesperado")
        setAlert(false)
      }else{
        setError(true)
        setMensaje(register)
        setAlert(false)
      }
    }

    const handleSubmit= async e => {
        e.preventDefault();
        RegisterUser();
    }

    // const changeImage = e => {
    //     if (e.target.files && e.target.files[0]){
    //         let imageFil = e.target.files[0];
    //         const reader = new FileReader();
    //         reader.onload = x => {
    //             setImagensrc(x.target.result)
    //             // console.log(x.target.result)
    //             setImagenfile(imageFil)
    //         }
    //         reader.readAsDataURL(imageFil)
    //     }else{
    //         setImagensrc(imagenDefault)
    //         setImagenfile(null)
    //     }
    // }

    // const clickInputFile = () => {
    //     hiddenFileInput.current.click();
    // }

    return(
    <>
        <Header></Header>
        <Container className="mt-5" fluid>
            <div className="content-wrapper">
                <div className="container-form-company">
                    <div className="col-md-12 grid-margin" >
                        <div className="form-group row" >
                        <div className="col-sm-3 col-form-label card"  id="cardxd"  >
                            <h1 className="texto-titulo-user-form">
                                Puedes crear usuarios y asignarlos a los diferentes roles
                            </h1>
                            <div className="contenedorImagenRegister">
                                <img src={imageform} className="imagenRegisterUser" alt=""/>
                            </div>
                        </div>
                        <div className="card col-sm-9">
                            <div className="card-body">
                                <form className="forms-sample" onSubmit={handleSubmit}>
                                    <div className="image-company-form">
                                        <img src={imagenDefault} className="newimagenRegisterComponent" alt=""/>
                                        {/* <button className="buttonnewimage" type="button" onClick={clickInputFile}><img src="https://i.pinimg.com/originals/91/04/ab/9104ab6b89dd59d25881d8a74b1cb848.png" style={{width:'100%' , height:'auto'}}></img></button>
                                        <input type="file" name="img[]"  ref={hiddenFileInput} accept="image/*" className="file-upload-default" 
                                                onChange={changeImage} style={{display:"none"}} /> */}
                                    </div>
                                    <div className="form-group row">
                                    <label htmlFor="InputNit" className="col-sm-3 col-form-label">Nombre Completo</label>
                                        <div className="col-sm-9">
                                        <input type="text" className="form-control" id="InputNombre" defaultValue={userNombre}
                                            placeholder="Nombres del usuario" onChange={e => setUserNombre(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="InputEmail" className="col-sm-3 col-form-label">Documento Identidad</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" id="InputDocumento" defaultValue={userNumeroIdentidad}
                                                placeholder="Documento de Identidad del Usuario" onChange={e => setUserNumeroIdentidad(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="InputRazonSocial" className="col-sm-3 col-form-label">Telefono Movil</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" id="InputMovil" defaultValue={userCellPhone}
                                                placeholder="Celular del usuario" onChange={e => setUserCellPhone(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="InputCiudad" className="col-sm-3 col-form-label">Dirección</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" id="InputDireccion" defaultValue={userDireccion}
                                                placeholder="Dirección del usuario" onChange={e => setUserDireccion(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="InputDireccion" className="col-sm-3 col-form-label">Correo</label>
                                        <div className="col-sm-9">
                                            <input type="email" className="form-control" id="InputMail" defaultValue={userCorreo}
                                                placeholder="Correo del Usuario" onChange={e => setUserCorreo(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="FormControlSelect" className="col-sm-3 col-form-label">Rol</label>
                                        <div className="col-sm-9">
                                            <select className="form-control" id="FormControlSelectDepartment" value={rolUsuario} onChange={(e) => setRol(e.target.value)}>
                                                <option value={""}>Selecciona un Rol</option>
                                                <option value={"1"}> Administrador </option>
                                                <option value={"4"}> Motorizado </option>
                                                <option value={"3"}> Tecnico </option>
                                            </select>
                                        </div>
                                    </div>
                                    <br></br>
                                    <button type="submit" className="btn btn-primary mr-2">Actualizar</button>
                                    <Link to={"EdicionUsuarioFixYou"} className="btn btn-dark" type="button">Cancelar</Link>
                                </form>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            {alert ? <p></p> : <AlertComponent openmodal={true} mensaje={mensa} error={erro} setAlert={setAlert}></AlertComponent>}
        </Container>
    </>
    )
}

export default EditarUsuariosFixYouComponent;