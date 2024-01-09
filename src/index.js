/*!

=========================================================
* Argon Dashboard React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "./assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/css/argon-dashboard-react.css";

import AdminLayout from "./layouts/Admin.js";
import AuthLayout from "./layouts/Auth.js";

import { AuthProvider } from 'react-auth-kit'
import InformacionQrComponent from "./views/Usuarios/InformacionQrComponent/InformacionQrComponent";

const root = ReactDOM.createRoot(document.getElementById("root"));

const fechas = localStorage.getItem('fechas');
const fecha = JSON.parse(fechas);
let fecha2 = new Date(fecha?.fechaexpira)
let fechaa = new Date();
if( fecha2 < fechaa || fecha2 == fechaa){
  alert("sesion expirada")
  localStorage.clear();
}

root.render(
  <AuthProvider authType = {'cookie'}
                  authName={'_auth'}
                  cookieDomain={window.location.hostname}
                  cookieSecure={window.location.protocol === "https:"}>
    <BrowserRouter>
      <Switch>
          <Route path="/SISTEMA/ITBF/crm-itbf" render={(props) => <AdminLayout {...props} /> } />
          <Route path="/SISTEMA/ITBF/auth" render={(props) => <AuthLayout {...props} />} />
          <Route exact path="/SISTEMA/ITBF/informacionQr-:id">
            <InformacionQrComponent></InformacionQrComponent>
          </Route>
          <Redirect from="/informacionQr-:id" to="/SISTEMA/ITBF/informacionQr-:id" />
          <Redirect from="*" to="/SISTEMA/ITBF/auth" />
      </Switch>
    </BrowserRouter>
  </AuthProvider>
  
);
