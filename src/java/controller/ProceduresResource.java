/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;

import java.util.HashMap;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;

/**
 * REST Web Service
 *
 * @author Carlos.Ruiz
 */
@Path("procedures")
public class ProceduresResource {
  @Context
    private UriInfo context;
    
    private Manager m;
    /**
     * Creates a new instance of ProcedimientosResource
     */
    public ProceduresResource(@Context HttpServletRequest request) {
         m = new Manager(request);
    }

    @GET
    @Path("")
    @Produces(MediaType.APPLICATION_JSON)
    public String get() {
        return m.callSelectStoredProcedure("get_procedimientos");
    }
    
    @GET
    @Path("/details/{id_procedimiento}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getDetails(@PathParam("id_procedimiento") String id_procedimiento) {
          String fields[] = {"id_procedimiento"};
        java.util.Map<String, String> map = new HashMap<>();
        map.put("id_procedimiento", id_procedimiento);  
        return m.callSelectStoredProcedure("get_procedimiento_material",map,fields);        
    }
    
    @POST
    @Path("create")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String post(java.io.InputStream params) {
        String fields[] = {"descripcion", "activo"};
        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("create_procedimiento2",map,  fields);  
                
    }
    
     @POST
    @Path("creatematerial")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String createMaterial(java.io.InputStream params) {
        String fields[] = {"id_procedimiento", "id_material", "cantidad"};
        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("create_procedimiento_material",map,  fields);  
                
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
    
    @POST
    @Path("deletematerial")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String deletematerial(java.io.InputStream params) {
      
        String fields[] = { "id_procedimiento", "id_material"};
        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("delete_procedimiento_material",map,  fields);        
    }
}
