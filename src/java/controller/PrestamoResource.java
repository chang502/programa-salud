/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;

import java.util.HashMap;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;

/**
 *
 * @author Carlos.Ruiz
 */
@Path("prestamo")
public class PrestamoResource {
  @Context
    private UriInfo context;
    
    private Manager m;
    /**
     * Creates a new instance of ProcedimientosResource
     */
    public PrestamoResource(@Context HttpServletRequest request) {
         m = new Manager(request);
    }

    @GET
    @Path("")
    @Produces(MediaType.APPLICATION_JSON)
    public String get() {
        return m.callSelectStoredProcedure("get_prestamos");
    }
    
    @GET
    @Path("prestamocampo")
    @Produces(MediaType.APPLICATION_JSON)
    public String getPrestamoCampo() {
        return m.callSelectStoredProcedure("get_prestamoscampo");
    }
    
    @GET
    @Path("/person/cui/{cui}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getPersonCui(@PathParam("cui") String cui) {
          String fields[] = {"cui"};
        java.util.Map<String, String> map = new HashMap<>();
        map.put("cui", cui);  
        return m.callSelectStoredProcedure("search_person_by_cui",map,fields);        
    }
    
    @GET
    @Path("/person/carnet/{carnet}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getDetails(@PathParam("carnet") String carnet) {
          String fields[] = {"carnet"};
        java.util.Map<String, String> map = new HashMap<>();
        map.put("carnet", carnet);  
        return m.callSelectStoredProcedure("search_person_by_carnet",map,fields);        
    }
    
    @POST
    @Path("create")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String post(java.io.InputStream params) {
        String fields[] = {"id_persona", "id_implemento", "observacion", "telefono"};               
        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("create_prestamo",map,  fields);  
                
    }
    
    
    @POST
    @Path("create_prestamocampo")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String postPrestamoCampo(java.io.InputStream params) {
        String fields[] = {"id_persona", "fecha_prestamo", "hora","observacion","telefono"};               
        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("create_prestamocampo",map,  fields);  
                
    }
    
    @POST
    @Path("devolver")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String devolver(java.io.InputStream params) {
        String fields[] = {"id_prestamo", "observacion"};               
        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("update_prestamo",map,  fields);  
                
    }
    
      @POST
    @Path("delete_prestamocampo")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String deletePrestamoCampo(java.io.InputStream params) {
      
        String fields[] = { "id_prestamo_campo"};
        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("delete_prestamocampo",map,  fields);        
    }
    
    
    
     @POST
    @Path("delete")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String delete(java.io.InputStream params) {
      
        String fields[] = { "id_procedimiento"};
        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("delete_procedimientos",map,  fields);        
    }
    
   
}
