/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.HashSet;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.*;
import javax.json.JsonValue.ValueType;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.core.Context;
import structures.JsonResponse;

/**
 *
 * @author Andres
 */
public class Manager {

    private JsonResponse response;
    private HttpServletRequest request;

    public Manager(HttpServletRequest request) {
        response = new JsonResponse();
        this.request = request;
        HttpSession ses = request.getSession();

    }

    private boolean isSessionExpired() {
        HttpSession ses = request.getSession();
        //System.out.println("is new: "+ses.isNew());
        //return ses.isNew();
        return false;
    }

    public String toPassword(String password) {
        StringBuilder sb = new StringBuilder();
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(password.getBytes());

            byte byteData[] = md.digest();
            for (int i = 0; i < byteData.length; i++) {
                sb.append(Integer.toString((byteData[i] & 0xff) + 0x100, 16).substring(1));
            }
        } catch (NoSuchAlgorithmException ex) {
            Logger.getLogger(Manager.class.getName()).log(Level.SEVERE, null, ex);
        }
        return sb.toString();
    }

    public String performGet(String query) {
        if (!response.setSessionExpired(isSessionExpired())) {
            response.fillData(query);
            response.setSuccess(true);
        }
        return response.getJsonData();
    }

    public String callSelectStoredProcedure(String procedure_name) {

        if (!response.setSessionExpired(isSessionExpired())) {
            response.callSelectStoredProcedure(procedure_name);
            response.setSuccess(response.getMessage().length() == 0);
        }
        return response.getJsonData();
    }

    public String callSelectStoredProcedure(String procedure_name, java.util.Map<String, String> map, String fields[]) {

        if (!response.setSessionExpired(isSessionExpired())) {
            response.callSelectStoredProcedure(procedure_name, map, fields);
            response.setSuccess(true);
        }

        return response.getJsonData();
    }

    public java.util.Map<String, String> createMap(String fields[], java.io.InputStream params) {
        java.util.Map<String, String> map = new HashMap<>();
        try {
            
            JsonReader reader = Json.createReader(params);
            JsonObject jsonObject = reader.readObject();
            reader.close();

            ValueType vt;
            JsonValue jv;

            for (int i = 0; i < fields.length; i++) {
                String field = fields[i];
                jv = jsonObject.get(field);
                vt = jv.getValueType();
                if (vt == vt.NUMBER) {
                    map.put(field, jsonObject.getInt(field) + "");
                } else if (vt == vt.TRUE || vt == vt.FALSE) {
                    map.put(field, jsonObject.getBoolean(field) + "");
                } else {
                    map.put(field, jsonObject.getString(field));
                }

            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return map;
    }

    public String callResultStoredProcedure(String operation, java.util.Map<String, String> map, String fields[]) {
        if (!response.setSessionExpired(isSessionExpired())) {
            response.callResultStoredProcedure(operation, map, fields);
        }
        return response.getJsonData();
    }

    public String callResultStoredProcedure(String operation, String fields[], java.io.InputStream params) {

        try {
            java.util.Map<String, String> map = createMap(fields, params);
            return callResultStoredProcedure(operation, map, fields);

        } catch (Exception e) {
            e.printStackTrace(System.out);
        }

        return "";
    }

    public String login(java.io.InputStream params) {
        String fields[] = {"id_usuario", "clave"};
        java.util.Map<String, String> map = createMap(fields, params);
        map.replace("clave", toPassword(map.get("clave")));
        //map.replace("clave", "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918");
        try {

            ResultSet rs = new DBManager().callGetProcedure("do_login", map, fields);
            response.setResultSet(rs);

            HttpSession ses = request.getSession();

            rs.beforeFirst();
            boolean flag = false;
            while (rs.next()) {
                ses.setAttribute("id_usuario", rs.getString("id_usuario"));
                ses.setAttribute("nombres", rs.getString("nombres"));
                ses.setAttribute("apellidos", rs.getString("apellidos"));
                ses.setAttribute("nombre", rs.getString("nombre"));
                ses.setAttribute("email", rs.getString("email"));
                ses.setAttribute("telefono", rs.getString("telefono"));
                ses.setAttribute("hasClinica", rs.getBoolean("hasClinica"));
                ses.setAttribute("hasDeportes", rs.getBoolean("hasDeportes"));
                ses.setAttribute("hasProgramaSalud", rs.getBoolean("hasProgramaSalud"));
                ses.setAttribute("isAdmin", rs.getBoolean("isAdmin"));
                ses.setAttribute("cambiar_clave", rs.getBoolean("cambiar_clave"));

                flag = true;
            }

            response.setSuccess(flag);
            response.setSessionExpired(false);
            response.setMessage(!flag ? "Usuario o contraseña incorrectos" : "");

            rs.beforeFirst();

        } catch (Exception e) {
            e.printStackTrace(System.out);
        }

        return response.getJsonData();
    }

    public String forgotPassword(java.io.InputStream params) {
        String fields[] = {"id_usuario", "email"};
        java.util.Map<String, String> map = createMap(fields, params);
        String clavenueva = utils.RandomString.generateRandomString(6);
        map.put("clave", toPassword(clavenueva));
        String fields2[] = {"id_usuario", "email", "clave"};

        try {

            DBManager dm = new DBManager();
            java.sql.CallableStatement result = dm.callResultProcedure("do_password_reset", map, fields2);

            if(result.getInt(fields2.length + 1) > 0){
                
                        utils.SendEmail se = new utils.SendEmail();

            se.sendRecoverMyPasswordEmail(map.get("email").toLowerCase(), result.getString(fields2.length+2), clavenueva);
            }
            
           
            
            response.setSuccess(true);
            response.setSessionExpired(false);
            response.setMessage("Se enviará un correo con la nueva clave si el correo existe, revise en SPAM");
            

        } catch (Exception e) {
            e.printStackTrace(System.out);
        }

        return response.getJsonData();
    }
    
    
    

    public String changePassword(java.io.InputStream params) {
        String fields[] = {"id_usuario", "clave", "nuevaclave1", "nuevaclave2"};
        java.util.Map<String, String> map = createMap(fields, params);
        
        String nuevaclave1=map.get("nuevaclave1");
        String nuevaclave2=map.get("nuevaclave2");
        if(!nuevaclave1.equals(nuevaclave2)){
            response.setSuccess(false);
            response.setMessage("Las claves no coinciden");
            return response.getJsonData();
        }
        
        java.util.Map<String, String> map2=new java.util.HashMap<>();
        
        map2.put("id_usuario",map.get("id_usuario"));
        map2.put("clave",toPassword(map.get("clave")));
        map2.put("nueva_clave",toPassword(map.get("nuevaclave1")));
        String fields2[] = {"id_usuario", "clave", "nueva_clave"};

        try {

            DBManager dm = new DBManager();
            java.sql.CallableStatement result = dm.callResultProcedure("do_password_change", map2, fields2);

            response.setSuccess(result.getInt(fields2.length + 1) > 0);
            response.setMessage(result.getString(fields2.length+2));
            response.setSessionExpired(false);
            
            if(response.getSuccess()){
                
               HttpSession ses = request.getSession();
               ses.setAttribute("cambiar_clave", Boolean.FALSE);
            }
            
            

        } catch (Exception e) {
            e.printStackTrace(System.out);
        }

        return response.getJsonData();
    }
    
    
    

    public String searchPerson(java.io.InputStream params) {
        String fields[] = {"identificacion", "nombre_completo","telefono_correo", "fecha_nacimiento"};
        java.util.Map<String, String> map = new HashMap<>();
        
        for (String field : fields) {
            map.put(field, request.getParameter(field));
        }
        return callSelectStoredProcedure("search_person",map,fields);
    }

}
