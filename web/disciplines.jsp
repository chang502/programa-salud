<%-- 
    Document   : disciplines
    Created on : Jul 14, 2018, 2:15:42 PM
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
        <script src="js/person.js" type="text/javascript"></script>
        <script src="js/disciplines.js" type="text/javascript"></script>
        <title>Administrar Disciplinas</title>
    </head><%
        Boolean cambiar_clave = (Boolean) session.getAttribute("cambiar_clave");
        if (cambiar_clave == null) {
            response.sendRedirect("login.jsp?redirect=" + request.getServletPath().replace("/", ""));
        } else {
            if (cambiar_clave) {
                response.sendRedirect("changepassword.jsp?redirect=" + request.getServletPath().replace("/", ""));
            }
        }
        if(session.getAttribute("hasDeportes")!=null && !(Boolean) session.getAttribute("hasDeportes")){
            response.sendRedirect("error.jsp?code=1");
        }
    %>
    <body>
        <div id="content">
            <jsp:include page="header.jsp" />
            <jsp:include page="menu.jsp" />
            <div id="main-container">
            </div>
        </div>
            <jsp:include page="footer.jsp" />
    </body>
</html>
