import React, { useState , useLayoutEffect} from "react";
import { Link } from "react-router-dom";

// import { postUser, getAllDepartement } from '../../../Controller/Controller';

import { Container } from "reactstrap";
import Header from "../../../components/Headers/Header";
import './registroUsuarios.css'
// import { useHistory } from "react-router-dom";

const RegistroUsuariosComponent = ( {isAdmin} ) => {

    useLayoutEffect(() => {
      if (isAdmin === false){
        window.location.href = "/403-Fordibben"
      }else{
      }
    }, []);  

    return(
    <>
        <Header></Header>
        <Container className="mt-5" fluid>
        <div className="contenedorEmpresasUsuario">
          <div className="ag-format-container">
            <div className="ag-courses_box">
              {/* <div className="ag-courses_item">
                <Link to={'newUserCardMaker'} className="ag-courses-item_link">
                  <div className="ag-courses-item_bg"></div>

                  <div className="ag-courses-item_title" >
                    CARD MAKER
                    <br></br>
                    <br></br>
                    <img src="Images/Empresas/cardMakerLogos.png" style={{height:'170px'}}></img>
                  </div>

                  <div className="ag-courses-item_date-box" >
                    Creacion:&#160;
                    <span className="ag-courses-item_date">
                      04 - Marzo - 2022
                    </span>
                  </div>
                </Link>
              </div> */}

              <div className="ag-courses_item">
                <Link to={'newUser4Sales'} className="ag-courses-item_link">
                  <div className="ag-courses-item_bg"></div>

                  <div className="ag-courses-item_title">
                  CRM || GESTION
                    <br></br>
                    <br></br>
                    <img src="Images/Empresas/Logo4SalesShort.png" style={{height:'170px'}}></img>
                  </div>

                  <div className="ag-courses-item_date-box">
                    Creacion:&#160;
                    <span className="ag-courses-item_date">
                    04 - Marzo - 2022
                    </span>
                  </div>
                </Link>
              </div>

              {/* <div className="ag-courses_item">
                <Link to={'newUserFixu'} className="ag-courses-item_link">
                  <div className="ag-courses-item_bg"></div>

                  <div className="ag-courses-item_title">
                  FIXU WEB
                    <br></br>
                    <br></br>
                    <img src="Images/Empresas/Logo.png" style={{height:'170px'}}></img>
                  </div>

                  <div className="ag-courses-item_date-box">
                    Creacion: &#160;
                    <span className="ag-courses-item_date">
                    04 - Marzo - 2022
                    </span>
                  </div>
                </Link>
              </div> */}

            </div>
          </div>
        </div>
        </Container>
    </>
    )
}

export default RegistroUsuariosComponent;