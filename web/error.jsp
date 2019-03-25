<%-- 
    Document   : error
    Created on : Oct 18, 2018, 9:00:30 PM
    Author     : Andres
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link href="styles/style.css" rel="stylesheet" type="text/css"/>
        
        <script src="js/login.js" type="text/javascript"></script>
        <title><%= request.getParameter("title")!=null?request.getParameter("title"):"Error" %></title>
    </head>
    <body>
        <div id="content">
            <jsp:include page="header.jsp" />
            <jsp:include page="menu.jsp" />
            <div id="main-container">
                <% String code=request.getParameter("code");
                    if(code!=null){
                        if(code.equals("1")){ %>
                        No tiene permisos para ingresar a esa p&aacute;gina.
                        <% }else{ %>
                        Ocurri&oacute; un error.
                        <% } %>
                    <% }else{ %>
                    <%= request.getParameter("message")!=null?request.getParameter("message"):"Ocurri&oacute; un error." %>
                    <%= request.getParameter("message") %>
                    <%}%>
                    
                    <br>
                    <br>
                    <a href="index.jsp">Ir al inicio</a>
            </div>
        </div>
            <jsp:include page="footer.jsp" />
    </body>
</html>
