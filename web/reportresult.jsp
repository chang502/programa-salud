<%-- 
    Document   : reportresult
    Created on : Mar 23, 2019, 10:34:01 PM
    Author     : Andres
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link href="styles/style.css" rel="stylesheet" type="text/css"/>
        
        <script src="js/login.js" type="text/javascript"></script>
        <title><%= request.getParameter("titulo")!=null?request.getParameter("titulo"):"Generar Reporte" %></title>
    </head>
    <body>
        <div id="content">
            <jsp:include page="header.jsp" />
            <jsp:include page="menu.jsp" />
            <div id="main-container">
                <%= request.getParameter("mensaje")!=null?request.getParameter("mensaje"):"El reporte no contiene información." %>
                    <br>
                    <br>
                    <a href="index.jsp">Ir al inicio</a>
            </div>
        </div>
            <jsp:include page="footer.jsp" />
    </body>
</html>
