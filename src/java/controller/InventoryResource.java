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
 * REST Web Service
 *
 * @author Carlos.Ruiz
 */
@Path("inventory")
public class InventoryResource {

     @Context
    private UriInfo context;
    
    private Manager m;

    /**
     * Creates a new instance of InventoryResource
     */
    public InventoryResource(@Context HttpServletRequest request) {
          m = new Manager(request);
    }

    @POST
    @Path("create")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String post(java.io.InputStream params) {
        String fields[] = {"id_usuario", "tipo_inventario"};               
        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("create_entrada_inventario",map,  fields);  
                
    }
    
    @POST
    @Path("agregarMaterial")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String postMaterial(java.io.InputStream params) {
        String fields[] = {"id_entrada_inventario", "id_material","cantidad"};               
        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("create_entrada_inventario_material",map,  fields);  
                
    }
    
      @POST
    @Path("saveInventory")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String postSaveInventory(java.io.InputStream params) {
        String fields[] = {"id_entrada_inventario","observaciones"};               
        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("save_entrada_inventario",map,  fields);  
                
    }
    
    
    
    @POST
    @Path("agregarMedicamento")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String postMedicamento(java.io.InputStream params) {
        String fields[] = {"id_entrada_inventario", "id_medicamento","cantidad"};               
        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("create_entrada_inventario_medicamento",map,  fields);  
                
    }
    
    
    @POST
    @Path("deleteMedicamento")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String deleteMedicamento(java.io.InputStream params) {
        String fields[] = {"id_entrada_inventario", "id_medicamento"};               
        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("delete_entrada_inventario_medicamento",map,  fields);  
                
    }
    
    @POST
    @Path("deleteMaterial")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String deleteMaterial(java.io.InputStream params) {
        String fields[] = {"id_entrada_inventario", "id_material"};               
        java.util.Map<String, String> map = m.createMap(fields, params);
        return m.callResultStoredProcedure("delete_entrada_inventario_material",map,  fields);  
                
    }

   
}
