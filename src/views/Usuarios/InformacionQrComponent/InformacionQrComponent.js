import React, { useLayoutEffect, useState} from "react";

import { getUserTargetPresentationViewers, getCodeQRViewers} from '../../../Controller/Controller';

import '../../../assets/css/ViewStyles/tarjetaPresentacion.css'

const InformacionQrComponent = ({isAdmin}) => {

  const pathcomplete = window.location.pathname
  let path = pathcomplete.split("-")

  const getUserTarget = async() => {
      const user = await getUserTargetPresentationViewers(path[1])
      if(!user){
        setUsuario({})
      }else{
        setUsuario(user)
      }
  }

  useLayoutEffect(() => {
      getUserTarget();
  }, []);

  const [usuario, setUsuario] = useState({});


  return(

    <div className="container-scroller" >
      <div className="container-fluid page-body-wrapper" >
        <div className="main-panel">
        <div className="content-wrapper">
            <div className="page-header">
              
            </div>
            <div className="col-lg-12 grid-margin stretch-card">
              <div className="container-wrapper" >
                <div className="wrapper">
                  <div className="profile-card js-profile-card">
                    <div className="profile-card__img">
                      <img src={usuario?.userImage} alt="profile card" />
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

                      <div className="profile-card-ctr">
                      </div>
                      
                    </div>
                
                  </div>
                
                </div>
                
              </div>
                
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InformacionQrComponent;