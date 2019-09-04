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
@Path("materials")
public class MaterialsResource {

    @Context
    private UriInfo context;
    
    private Manager m;

    /**
     * Creates a new instance of MaterialesResource
     */
    public MaterialsResource(@Context HttpServletRequest request) {
        m = new Manager(request);
    }

    @GET
    @Path("")
    @Produces(MediaType.APPLICATION_JSON)
    public String get() {
        return m.callSelectStoredProcedure("get_materials");
    }
    
    @POST
    @Path("")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String post(java.io.InputStream params) {
        /*
        String fields[] = {"id_doctor", "id_usuario"};
        return m.callResultStoredProcedure("update_doctor", fields, params);
        
        */
        String fields[] = {"id_material", "nombre", "descripcion", "activo", "existencia", "alerta"};
        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("update_materials",map,  fields);        
    }
    
    @POST
    @Path("create")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String create(java.io.InputStream params) {
        /*
        String fields[] = {"id_doctor", "id_usuario"};
        return m.callResultStoredProcedure("update_doctor", fields, params);
        
        */
        String fields[] = { "nombre", "descripcion", "activo"};
        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("create_materials",map,  fields);        
    }
    
     @POST
    @Path("delete")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String delete(java.io.InputStream params) {
        /*
        String fields[] = {"id_doctor", "id_usuario"};
        return m.callResultStoredProcedure("update_doctor", fields, params);
        
        */
        String fields[] = { "id_material"};
        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("delete_materials",map,  fields);        
    }
    
    
    
}
