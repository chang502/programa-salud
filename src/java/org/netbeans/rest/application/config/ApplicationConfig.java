/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.netbeans.rest.application.config;

import java.util.Set;
import javax.ws.rs.core.Application;

/**
 *
 * @author Andres
 */
@javax.ws.rs.ApplicationPath("/controller")
public class ApplicationConfig extends Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        addRestResourceClasses(resources);
        return resources;
    }

    /**
     * Do not modify addRestResourceClasses() method.
     * It is automatically populated with
     * all resources defined in the project.
     * If required, comment out calling this method in getClasses().
     */
    private void addRestResourceClasses(Set<Class<?>> resources) {
        resources.add(controller.Controller.class);
        resources.add(controller.ImplementosResource.class);
        resources.add(controller.InventoryResource.class);
        resources.add(controller.MaterialsResource.class);
        resources.add(controller.MedicamentsResource.class);
        resources.add(controller.PrestamoResource.class);
        resources.add(controller.ProceduresResource.class);
    }
    
}
