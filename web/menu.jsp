<%-- 
    Document   : menu
    Created on : Jun 24, 2018, 12:43:37 AM
    Author     : Andres
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    if(session != null && session.getAttribute("id_usuario")!=null){
       String nombre_completo = (String) session.getAttribute("id_usuario"); //response.sendRedirect("login.jsp");
    
%><div id="cssmenu">
    <ul>
        <li><a href="./"><span>Inicio</span></a></li>
        <% if(!session.isNew() && (Boolean)session.getAttribute("hasClinica")) { %>
        <li class="has-sub"><a href="#"><span>Cl&iacute;nicas</span></a>
            <ul> 
                <li><a href="scheduleappointment.jsp"><span>Programar Cita</span></a></li>
                <li><a href="appointments.jsp"><span>Ver y Editar Citas</span></a></li>
                <%--<li><a href="attendappointment.jsp"><span>Atender Cita</span></a></li>--%>
                <li class="last"><a href="patients.jsp"><span>Buscar Pacientes</span></a></li> 
            </ul>
        </li>
        <% } %>
        <% if(!session.isNew() && (Boolean)session.getAttribute("hasDeportes")) { %>
        <li class="has-sub"><a href="#"><span>Deportes</span></a>
            <ul> 
                <li><a href="students.jsp"><span>Consulta de Estudiantes</span></a></li>
                <li class="last"><a href="disciplines.jsp"><span>Administrar Disciplinas</span></a></li>
            </ul>
        </li>
        <% } %>
        <% if(!session.isNew() && (Boolean)session.getAttribute("hasProgramaSalud")) { %>
        <li class="has-sub"><a href="#"><span>Programa de Salud</span></a> 
            <ul> 
                <li><a href="drinkingfountains.jsp"><span>Bebederos</span></a></li>
                <li><a href="teams.jsp"><span>Selecciones</span></a></li>
                <li><a href="championships.jsp"><span>Campeonatos</span></a></li>
                <li class="last"><a href="trainings.jsp"><span>Capacitaciones</span></a></li>
            </ul>
        </li>
        <% } %>
        
        <% if(!session.isNew() && (Boolean)session.getAttribute("hasPlayground")) { %>
        <li class="has-sub"><a href="#"><span>Espacios de Convivencia</span></a> 
            <ul> 
                <li class="last"><a href="coexistence.jsp"><span>Infraestructura y Planificación para la Convivencia</span></a></li>
            </ul>
        </li>
        <% } %>
        
        <% if(!session.isNew() && ((Boolean)session.getAttribute("hasClinica") || (Boolean)session.getAttribute("hasDeportes") || (Boolean)session.getAttribute("hasProgramaSalud") || (Boolean)session.getAttribute("hasPlayground")  )) { %>
        <li><a href="reports.jsp"><span>Reportes</span></span></a></li>
        <% } %>
        <% if(!session.isNew() && (Boolean)session.getAttribute("isAdmin")) { %>
        <li class="has-sub"><a href="#"><span>Administrar</span></span></a>
            <ul>	
                <li><a href="users.jsp"><span>Usuarios</span></a></li>
                <li><a href="doctors.jsp"><span>Doctores</span></a></li>
                <li><a href="measurements.jsp"><span>Medidas</span></a></li>
                <li><a href="actions.jsp"><span>Acciones (Citas)</span></a></li>
                <li class="last"><a href="clinics.jsp"><span>Clínicas</span></a></li>
            </ul>
        </li>
        <% } %>
        <li class="has-sub last"><a href="#"><span>Cuenta</span></a>
            <ul>
                <li><a href="#"><span><%= nombre_completo%></span></a></li>
                <li><a href="changepassword.jsp"><span>Cambiar Contraseña</span></a></li>
                <li class="last"><a href="logout.jsp"><span>Cerrar Sesión</span></a></li>
            </ul>
        </li>
    </ul>
</div>
                <% }else{ %><!-- no --><% }%>