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
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import AdminFooter from "../components/Footers/AdminFooter.js";
import Sidebar from "../components/Sidebar/Sidebar.js";

import { useHistory  } from "react-router-dom";

import routes from "../routes.js";

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();
  const history = useHistory ();

  const tokenString = localStorage.getItem('usuario');
  const userToken = JSON.parse(tokenString)

  const roluser = localStorage.getItem('rol');
  const rol = JSON.parse(roluser);
  // console.log(props)
  // console.log(routes)

  if(!userToken){
    history.push("/SISTEMA/ITBF/auth");
  }

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/ITBF/crm-itbf") {
        return (
          <Route
            path={"/SISTEMA"+prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      var local = routes[i].path.split(":")
      if (
        props.location.pathname.includes(local[0])
      ) {
        return routes[i].name;
      }
    }
    return "ITBF";
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/SISTEMA/ITBF/crm-itbf/index",
          imgSrc: require("../assets/img/brand/logo-4sales-crm.png"),
          imgAlt: "..."
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props.location.pathname)}
        />
        <Switch>
          {getRoutes(routes)}
          {
            rol?.rolUser ? <Redirect from="*" to="/SISTEMA/ITBF/crm-itbf/indexadmin" /> : <Redirect from="*" to="/SISTEMA/ITBF/crm-itbf/index" />
          }
          
        </Switch>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
