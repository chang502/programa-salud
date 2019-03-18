<%-- 
    Document   : index
    Created on : Jun 4, 2018, 8:49:07 PM
    Author     : Andres
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        
        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link href="styles/style.css" rel="stylesheet" type="text/css"/>
        <link href="js/ext-6.2.0/build/classic/theme-neptune/resources/theme-neptune-all.css" rel="stylesheet" type="text/css"/>
        <script src="js/ext-6.2.0/build/ext-all.js" type="text/javascript"></script>
        <script src="js/ext-6.2.0/build/classic/locale/locale-es.js" type="text/javascript"></script>
        <script src="js/ext-6.2.0/build/classic/theme-neptune/theme-neptune.js" type="text/javascript"></script>
        
        <style>
            .x-action-col-icon {
                height: 16px;
                width: 16px;
                margin-right: 5px;
            }
        </style>
        
        
        <% if(session.getAttribute("hasClinica")!=null && (Boolean) session.getAttribute("hasClinica")){ %><script src="js/appointmenteditanddelete_dialog.js" type="text/javascript"></script>
        <script src="js/person.js" type="text/javascript"></script>
        <script src="js/appointment_store.js" type="text/javascript"></script>
        <script src="js/appointmentschedule_panel.js" type="text/javascript"></script>
        <script src="js/appointmentsfortoday_panel.js" type="text/javascript"></script>
        <script src="js/index.js" type="text/javascript"></script><% } %>
        <% if(session.getAttribute("hasIngresoDatos")!=null && (Boolean) session.getAttribute("hasIngresoDatos")){ %><script src="js/ingresodatos.js" type="text/javascript"></script><% } %>
        <title>Inicio</title>
    </head><%
        Boolean cambiar_clave = (Boolean) session.getAttribute("cambiar_clave");
        if (cambiar_clave == null) {
            response.sendRedirect("login.jsp?redirect=" + request.getServletPath().replace("/", ""));
        } else {
            if (cambiar_clave) {
                response.sendRedirect("changepassword.jsp?redirect=" + request.getServletPath().replace("/", ""));
            }
        }
    %>
    <body>
        <div id="content">
            <jsp:include page="header.jsp" />
            <jsp:include page="menu.jsp" />
            <div id="main-container" >
                <% if(session.getAttribute("hasClinica")!=null && (Boolean) session.getAttribute("hasClinica")){ %><div id="index_clinica" ></div><% } %>
                <% if(session.getAttribute("hasIngresoDatos")!=null && (Boolean) session.getAttribute("hasIngresoDatos")){ %><div id="index_ingresodatos" ></div><% } %>
                
            </div>
            <jsp:include page="footer.jsp" />
        </div>
    </body>
</html>
