import React, { useState , useLayoutEffect} from "react";

import { updateUserExternoCardMaker, getUserExternosCardMakerById } from '../../../../Controller/Controller';

import '../../../../assets/css/ViewStyles/registerUser.css';
import { Container } from "reactstrap";
import Header from "../../../../components/Headers/Header";
import AlertComponent from "../../../Usuarios/AlertComponent/AlertComponent";
import { Link, useHistory } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom";

const EditarUsuariosCardMakerComponent = ( {isAdmin} ) => {


    useLayoutEffect(() => {
        if (isAdmin === false){
            window.location.href = "/403-Fordibben"
        }else{
            ObtenerDatosUsuario()
        }
        
      }, []);  

    const imagenDefault = require('../../../../assets/images/components/user-default.png');
    const imageform = require('../../../../assets/images/components/user-form.png');


    const [userName, setuserName] = useState("");
    const [userLastname, setuserLastname] = useState("");
    const [userMail, setuserMail] = useState("");
    const [rolUsuario, setRol] = useState("U");

    const [alert , setAlert] = useState(true)
    const [mensa , setMensaje] = useState(true)
    const [erro , setError] = useState(true)

    // const hiddenFileInput = React.useRef(null);
    const history = useHistory()
    const path = useParams()

    const ObtenerDatosUsuario = async() =>{
        const datos = await getUserExternosCardMakerById(path.id)
        // console.log(datos)
        setuserName(datos.nombre)
        setuserLastname(datos.apellidos)
        setuserMail(datos.email)
        setRol(datos.rolUsuario)
    }

    const RegisterUser = async() =>{
        let formData = new FormData()
        formData.append('Secuencia', 100)
        formData.append('Nombre', userName)
        formData.append('Apellidos', userLastname)
        formData.append('Email', userMail)
        formData.append('RolUsuario', rolUsuario)
        
        const register = await updateUserExternoCardMaker(formData, path.id)
        if(register === "OK"){
            setError(false)
            setMensaje("El usuario se actualizo exitosamente")
            setAlert(false)
            setTimeout(() => {
                history.push("EdicionUsuarioCardMaker");
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
                                Puedes crear diferentes usuarios
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
                                    <label htmlFor="InputNit" className="col-sm-3 col-form-label">Nombre</label>
                                        <div className="col-sm-9">
                                        <input type="text" className="form-control" id="InputNombre" defaultValue={userName}
                                            placeholder="Nombre del usuario" onChange={e => setuserName(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="InputRazonSocial" className="col-sm-3 col-form-label">Apellido</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" id="InputApellido" defaultValue={userLastname}
                                                placeholder="Apellido del usuario" onChange={e => setuserLastname(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="InputDireccion" className="col-sm-3 col-form-label" >Correo</label>
                                        <div className="col-sm-9">
                                            <input type="email" className="form-control" id="InputMail" defaultValue={userMail} 
                                                placeholder="Correo del Usuario" onChange={e => setuserMail(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="FormControlSelect" className="col-sm-3 col-form-label">Rol</label>
                                        <div className="col-sm-9">
                                            <select className="form-control" id="FormControlSelectDepartment" onChange={(e) => setRol(e.target.value)} value={rolUsuario}>
                                                <option value={undefined}>Selecciona un Rol</option>
                                                <option value={"A"}> Administrador </option>
                                                <option value={"U"}> Usuario </option>
                                            </select>
                                        </div>
                                    </div>
                                    <br></br>
                                    <button type="submit" className="btn btn-primary mr-2">Actualizar</button>
                                    <Link to={"EdicionUsuarioCardMaker"} className="btn btn-dark" type="button">Cancelar</Link>
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

export default EditarUsuariosCardMakerComponent;