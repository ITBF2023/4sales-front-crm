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
import Index from "./views/Index.js";
import Profile from "./views/LoginComponent/Profile";
import Register from "./views/LoginComponent/Register";

import Comercial from "./views/Usuarios/Comercial/Comercial";
import ArchivosUserComponent from "./views/Usuarios/ArchivosUsuario/ArchivosUserComponent";
import SucursalesCompaniesComponent from "./views/Usuarios/SucursalesCompaniesComponent/SucursalesCompaniesComponent";
import RegisterCompanyComponent from "./views/Usuarios/FormularioEmpresas/RegisterCompanyComponent";
import MantenimientoCompaniesComponent from "./views/Usuarios/MantenimientoEmpresasComponent/MantenimientoCompaniesComponent";
import FormularioActualizacionEmpresa from "./views/Usuarios/FormularioEmpresas/FormularioActualizacionEmpresa";
import RegisterUserContactComponent from "./views/Usuarios/FormularioSucursales/RegisterSucursalCompany";
import MantenimientoSucursalesComponent from "./views/Usuarios/MantenimientoSucursalesComponent/MantenimientoSucursalesComponent";
import FormularioActualizacionContactoComponent from "./views/Usuarios/FormularioSucursales/FormularioActulizacionContacto";
import IndexAdminComponent from "./views/Administrador/IndexComponent/IndexAdminComponent";
import CompanyByUserComponent from "./views/Administrador/CompanyUserComponent/CompanyByUserComponent";
import SucursalesAdminComponent from "./views/Administrador/SucursalesAdminComponent/SucursalesAdminComponent";
import CartaPresentacionComponent from "./views/Administrador/TarjetaPresentacionComponent/CartaPresentacionComponent";
import TarjetaComponent from "./views/Administrador/TarjetaComponent/TarjetaComponent";
import ComercioAdminComponent from "./views/Administrador/ComercioAdmin/ComercioAdminComponent";
import RegisterUserComponent from "./views/Administrador/FormularioUsuariosComponent/RegisterUserComponent";
import MantenimientoUsersComponent from "./views/Administrador/MantenimientoUsuariosComponent/MantenimientoUsuariosComponent";
import FormularioActualizacionUsuarioComponent from "./views/Administrador/FormularioUsuariosComponent/FormularioActualizacionUsuario";
import GraficosComponent from "./views/Administrador/GraficosComponent/GraficosComponent";
import ArchivosAdminComponent from "./views/Administrador/ArchivosAdmin/ArchivosAdminComponent";
import ArchivosByUserComponent from "./views/Administrador/ArchivosAdmin/ArchivobyUsercomponent";
import RegistroUsuariosComponent from "./views/Administrador/RegistroUsuarios/RegistroUsuarioComponent.js";
import FormularioCardMakerComponent from "./views/Administrador/FormularioUsuariosComponent/FormularioCardMaker/FormularioCardMakerComponent.js";
import FormularioFixuComponent from "./views/Administrador/FormularioUsuariosComponent/FormularioFixu/FormularioFixuComponent.js";
import EscogerCompañiaComponent from "./views/Usuarios/EscogerCompañia/EscogerCompañiaComponent.js";
import EdicionUsuariosCRMComponent from "./views/Administrador/MantenimientoUsuariosComponent/CRM/EdicionUsuariosCRMComponent.js";
import EdicionUsuariosFixYouComponent from "./views/Administrador/MantenimientoUsuariosComponent/FixYouWeb/EdicionUsuariosFixYouComponent.js";
import EdicionUsuariosCardMakerComponent from "./views/Administrador/MantenimientoUsuariosComponent/CardMaker/EdicionUsuariosCardMakerComponent.js";
import EditarUsuariosCardMakerComponent from "./views/Administrador/FormularioUsuariosComponent/FormularioCardMaker/ActualizacionCardMakerComponent.js";
import EditarUsuariosFixYouComponent from "./views/Administrador/FormularioUsuariosComponent/FormularioFixu/ActualizacionFixuComponent.js";
import GestionDeCasoComponent from "./views/Usuarios/GestionCasosComponent/GestionDeCasoComponent.js";
import GestionDeOportunidadesComponent from "./views/Usuarios/GestionOportunidades/GestionOportunidadesComponent.js";
import ControlUsuariosComponent from "./views/Administrador/ControlUsuariosComponent/ControlUsuariosComponent.js";
import TableroDeOportunidadesComponent from "./views/Usuarios/TableroDeOportunidadesComponent/TableroDeOportunidadesComponent.js";
import OportunidadDetallesComponent from "./views/Usuarios/OportunidadDetallesComponent/OportunidadDetallesComponent.js";
import DatosPersonalesComponent from "./views/Usuarios/DatosPersonalesComponent/DatosPersonalesComponent.js";
import RecuperarContraseñaComponent from "./views/LoginComponent/RecuperarContraseñaComponent/RecuperarContraseñaComponent.js";
import CambioCompañiasComponent from "./views/Administrador/CambioCompañiasComponent/CambioCompañiasComponent.js";
import TareasComponent from "./views/Usuarios/TareasComponent/TareasComponent.js";
import DesarrolloTareasComponent from "./views/Usuarios/TareaDesarrolloComponent/DesarrolloTareasComponent.js";
import TareasAdminComponent from "./views/Administrador/TareasComponent/TareasComponent.js";


var routes = [
  {
    path: "/index",
    name: "Inicio",
    icon: "mdi mdi-monitor-dashboard text-primary",
    component: Index,
    layout: "/ITBF/crm-itbf",
    workstation: 'Anybody'
  },
  {
    path: "/archivos-:carpetapadre",
    name: "Archivos",
    icon: "ni ni-archive-2 text-yellow",
    component: ArchivosUserComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'Anybody'
  },
  // Tareas Component
  {
    path: "/tareas",
    name: "Tareas",
    icon: "fa-solid fa-clipboard-list text-info",
    component: TareasComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'Anybody'
  },
  {
    path: "/tarea-desarrollo/:id",
    name: "Desarrollo Tarea",
    icon: "fa-solid fa-clipboard-list text-info",
    component: DesarrolloTareasComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'TareasDesarrollo'
  },
  //Comercial
  {
    path: "/comercial",
    name: "Comercial",
    icon: "ni ni-shop text-blue",
    component: Comercial,
    layout: "/ITBF/crm-itbf",
    workstation: 'Comercial'
  },
  {
    path: "/companie-sucursal/:id",
    name: "Sucursales",
    component: SucursalesCompaniesComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'Sucursales'
  },
  // Creacion de compañias
  {
    path: "/registroEmpresa",
    name: "Registrar Empresa",
    icon: "mdi mdi-domain-plus text-green",
    component: RegisterCompanyComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'Comercial'
  },
  // Mantenimiento de compañias
  {
    path: "/companies",
    name: "Actualizacion Empresas",
    icon: "fa-regular fa-pen-to-square text-orange",
    component: MantenimientoCompaniesComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'Comercial'
  },
  {
    path: "/actualizarDatosEmpresa-:id",
    name: "Actualizacion Empresas",
    component: FormularioActualizacionEmpresa,
    layout: "/ITBF/crm-itbf",
    workstation: 'ActualizarEmpresa'
  },
  //Registro de contactos
  {
    path: "/registroContacto",
    name: "Registrar Persona de Contacto",
    icon: "fa-regular fa-address-card text-primary",
    component: RegisterUserContactComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'Comercial'
  },
  // Edicion de contactos
  {
    path: "/sucursales",
    name: "Actualizacion de Contactos",
    icon: "fa-solid fa-file-pen text-info",
    component: MantenimientoSucursalesComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'Comercial'
  },
  {
    path: "/edicionContacto-:id",
    name: "Actualizacion de Contactos",
    component: FormularioActualizacionContactoComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'ActualizacionContacto'
  },
  // Gestion de oportunidades
  {
    path: "/GestionDeOportunidades",
    name: "Gestion de Oportunidades",
    icon: "ni ni-building text-orange",
    component: GestionDeOportunidadesComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'Comercial'
  },
  {
    path: "/DetallesOportunidad/:id",
    name: "Detalles de Oportunidades",
    component: OportunidadDetallesComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'DetallesOportunidad'
  },

  // Tablero de oportunidades
  {
    path: "/TableroDeOportunidades",
    name: "Tablero de Oportunidades",
    icon: "mdi mdi-bulletin-board text-primary",
    component: TableroDeOportunidadesComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'Comercial'
  },

  // Seleccion de Compañias
  {
    path: "/EscogerCompañia",
    name: "Escoger Compañia",
    icon: "fa-solid fa-building text-orange",
    component: EscogerCompañiaComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'Anybody'
  },
  // Datos Personales
  {
    path: "/ActualizarDatos",
    name: "Actualizar Información",
    icon: "fa-solid fa-gear",
    component: DatosPersonalesComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'Anybody'
  },


  //Gestion de Casos
  {
    path: "/GestionDeCaso/:id",
    name: "Gestion del caso seleccionado",
    component: GestionDeCasoComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'GestionDeCaso'
  },


  // ****************************************************************************************************************
  //Rutas Administrador
  {
    path: "/indexadmin",
    name: "Inicio",
    component: IndexAdminComponent,
    icon: "ni ni-tv-2 text-primary",
    layout: "/ITBF/crm-itbf",
    workstation: 'Admin'
  },
  {
    path: "/calendario",
    name: "Calendario",
    icon: "fas fa-calendar-days text-inherit",
    component: Index,
    layout: "/ITBF/crm-itbf",
    workstation: 'Admin'
  },
  {
    path: "/controlUsuarios",
    name: "Control Usuarios",
    component: ControlUsuariosComponent,
    icon: "fa-solid fa-table-list text-primary",
    layout: "/ITBF/crm-itbf",
    workstation: 'Admin'
  },
  {
    path: "/empresasByUser-:id",
    name: "Empresas Por Usuario",
    component: CompanyByUserComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'EmpresasByUser'
  },
  {
    path: "/companyadmin-sucursal/:id",
    name: "Compañias Admin",
    component: SucursalesAdminComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'SucursalesAdminComponent'
  },
  {
    path: "/cartapresentacion",
    name: "Cartas de Presentacion",
    icon: "fa-regular fa-address-card text-orange",
    component: CartaPresentacionComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'Admin'
  },
  // Tareas Component
  {
    path: "/tareasAdministrador",
    name: "Tareas",
    icon: "fa-solid fa-clipboard-list text-info",
    component: TareasAdminComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'Admin'
  },
  // {
  //   path: "/tarea-desarrollo/:id",
  //   name: "Desarrollo Tarea",
  //   icon: "fa-solid fa-clipboard-list text-info",
  //   component: DesarrolloTareasComponent,
  //   layout: "/ITBF/crm-itbf",
  //   workstation: 'TareasDesarrollo'
  // },
  {
    path: "/tarjeta-:id",
    name: "Tarjeta Presentacion",
    icon: "fa-regular fa-address-card text-orange",
    component: TarjetaComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'TarjetaPresentacion'
  },
  {
    path: "/archivosadmin-:carpetapadre",
    name: "Archivos Administrador",
    icon: "ni ni-archive-2 text-yellow",
    component: ArchivosAdminComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'Admin'
  },
  {
    path: "/archivosadminby-user-:carpetapadre-:userId",
    name: "Archivos Por Usuario",
    component: ArchivosByUserComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'ArchivosAdminByUser'
  },
  {
    path: "/comercioadmin",
    name: "Seguimiento Comerciales",
    icon: "ni ni-shop text-blue",
    component: ComercioAdminComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'Admin'
  },
  {
    path: "/GestionComerciosSinSeguimiento",
    name: "Cambio Comerciales",
    icon: "fa-solid fa-share text-inherit",
    component: CambioCompañiasComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'Admin'
  },
  {
    path: "/RegistroUsuario",
    name: "Registro Usuarios",
    icon: "fas fa-user-plus text-green",
    component: RegisterUserComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'Admin'
  },
  //NuevosUsuarios
  {
    path: "/newUser4Sales",
    name: "Registrar Usuario",
    component: RegisterUserComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'NuevosUsuarios'
  },
  {
    path: "/newUserFixu",
    name: "Registrar Usuario",
    component: FormularioFixuComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'NuevosUsuarios'
  },
  {
    path: "/newUserCardMaker",
    name: "Registrar Usuario",
    component: FormularioCardMakerComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'NuevosUsuarios'
  },
  // **************************************************

  //Edicion Usuarios Externos Internos
  {
    path: "/EdicionUsuario4Sales",
    name: "Edicion Usuarios 4sales",
    component: EdicionUsuariosCRMComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'EdicionDeUsuarios'
  },
  {
    path: "/EdicionUsuarioFixYou",
    name: "Edicion Usuarios FixYou",
    component: EdicionUsuariosFixYouComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'EdicionDeUsuarios'
  },
  {
    path: "/EdicionUsuarioCardMaker",
    name: "Edicion Usuarios CardMaker",
    component: EdicionUsuariosCardMakerComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'EdicionDeUsuarios'
  },
  // **************************************************
  //Edicion
  {
    path: "/actualizacionUsuarioCardMaker-:id",
    name: "Actulizacion Usuario",
    component: EditarUsuariosCardMakerComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'ActualizacionUsuarios'
  },
  {
    path: "/actualizacionUsuarioFixu-:id",
    name: "Actulizacion Usuario",
    component: EditarUsuariosFixYouComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'ActualizacionUsuarios'
  },
  // **************************************************
  {
    path: "/users",
    name: "Mantenimiento Usuarios",
    icon: "fas fa-user-edit text-red",
    component: EdicionUsuariosCRMComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'Admin'
  },
  {
    path: "/actualizacionUsuarios-:id",
    name: "Actulizacion Usuario",
    component: FormularioActualizacionUsuarioComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'ActualizacionUsuarios'
  },
  {
    path: "/estadisticas",
    name: "Graficos Seguimiento",
    icon: "fa-solid fa-chart-pie text-black",
    component: GraficosComponent,
    layout: "/ITBF/crm-itbf",
    workstation: 'Admisn'
  },


  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/ITBF/auth",
    workstation: 'Register'
  },
  {
    path: "/RecuperarContraseña/mail-:id",
    name: "Recuperar Contraseña",
    icon: "ni ni-key-25 text-info",
    component: RecuperarContraseñaComponent,
    layout: "/ITBF/auth",
    workstation: 'Register'
  },
];
export default routes;
