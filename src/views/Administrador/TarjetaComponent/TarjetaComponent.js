import React, { useLayoutEffect, useState} from "react";
import { useParams } from "react-router-dom";


import { getUserTargetPresentation, getUserRedesSociales , createCodeQR, saveCodeQR, getCodeQR} from '../../../Controller/Controller';

import '../../../assets/css/ViewStyles/tarjetaPresentacion.css'
import { Container } from "reactstrap";
import Header from "../../../components/Headers/Header";
import QRCode from "react-qr-code";

const TarjetaComponent = ({isAdmin}) => {

  const parameter = useParams();

  const getUserTarget = async() => {
      const user = await getUserTargetPresentation(parameter.id)
      // console.log(user)
      if(!user){
        setUsuario({})
      }else{
        // verificarCodeQR(user);
        setUsuario(user)
      }
  }

  // const createUserCodigoQR = async(base64, username) => {
  //   let formData = new FormData()
  //   formData.append("userID", parameter.id)
  //   formData.append("Imagensrc", username?.userName)
  //   formData.append("ImageFile", base64)

  //   const codeQR = await saveCodeQR(formData)
  //   // console.log(codeQR)
  // }

  // const getUserCodeQR = async() => {
  //   const userCode = await getCodeQR(parameter.id)
  //   return userCode
  // }

  // const getUserRedSocial = async() => {
  //   const redes = await getUserRedesSociales(parameter.id)
  //   if (!redes){
  //     setRedesSociales({})
  //   }else{
  //     setRedesSociales(redes)
  //   }
  //   // console.log(redes)
  // }

  // const GenerarCodeQR = async() => {
  //   // var direccion = "https://localhost:3000/informacionQr-"+ parameter.id
  //   // var direccion = window.location.protocol+window.location.host+"/informacionQr-"+ parameter.id
  //   var direccion = "https://4sales.com.co/ITBF/informacionQr-"+ parameter.id
  //   const bodycode = {
  //     size: 500,
  //     colorDark: "rgb(0, 0, 0)",
  //     logo: "scan_me.png",
  //     eye_outer: "eyeOuter2",
  //     eye_inner: "eyeInner1",
  //     qrData: "pattern0",
  //     backgroundColor: "rgb(255,255,255)",
  //     transparentBkg: false,
  //     qrCategory: "url",
  //     text: direccion
  //   }
  //   const jose = await createCodeQR(bodycode)
  //   // console.log(jose)
  //   if (!jose) {
  //     setsvg("")
  //   }else{
  //     setImagen(false)
  //     setsvg(jose?.data)
  //   }

  //   return jose

  // }

  // const verificarCodeQR = async(userenviado) =>{
  //   let user = await getUserCodeQR()
  //   if(!user){
  //     alert("Generando Codigo QR")
  //     let codigoQR = await GenerarCodeQR();
  //     if(!codigoQR){
  //     }else{
  //       let createCodigoQR = await createUserCodigoQR(codigoQR.data, userenviado)
  //       if(!createCodigoQR){
  //         // console.log("No creado")
  //       }else{
  //         // console.log("creado")
  //       }
  //     }
  //   }else{
  //     setImagen(true)
  //     setsvg(user.codigoQRImage)
  //   }
  // } 

  useLayoutEffect(() => {
    if (isAdmin === false){
      window.location.href = "/403-Fordibben"
    }else{
      getUserTarget();
    }    
  }, []);

  const [usuario, setUsuario] = useState({});
  const [redesSociales, setRedesSociales] = useState({});
  const [svg, setsvg] = useState();
  const [imagen, setImagen] = useState(false);

  return(
  <>
    <Header></Header>
    <Container className="mt-5" fluid>
      <div className="content-wrapper">
        <div className="page-header">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <h3 className="page-title"> Tarjeta de Presentacion </h3>
            </ol>
          </nav>
        </div>
        <div className="grid-margin stretch-card">
          <div className="container-wrapper" >
            <div className="wrapper">
              <div className="profile-card js-profile-card">
                <div className="profile-card__img">
                  <img src={'Images/Users/'+usuario?.userImage} alt="profile card" />
                </div>
            
                <div className="profile-card__cnt js-profile-cnt">
                  <div className="profile-card__name">{usuario?.userName} {usuario?.userLastname}</div>
                  <div className="profile-card__txt"> <strong>Area de Trabajo:</strong> {usuario?.userWorkstation} </div>
                  <div className="profile-card-loc">
                    <span className="profile-card-loc__icon">
                      <svg className="icon"><use xlinkHref="#icon-location"></use></svg>
                    </span>
            
                    <span className="profile-card-loc__txt">
                      Bogota, Colombia
                    </span>
                  </div>
            
                  <div className="profile-card-social">
                    <a className="profile-card-social__item facebook" target="_blank" rel="noreferrer" href="https://www.facebook.com/itbfconsulting">
                        <i className="mdi mdi-facebook icon-red"></i>
                    </a>
            
                    <a className="profile-card-social__item twitter" target="_blank" rel="noreferrer" href="https://twitter.com/itbf_colombia">
                        <i className="mdi mdi-twitter icon-red"></i>
                    </a>
            
                    <a className="profile-card-social__item instagram" target="_blank" rel="noreferrer" href="https://www.instagram.com/creandovalor/">
                        <i className="mdi mdi-instagram icon-red"></i>
                    </a>
            
                    <a className="profile-card-social__item linkedin" target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/itbf-colombia-859b20114/">
                      <i className="mdi mdi-linkedin icon-red"></i>
                    </a>

                    <a className="profile-card-social__item gmail" target="_blank" rel="noreferrer" href={"mailto:"+usuario.userMail}>
                      <i className="mdi mdi-gmail icon-red"></i>
                    </a>

                    <a className="profile-card-social__item whatsapp" target="_blank" rel="noreferrer" href={ "https://api.whatsapp.com/send?phone=57" + usuario.userCellPhone }>
                      <i className="mdi mdi-whatsapp icon-red"></i>
                    </a>
            
                  </div>
{/* 
                  {imagen ? <img src={svg} className="codigoQR"></img> :
                  <img src={"data:image/jpeg;base64,"+svg} className="codigoQR"></img> } */}

                  <div style={{ height: "auto", margin: "0 auto", maxWidth: 125, width: "100%" }}>
                    <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={window.location.protocol+"//"+window.location.host+"/SISTEMA/ITBF/informacionQr-"+ parameter.id}
                    viewBox={`0 0 256 256`}
                    />
                  </div>
                  

                  <div className="profile-card-ctr">
                  </div>
                  
                </div>
            
              </div>
            
            </div>
            
          </div>
            
        </div>
      </div>
    </Container>
  </>
  )
}

export default TarjetaComponent;