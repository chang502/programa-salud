/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;

import java.util.HashMap;
import javax.annotation.Resource;
import javax.ws.rs.core.Context;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.PathParam;
import javax.xml.ws.WebServiceContext;

/**
 * REST Web Service
 *
 * @author Andres
 */
@Path("/")
public class Controller {
    
    @Resource   
   private WebServiceContext wsContext; 
    



    private Manager m;

    /**
     * Creates a new instance of Controller
     */
    public Controller(@Context HttpServletRequest request) {
        m = new Manager(request);
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String login(java.io.InputStream params) {
        return m.login(params);
        
    }
    
    //forgotpassword

    @POST
    @Path("/forgotpassword")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String forgotPassword(java.io.InputStream params) {
        return m.forgotPassword(params);
        
    }
    
    

    @POST
    @Path("/changepassword")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String changePassword(java.io.InputStream params) {
        return m.changePassword(params);
        
    }

    @POST
    @Path("/createuser")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String createuser(java.io.InputStream params) {

        String fields[] = {"id_usuario", "clave", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "fecha_nacimiento", "sexo", "email", "telefono"};

        java.util.Map<String, String> map = m.createMap(fields, params);
        map.replace("clave", m.toPassword(map.get("clave")));
        return m.callResultStoredProcedure("create_user", map, fields);

    }
    
    

    @GET
    @Path("/users")
    @Produces(MediaType.APPLICATION_JSON)
    public String getusers() {
        return m.callSelectStoredProcedure("get_users");
    }
    

    @GET
    @Path("/users/{id_usuario}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getuser(@PathParam("id_usuario") String id_usuario) {
        String fields[] = {"id_usuario"};
        java.util.Map<String, String> map = new HashMap<>();
        map.put("id_usuario", id_usuario);
        
        return m.callSelectStoredProcedure("get_user",map,fields);
    }

    @POST
    @Path("/updateuser")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateUser(java.io.InputStream params) {

        String fields[] = {"id_usuario", "clave", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "fecha_nacimiento", "sexo", "email", "telefono", "cambiar_clave"};
        java.util.Map<String, String> map = m.createMap(fields, params);
        
        if(map.get("clave").length()>0){
            map.replace("clave", m.toPassword(map.get("clave")));
        }
        
        return m.callResultStoredProcedure("update_user", map, fields);

    }

    

    @GET
    @Path("/roles/{id_usuario}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getRoles(@PathParam("id_usuario") String id_usuario) {
        String fields[] = {"id_usuario"};
        java.util.Map<String, String> map = new HashMap<>();
        map.put("id_usuario", id_usuario);
        
        return m.callSelectStoredProcedure("get_user_roles",map,fields);
    }
    
    
    @POST
    @Path("/updaterole")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateRole(java.io.InputStream params) {

        String fields[] = {"id_usuario_rol", "activo"};
        return m.callResultStoredProcedure("update_user_role", fields, params);

    }

    
    
    @POST
    @Path("/deleteuser")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteUser(java.io.InputStream params) {

        String fields[] = {"id_usuario"};
        return m.callResultStoredProcedure("delete_user", fields, params);

    }
    

    @POST
    @Path("/createdoctor")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String createDoctor(java.io.InputStream params) {

        String fields[] = {"id_usuario"};

        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("create_doctor", map, fields);

    }
    
    
    @GET
    @Path("/doctors")
    @Produces(MediaType.APPLICATION_JSON)
    public String getDoctores() {
        return m.callSelectStoredProcedure("get_doctores");
    }
    
    @GET
    @Path("/doctors/{id_doctor}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getdoctor(@PathParam("id_doctor") String id_doctor) {
        String fields[] = {"id_doctor"};
        java.util.Map<String, String> map = new HashMap<>();
        map.put("id_doctor", id_doctor);
        
        return m.callSelectStoredProcedure("get_doctor",map,fields);
    }
    
    @POST
    @Path("/updatedoctor")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateDoctor(java.io.InputStream params) {

        String fields[] = {"id_doctor", "id_usuario"};
        return m.callResultStoredProcedure("update_doctor", fields, params);

    }
    
    @POST
    @Path("/deletedoctor")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteDoctor(java.io.InputStream params) {

        String fields[] = {"id_doctor"};
        return m.callResultStoredProcedure("delete_doctor", fields, params);

    }
    
    
    
    

    @GET
    @Path("/specialities/{id_doctor}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getSpecialities(@PathParam("id_doctor") String id_doctor) {
        String fields[] = {"id_doctor"};
        java.util.Map<String, String> map = new HashMap<>();
        map.put("id_doctor", id_doctor);
        
        return m.callSelectStoredProcedure("get_doctores_especialidades",map,fields);
    }
    
    
    @POST
    @Path("/updatespeciality")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateSpeciality(java.io.InputStream params) {

        String fields[] = {"id_doctor_especialidad", "activo"};
        return m.callResultStoredProcedure("update_doctor_especialidad", fields, params);

    }
    
    
    
    
    
    
    
    @GET
    @Path("/datatypes")
    @Produces(MediaType.APPLICATION_JSON)
    public String getTiposDato() {
        return m.callSelectStoredProcedure("get_tipos_medida");
    }
    
    

    @POST
    @Path("/createmeasurement")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String createMeasurement(java.io.InputStream params) {

        String fields[] = {"nombre", "id_tipo_dato", "unidad_medida", "valor_minimo", "valor_maximo", "obligatorio"};

        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("create_measurement", map, fields);

    }
    
    
    @GET
    @Path("/measurements")
    @Produces(MediaType.APPLICATION_JSON)
    public String getMeasurement() {
        return m.callSelectStoredProcedure("get_measurements");
    }
    
    
    
    @GET
    @Path("/measurements/{id_medida}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getMeasurement(@PathParam("id_medida") String id_medida) {
        String fields[] = {"id_medida"};
        java.util.Map<String, String> map = new HashMap<>();
        map.put("id_medida", id_medida);
        
        return m.callSelectStoredProcedure("get_measurement",map,fields);
    }
    
    

    
    
    @POST
    @Path("/updatemeasurement")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateMeasurement(java.io.InputStream params) {

        String fields[] = {"id_medida", "nombre", "id_tipo_dato", "unidad_medida", "valor_minimo", "valor_maximo", "obligatorio"};
        return m.callResultStoredProcedure("update_measurement", fields, params);

    }

    
    
    @POST
    @Path("/deletemeasurement")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteMeasurement(java.io.InputStream params) {

        String fields[] = {"id_medida"};
        return m.callResultStoredProcedure("delete_measurement", fields, params);

    }
    
    
    
    
    
    @POST
    @Path("/createclinic")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String createClinic(java.io.InputStream params) {

        String fields[] = {"nombre", "ubicacion", "descripcion"};

        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("create_clinic", map, fields);

    }
    
    
    @GET
    @Path("/clinics")
    @Produces(MediaType.APPLICATION_JSON)
    public String getClinic() {
        return m.callSelectStoredProcedure("get_clinics");
    }
    
    
    
    @GET
    @Path("/clinics/{id_clinica}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getClinic(@PathParam("id_clinica") String id_clinica) {
        String fields[] = {"id_clinica"};
        java.util.Map<String, String> map = new HashMap<>();
        map.put("id_clinica", id_clinica);
        
        return m.callSelectStoredProcedure("get_clinic",map,fields);
    }
    
    

    
    
    @POST
    @Path("/updateclinic")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateClinic(java.io.InputStream params) {

        String fields[] = {"id_clinica", "nombre", "ubicacion", "descripcion"};
        return m.callResultStoredProcedure("update_clinic", fields, params);

    }

    
    
    @POST
    @Path("/deleteclinic")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteClinic(java.io.InputStream params) {

        String fields[] = {"id_clinica"};
        return m.callResultStoredProcedure("delete_clinic", fields, params);

    }
    
    
    
    @GET
    @Path("/clinicdoctors/{id_clinica}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getClinicDoctor(@PathParam("id_clinica") String id_clinica) {
        String fields[] = {"id_clinica"};
        java.util.Map<String, String> map = new HashMap<>();
        map.put("id_clinica", id_clinica);
        
        return m.callSelectStoredProcedure("get_clinica_doctores",map,fields);
    }
    
    
    @POST
    @Path("/updateclinicdoctor")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateClinicDoctor(java.io.InputStream params) {

        String fields[] = {"id_clinica_doctor", "activo"};
        return m.callResultStoredProcedure("update_clinica_doctor", fields, params);

    }
    
    
    
    
    
    
    
    
    @GET
    @Path("/clinicmeasurement/{id_clinica}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getClinicMeasurement(@PathParam("id_clinica") String id_clinica) {
        String fields[] = {"id_clinica"};
        java.util.Map<String, String> map = new HashMap<>();
        map.put("id_clinica", id_clinica);
        
        return m.callSelectStoredProcedure("get_clinica_medidas",map,fields);
    }
    
    
    @POST
    @Path("/updateclinicmeasurement")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateClinicMeasurement(java.io.InputStream params) {

        String fields[] = {"id_clinica_medida", "activo"};
        return m.callResultStoredProcedure("update_clinica_medida", fields, params);

    }
    
    
    
    
    
    
    
    
    
    @POST
    @Path("/creatediscipline")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String createDiscipline(java.io.InputStream params) {

        String fields[] = {"nombre","limite", "semestre","primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "fecha_nacimiento", "sexo", "email", "telefono"};

        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("create_discipline", map, fields);

    }
    
    
    @GET
    @Path("/disciplines")
    @Produces(MediaType.APPLICATION_JSON)
    public String getDisciplines() {
        return m.callSelectStoredProcedure("get_disciplines");
    }
    
    
    
    @GET
    @Path("/disciplines/{id_disciplina}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getDiscipline(@PathParam("id_disciplina") String id_disciplina) {
        String fields[] = {"id_disciplina"};
        java.util.Map<String, String> map = new HashMap<>();
        map.put("id_disciplina", id_disciplina);
        
        return m.callSelectStoredProcedure("get_discipline",map,fields);
    }
    
    

    
    
    @POST
    @Path("/updatediscipline")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateDiscipline(java.io.InputStream params) {

        String fields[] = {"id_disciplina", "nombre", "semestre","limite","id_persona","primer_nombre","segundo_nombre","primer_apellido","segundo_apellido","fecha_nacimiento","sexo","email","telefono"};
        return m.callResultStoredProcedure("update_discipline", fields, params);

    }

    
    
    @POST
    @Path("/deletediscipline")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteDiscipline(java.io.InputStream params) {

        String fields[] = {"id_disciplina"};
        return m.callResultStoredProcedure("delete_discipline", fields, params);

    }
    
    
    
    
    
    
    
    
    
    @POST
    @Path("/createdrinkfountain")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String createDrinkfountain(java.io.InputStream params) {

        String fields[] = {"nombre", "ubicacion", "fecha_mantenimiento", "estado", "observaciones"};

        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("create_drinkfountain", map, fields);

    }
    
    
    @GET
    @Path("/drinkfountains")
    @Produces(MediaType.APPLICATION_JSON)
    public String getDrinkfountains() {
        return m.callSelectStoredProcedure("get_drinkfountains");
    }
    
    
    
    @GET
    @Path("/drinkfountains/{id_bebedero}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getDrinkfountain(@PathParam("id_bebedero") String id_bebedero) {
        String fields[] = {"id_bebedero"};
        java.util.Map<String, String> map = new HashMap<>();
        map.put("id_bebedero", id_bebedero);
        
        return m.callSelectStoredProcedure("get_drinkfountain",map,fields);
    }
    
    

    
    
    @POST
    @Path("/updatedrinkfountain")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateDrinkfountain(java.io.InputStream params) {

        String fields[] = {"id_bebedero", "nombre", "ubicacion", "fecha_mantenimiento", "estado", "observaciones"};
        return m.callResultStoredProcedure("update_drinkfountain", fields, params);

    }

    
    
    @POST
    @Path("/deletedrinkfountain")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteDrinkfountain(java.io.InputStream params) {

        String fields[] = {"id_bebedero"};
        return m.callResultStoredProcedure("delete_drinkfountain", fields, params);

    }
    
    
    
    
    
    
    
    
    
    
        
    @GET
    @Path("/measurementunits")
    @Produces(MediaType.APPLICATION_JSON)
    public String getMeasurementUnits() {
        return m.callSelectStoredProcedure("get_measurement_units");
    }
    
    
    
    
    
    
    
    @POST
    @Path("/createplayground")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String createPlayground(java.io.InputStream params) {

        String fields[] = {"nombre", "ubicacion", "cantidad", "id_unidad_medida", "anio", "costo", "estado", "observaciones"};

        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("create_playground", map, fields);

    }
    
    
    @GET
    @Path("/playgrounds")
    @Produces(MediaType.APPLICATION_JSON)
    public String getPlaygrounds() {
        return m.callSelectStoredProcedure("get_playgrounds");
    }
    
    
    
    @GET
    @Path("/playgrounds/{id_espacio_convivencia}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getPlayground(@PathParam("id_espacio_convivencia") String id_espacio_convivencia) {
        String fields[] = {"id_espacio_convivencia"};
        java.util.Map<String, String> map = new HashMap<>();
        map.put("id_espacio_convivencia", id_espacio_convivencia);
        
        return m.callSelectStoredProcedure("get_playground",map,fields);
    }
    
    

    
    
    @POST
    @Path("/updateplayground")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updatePlayground(java.io.InputStream params) {

        String fields[] = {"id_espacio_convivencia", "nombre", "ubicacion", "cantidad", "id_unidad_medida", "anio", "costo", "estado", "observaciones"};
        return m.callResultStoredProcedure("update_playground", fields, params);

    }

    
    
    @POST
    @Path("/deleteplayground")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String deletePlayground(java.io.InputStream params) {

        String fields[] = {"id_espacio_convivencia"};
        return m.callResultStoredProcedure("delete_playground", fields, params);

    }
    
    
    
    
    
    
    
    @GET
    @Path("/studentdocumenttypes")
    @Produces(MediaType.APPLICATION_JSON)
    public String getStudentDocumentTypes() {
        return m.callSelectStoredProcedure("get_student_document_types");
    }
    
    
    
    
    @GET
    @Path("/employeedocumenttypes")
    @Produces(MediaType.APPLICATION_JSON)
    public String getEmployeeDocumentTypes() {
        return m.callSelectStoredProcedure("get_employee_document_types");
    }
    
    
    
    
    @GET
    @Path("/documenttypes")
    @Produces(MediaType.APPLICATION_JSON)
    public String getDocumentTypes() {
        return m.callSelectStoredProcedure("get_document_types");
    }
    
    
    
    
    @GET
    @Path("/disabilitytypes")
    @Produces(MediaType.APPLICATION_JSON)
    public String getDisabilityTypes() {
        return m.callSelectStoredProcedure("get_disability_types");
    }
    
    
    @GET
    @Path("/students")
    @Produces(MediaType.APPLICATION_JSON)
    public String getEstudiantesDeportes(@Context HttpServletRequest request) {
        String id_tipo_documento=request.getParameter("id_tipo_documento");
        String numero_documento=request.getParameter("numero_documento");
        String id_disciplina=request.getParameter("id_disciplina");
        
        java.util.Map<String, String> map = new HashMap<>();
        
        map.put("id_tipo_documento", id_tipo_documento!=null?id_tipo_documento.length()==0?null:id_tipo_documento:null);
        map.put("numero_documento", numero_documento!=null?numero_documento.length()==0?null:numero_documento:null);
        map.put("id_disciplina", id_disciplina!=null?id_disciplina.length()==0?null:id_disciplina:null);
        
        
        String fields[] = {"id_tipo_documento","numero_documento","id_disciplina"};
        return m.callSelectStoredProcedure("get_students", map, fields);
    }
    
    
    
    @GET
    @Path("/students/{id_estudiante_deportes}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getEstudianteDeportes(@PathParam("id_estudiante_deportes") String id_estudiante_deportes) {
        String fields[] = {"id_estudiante_deportes"};
        java.util.Map<String, String> map = new HashMap<>();
        map.put("id_estudiante_deportes", id_estudiante_deportes);
        
        return m.callSelectStoredProcedure("get_student",map,fields);
    }
    
    

    
    
    @POST
    @Path("/updatestudent")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateEstudianteDeportes(java.io.InputStream params) {
        String fields[] = {"id_estudiante_deportes", "id_tipo_documento", "numero_documento", "email", "peso", "estatura", "cualidades_especiales", "id_disciplina"};
        return m.callResultStoredProcedure("update_student", fields, params);

    }

    
    
    @POST
    @Path("/deletestudent")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteEstudianteDeportes(java.io.InputStream params) {

        String fields[] = {"id_estudiante_deportes"};
        return m.callResultStoredProcedure("delete_student", fields, params);

    }
    
    
    
    
    
    
    
    
    
    
    
    @POST
    @Path("/createteam")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String createTeam(java.io.InputStream params) {

        String fields[] = {"nombre", "descripcion", "especialidad", "estado"};

        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("create_team", map, fields);

    }
    
    
    @GET
    @Path("/teams")
    @Produces(MediaType.APPLICATION_JSON)
    public String getTeams() {
        return m.callSelectStoredProcedure("get_teams");
    }
    
    
    
    @GET
    @Path("/teams/{id_seleccion}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getTeam(@PathParam("id_seleccion") String id_seleccion) {
        String fields[] = {"id_seleccion"};
        java.util.Map<String, String> map = new HashMap<>();
        map.put("id_seleccion", id_seleccion);
        
        return m.callSelectStoredProcedure("get_team",map,fields);
    }
    
    

    
    
    @POST
    @Path("/updateteam")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateTeam(java.io.InputStream params) {

        String fields[] = {"id_seleccion", "nombre", "descripcion", "especialidad", "estado"};
        return m.callResultStoredProcedure("update_team", fields, params);

    }

    
    
    @POST
    @Path("/deleteteam")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteTeam(java.io.InputStream params) {

        String fields[] = {"id_seleccion"};
        return m.callResultStoredProcedure("delete_team", fields, params);

    }
    
    
    
    
    
    
    
    
    @GET
    @Path("/persontypes")
    @Produces(MediaType.APPLICATION_JSON)
    public String getPersonTypes() {
        return m.callSelectStoredProcedure("get_person_types");
    }
    
    
    
    
    
    @GET
    @Path("/semesters")
    @Produces(MediaType.APPLICATION_JSON)
    public String getSemesters() {
        return m.callSelectStoredProcedure("get_semesters");
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    @POST
    @Path("/createchampionship")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String createChampionship(java.io.InputStream params) {

        String fields[] = {"id_seleccion","nombre", "fecha", "victorioso", "observaciones"};

        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("create_championship", map, fields);

    }
    
    
    @GET
    @Path("/championships")
    @Produces(MediaType.APPLICATION_JSON)
    public String getChampionships() {
        return m.callSelectStoredProcedure("get_championships");
    }
    
    
    
    @GET
    @Path("/championships/{id_campeonato}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getChampionship(@PathParam("id_campeonato") String id_campeonato) {
        String fields[] = {"id_campeonato"};
        java.util.Map<String, String> map = new HashMap<>();
        map.put("id_campeonato", id_campeonato);
        
        return m.callSelectStoredProcedure("get_championship",map,fields);
    }
    
    

    
    
    @POST
    @Path("/updatechampionship")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateChampionship(java.io.InputStream params) {

        String fields[] = {"id_campeonato", "id_seleccion","nombre", "fecha", "victorioso", "observaciones"};
        return m.callResultStoredProcedure("update_championship", fields, params);

    }

    
    
    @POST
    @Path("/deletechampionship")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteChampionship(java.io.InputStream params) {

        String fields[] = {"id_campeonato"};
        return m.callResultStoredProcedure("delete_championship", fields, params);

    }
    
    
    
    
    

    
    
    @GET
    @Path("/searchpersons")
    @Produces(MediaType.APPLICATION_JSON)
    public String searchPerson(java.io.InputStream params) {
        String fields[] = {"identificacion", "nombre_completo"};
        
        return m.searchPerson(fields, params);
        //return m.callResultStoredProcedure("search_person", fields, params);
    }
    
    
    
    
    @POST
    @Path("/createperson")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String createPerson(java.io.InputStream params) {

        String fields[] = { "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "fecha_nacimiento", "sexo", "email", "telefono","id_tipo_documento","numero_documento"};

        java.util.Map<String, String> map = m.createMap(fields, params);
        System.out.println(map.get("numero_documento"));
        return m.callResultStoredProcedure("create_person", map, fields);

    }
    
}
