<%-- 
    Document   : reports
    Created on : Mar 20, 2019, 8:24:39 PM
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
        <script src="js/reports.js" type="text/javascript"></script>
        <title>Reportes</title>
    </head><%
        Boolean cambiar_clave = (Boolean) session.getAttribute("cambiar_clave");
        if (cambiar_clave == null) {
            response.sendRedirect("login.jsp?redirect=" + request.getServletPath().replace("/", ""));
        } else {
            if (cambiar_clave) {
                response.sendRedirect("changepassword.jsp?redirect=" + request.getServletPath().replace("/", ""));
            }
        }
        if(  
                session.getAttribute("hasClinica") !=null && session.getAttribute("hasDeportes")!=null && session.getAttribute("hasProgramaSalud") !=null && session.getAttribute("hasPlayground") !=null 
                &&
                !(Boolean)session.getAttribute("hasClinica") && !(Boolean)session.getAttribute("hasDeportes") && !(Boolean)session.getAttribute("hasProgramaSalud") && !(Boolean)session.getAttribute("hasPlayground")){
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
