<%-- 
    Document   : logout
    Created on : Sep 6, 2018, 12:02:33 AM
    Author     : Andres
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
session.invalidate();
response.sendRedirect("login.jsp");
%>