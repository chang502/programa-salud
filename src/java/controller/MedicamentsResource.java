/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.core.MediaType;
/**
 * REST Web Service
 *
 * @author Carlos.Ruiz
 */
@Path("medicaments")
public class MedicamentsResource {

    @Context
    private UriInfo context;
    
    private Manager m;

    /**
     * Creates a new instance of MedicamentosResource
     */
    public MedicamentsResource(@Context HttpServletRequest request) {
         m = new Manager(request);
    }

     @GET    
    @Produces(MediaType.APPLICATION_JSON)
    public String get() {
        return m.callSelectStoredProcedure("get_medicamentos");
    }

   @POST    
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String post(java.io.InputStream params) {
   
        String fields[] = {"id_medicamento", "nombre", "presentacion", "activo", "existencia", "alerta"};        
        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("update_medicamento",map,  fields);        
    }
    
    @POST
    @Path("create")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String create(java.io.InputStream params) {
     
        String fields[] = { "nombre", "presentacion", "activo"};
        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("create_medicamento",map,  fields);        
    }
    
     @POST
    @Path("delete")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String delete(java.io.InputStream params) {
      
        String fields[] = { "id_medicamento"};
        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("delete_medicamento",map,  fields);        
    }
}
