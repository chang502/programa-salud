/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.*;
import javax.json.JsonValue.ValueType;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import structures.JsonResponse;

/**
 *
 * @author Andres
 */
public class Manager {

    private JsonResponse response;
    private HttpServletRequest request;

    private final static String ENCODING = "UTF-8";

    public Manager(HttpServletRequest request) {
        response = new JsonResponse();
        this.request = request;
        HttpSession session = request.getSession();
        response.setSessionExpired(session == null || session.getAttribute("id_usuario") == null);
    }

    public HttpServletRequest getRequest() {
        return this.request;
    }

    public JsonResponse getResponse() {
        return this.response;
    }

    public boolean isSessionExpired() {
        HttpSession session = request.getSession();

        return session == null || session.getAttribute("id_usuario") == null;
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
                if (jv == null) {
                    map.put(field, null);
                } else {
                    vt = jv.getValueType();
                    if (vt == vt.NUMBER) {
                        map.put(field, jsonObject.getInt(field) + "");
                    } else if (vt == vt.TRUE || vt == vt.FALSE) {
                        map.put(field, jsonObject.getBoolean(field) + "");
                    } else if (vt == vt.ARRAY) {
                        System.out.println("Es Array!!!!");
                        JsonArray ja = jsonObject.getJsonArray(field);
                        for (int j = 0; j < ja.size(); j++) {

                            System.out.println("ja: " + j);
                            JsonValue jsv = ja.get(j);
                            ValueType vst = jsv.getValueType();
                            if (vst == vst.NUMBER) {
                                System.out.println(ja.getInt(j));
                            } else if (vst == vst.TRUE || vst == vt.FALSE) {
                                System.out.println(ja.getInt(j));
                            } else {
                                System.out.println(ja.getString(j));
                            }

                        }
                    } else {
                        map.put(field, jsonObject.getString(field));
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return map;
    }

    public String tomarMedidas(java.io.InputStream params) {

        try {
            JsonReader reader = Json.createReader(params);
            JsonObject jo = reader.readObject();
            reader.close();

            ValueType vt;
            JsonValue jv;

            String id_cita = jo.getInt("id_cita") + "";
            String id_persona = jo.getInt("id_persona") + "";

            JsonArray jam = jo.getJsonArray("id_medida");
            JsonArray jav = jo.getJsonArray("valor");

            String tmp = null;

            String fields[] = {"id_medida", "id_persona", "id_cita", "valor"};
            for (int i = 0; i < jam.size(); i++) {
                tmp = jav.getString(i);
                if (tmp != null && !tmp.equals("")) {

                    java.util.Map<String, String> map2 = new HashMap<>();
                    map2.put("id_medida", jam.getString(i));
                    map2.put("id_persona", id_persona);
                    map2.put("id_cita", id_cita);
                    map2.put("valor", tmp);
                    String medida=this.callResultStoredProcedure("create_persona_medida", map2, fields);
                    //System.out.println(medida);

                }
            }

            /*response.setSuccess(true);
            response.setSessionExpired(false);
            response.setMessage("Medidas ingresadas correctamente" );*/
            return "{\"success\":true,\"sessionexpired\":false,\"message\":\"Medidas ingresadas correctamente\",\"rows\":0,\"data\":[]}";
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return "{\"success\":false,\"sessionexpired\":false,\"message\":\"" + e.getMessage() + "\",\"rows\":0,\"data\":[]}";
        }
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

    public String callResultStoredProcedureWith4Outputs(String operation, java.util.Map<String, String> map, String fields[]) {
        if (!response.setSessionExpired(isSessionExpired())) {
            response.callResultStoredProcedureWith4Outputs(operation, map, fields);
        }
        return response.getJsonData();
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
                ses.setAttribute("nombre", rs.getString("nombre"));
                ses.setAttribute("apellido", rs.getString("apellido"));
                ses.setAttribute("nombre_completo", rs.getString("nombre_completo"));
                ses.setAttribute("email", rs.getString("email"));
                ses.setAttribute("telefono", rs.getString("telefono"));
                ses.setAttribute("hasClinica", rs.getBoolean("hasClinica"));
                ses.setAttribute("hasDeportes", rs.getBoolean("hasDeportes"));
                ses.setAttribute("hasProgramaSalud", rs.getBoolean("hasProgramaSalud"));
                ses.setAttribute("hasPlayground", rs.getBoolean("hasPlayground"));
                ses.setAttribute("hasIngresoDatos", rs.getBoolean("hasIngresoDatos"));
                ses.setAttribute("hasInventarios", rs.getBoolean("hasInventarios"));
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

            if (result.getInt(fields2.length + 1) > 0) {

                utils.SendEmail se = new utils.SendEmail();

                se.sendRecoverMyPasswordEmail(map.get("email").toLowerCase(), result.getString(fields2.length + 2), clavenueva);
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

        String nuevaclave1 = map.get("nuevaclave1");
        String nuevaclave2 = map.get("nuevaclave2");
        if (!nuevaclave1.equals(nuevaclave2)) {
            response.setSuccess(false);
            response.setMessage("Las claves no coinciden");
            return response.getJsonData();
        }

        java.util.Map<String, String> map2 = new java.util.HashMap<>();

        map2.put("id_usuario", map.get("id_usuario"));
        map2.put("clave", toPassword(map.get("clave")));
        map2.put("nueva_clave", toPassword(map.get("nuevaclave1")));
        String fields2[] = {"id_usuario", "clave", "nueva_clave"};

        try {

            DBManager dm = new DBManager();
            java.sql.CallableStatement result = dm.callResultProcedure("do_password_change", map2, fields2);

            response.setSuccess(result.getInt(fields2.length + 1) > 0);
            response.setMessage(result.getString(fields2.length + 2));
            response.setSessionExpired(false);

            if (response.getSuccess()) {

                HttpSession ses = request.getSession();
                ses.setAttribute("cambiar_clave", Boolean.FALSE);
            }

        } catch (Exception e) {
            e.printStackTrace(System.out);
        }

        return response.getJsonData();
    }

    private String getCcWsResponseMetadata(java.io.InputStream is) {

        try {

            //java.io.InputStreamReader isr=new java.io.InputStreamReader(is,"UTF-8");
            //BufferedReader bfreader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
            BufferedReader bfreader = new BufferedReader(new InputStreamReader(is, ENCODING));

            JsonReader reader = Json.createReader(bfreader);
            JsonObject jsonObject = reader.readObject();
            reader.close();

            String metadata = jsonObject.getString("metadata");
            return metadata;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private String parseStudentCcWsResponseMetadata(String raw, String carrera) {
        try {
            java.io.InputStream is = new java.io.ByteArrayInputStream(raw.getBytes(ENCODING));
            JsonReader reader = Json.createReader(is);

            JsonArray jsonArray = reader.readArray();
            reader.close();

            if (jsonArray.isEmpty()) {
                return null;
            }
            JsonObject jsonObject = jsonArray.getJsonObject(0);

            java.util.Map<String, String> map = new java.util.HashMap<>();

            String fields[] = {"nombre", "apellido", "fechanacimiento", "sexo", "correo", "cui", "nov", "usuarioid", "carrera"};
            for (int i = 0; i < fields.length - 1; i++) {
                String field = fields[i];
                String tmp = null;
                try {
                    tmp = jsonObject.getString(field);
                } catch (Exception ff) {
                }
                map.put(field, tmp);
                //System.out.println(field+" - "+tmp);
            }

            map.put("carrera", carrera);

            String tmp = map.remove("fechanacimiento");
            map.put("fecha_nacimiento", tmp);

            tmp = map.remove("correo");
            map.put("email", tmp);

            tmp = map.remove("usuarioid");
            map.put("carnet", tmp);

            fields[2] = "fecha_nacimiento";
            fields[4] = "email";
            fields[7] = "carnet";

            return callSelectStoredProcedure("get_student_from_cc", map, fields);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private String getFieldFromCcWsResponseMetadata(String raw, String fieldname) {
        String resp = null;

        try {
            java.io.InputStream is = new java.io.ByteArrayInputStream(raw.getBytes(ENCODING));
            JsonReader reader = Json.createReader(is);

            JsonArray jsonArray = reader.readArray();
            reader.close();

            if (jsonArray.isEmpty()) {
                return null;
            }
            JsonObject jsonObject = jsonArray.getJsonObject(0);

            if (!jsonObject.isNull(fieldname)) {
                resp = jsonObject.getString(fieldname);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return resp;
    }

    private String parseEmployeeCcWsResponseMetadata(String raw) {
        try {
            //System.out.println(raw);
            java.io.InputStream is = new java.io.ByteArrayInputStream(raw.getBytes(ENCODING));
            JsonReader reader = Json.createReader(is);
            //JsonObject jsonObject = reader.readObject();

            JsonArray jsonArray = reader.readArray();
            reader.close();

            if (jsonArray.isEmpty()) {
                return null;
            }

            JsonObject jsonObject = jsonArray.getJsonObject(0);

            java.util.Map<String, String> map = new java.util.HashMap<>();

            String fields[] = {"nombre", "apellido", "fechanacimiento", "sexo", "correo", "cui", "regpersonal", "departamento"};
            for (int i = 0; i < fields.length; i++) {
                String field = fields[i];
                String tmp = null;
                try {
                    tmp = jsonObject.getString(field);
                } catch (Exception ff) {
                }
                map.put(field, tmp);
            }

            String tmp = map.remove("fechanacimiento");
            map.put("fecha_nacimiento", tmp);

            tmp = map.remove("correo");
            map.put("email", tmp);

            fields[2] = "fecha_nacimiento";
            fields[4] = "email";

            //System.out.println("regpersonal: '"+map.get("regpersonal")+"'");
            return callSelectStoredProcedure("get_employee_from_cc", map, fields);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String searchPerson(String fields[], java.io.InputStream params) {

        String identificacion = request.getParameter("identificacion");
        String tipo_persona = request.getParameter("tipo_persona");

        if (tipo_persona.equals("ESTUDIANTE") || tipo_persona.equals("TRABAJADOR")) {
            HttpURLConnection con = null;
            if (tipo_persona.equals("ESTUDIANTE")) {
                try {
                    con = utils.ConexionCentroCalculo.getEstudiante(identificacion);

                    java.util.Map<String, String> map = new java.util.HashMap<>();

                    String fields2[] = {"carnet"};
                    map.put("carnet", identificacion);

                    if (con != null && con.getResponseCode() == 200) {

                        java.io.InputStream is = con.getInputStream();

                        String ws_response = getCcWsResponseMetadata(is);
                        //carrera
                        con = utils.ConexionCentroCalculo.getEstudianteCarrera(identificacion);
                        String ws_response_carrera = getCcWsResponseMetadata(con.getInputStream());
                        //System.out.println(ws_response);
                        String carrera = getFieldFromCcWsResponseMetadata(ws_response_carrera, "carrera");
                        //String carrera="09";
                        //!carrera
                        String resp = parseStudentCcWsResponseMetadata(ws_response, carrera);

                        //System.out.println(ws_response_carrera);
                        return resp == null ? callSelectStoredProcedure("search_person_by_carnet", map, fields2) : resp;
                    } else {

                        return callSelectStoredProcedure("search_person_by_carnet", map, fields2);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else if (tipo_persona.equals("TRABAJADOR")) {
                try {
                    con = utils.ConexionCentroCalculo.getTrabajador(identificacion);

                    java.util.Map<String, String> map = new java.util.HashMap<>();

                    String fields2[] = {"cui"};
                    map.put("cui", identificacion);
                    if (con != null && con.getResponseCode() == 200) {

                        String ws_response = getCcWsResponseMetadata(con.getInputStream());
                        String resp = parseEmployeeCcWsResponseMetadata(ws_response);
                        //System.out.println(resp);
                        return resp == null ? callSelectStoredProcedure("search_person_by_cui", map, fields2) : resp;
                    } else {
                        return callSelectStoredProcedure("search_person_by_cui", map, fields2);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } else if (tipo_persona.equals("TODOS")) {
            java.util.Map<String, String> map = new java.util.HashMap<>();

            String fields2[] = {"id"};
            map.put("id", identificacion);
            return callSelectStoredProcedure("search_person_by_any_id", map, fields2);
        }

        return "{}";
    }

    public String actualizarDatosTrabajador(java.util.Map<String, String> params, String fields[]) {
        if (response.setSessionExpired(isSessionExpired())) {
            return response.getJsonData();
        }
        try {

            try {
                HttpURLConnection con = utils.ConexionCentroCalculo.getTrabajador(params.get("cui"));

                if (con != null && con.getResponseCode() == 200) {

                    java.io.InputStream is = con.getInputStream();
                    String ws_response = getCcWsResponseMetadata(is);

                    java.io.InputStream bais = new java.io.ByteArrayInputStream(ws_response.getBytes(ENCODING));
                    JsonReader reader = Json.createReader(bais);

                    JsonArray jsonArray = reader.readArray();
                    reader.close();

                    boolean skip_json = false;

                    java.util.Map<String, String> map = new java.util.HashMap<>();

                    if (jsonArray.isEmpty()) {

                        String fields_cui_search[] = {
                            "cui"
                        };
                        java.util.Map<String, String> params_cui_search = new java.util.HashMap<>();
                        params_cui_search.put("cui", params.get("cui"));

                        JsonResponse jrr = new JsonResponse();
                        jrr.callSelectStoredProcedure("get_person_details_by_cui", params_cui_search, fields_cui_search);

                        ResultSet rs = jrr.getResultSet();
                        int count = 0;
                        while (rs.next()) {
                            map.put("nombre", rs.getString("nombre"));
                            map.put("apellido", rs.getString("apellido"));
                            map.put("fecha_nacimiento", rs.getString("fecha_nacimiento"));
                            map.put("sexo", rs.getString("sexo"));
                            map.put("email", rs.getString("email"));
                            map.put("cui", rs.getString("cui"));
                            map.put("regpersonal", rs.getString("regpersonal"));
                            map.put("departamento", rs.getString("departamento"));
                            count++;
                        }

                        skip_json = count > 0;

                        if (!skip_json) {
                            response.setSuccess(false);
                            response.setMessage("No se encontraron registros");

                            return response.getJsonData();
                        }
                    }
                    
                    String fecha_nac_formatted;
                    
                    if (!skip_json) {
                        JsonObject jsonObject = jsonArray.getJsonObject(0);

                        String fields_rec[] = {"nombre", "apellido", "fechanacimiento", "sexo", "correo", "cui", "regpersonal", "departamento"};
                        for (int i = 0; i < fields_rec.length; i++) { //<8
                            String field = fields_rec[i];
                            String tmp = null;
                            try {
                                tmp = jsonObject.getString(field);
                            } catch (Exception ff) {
                            }
                            map.put(field, tmp);
                        }

                        String tmp = map.remove("fechanacimiento");
                        map.put("fecha_nacimiento", tmp);

                        tmp = map.remove("correo");
                        map.put("email", tmp);

                        fecha_nac_formatted = params.get("fecha_nacimiento");
                        fecha_nac_formatted = fecha_nac_formatted.substring(6, 10) + "-" + fecha_nac_formatted.substring(3, 5) + "-" + fecha_nac_formatted.substring(0, 2);
                    }else{
                        fecha_nac_formatted = map.get("fecha_nacimiento");
                    }
                    //System.out.println("cui: "+map.get("cui")+" - "+params.get("cui"));
                    if (map.get("cui").equals(params.get("cui"))
                            && (map.get("fecha_nacimiento") == null || map.get("fecha_nacimiento").equals(fecha_nac_formatted))) {
                        //System.out.println("Información coincide, persona identificada");
                        params.put("nombre", map.get("nombre"));
                        params.put("apellido", map.get("apellido"));
                        params.put("sexo", map.get("sexo"));
                        params.put("email", map.get("email"));
                        params.put("regpersonal", map.get("regpersonal"));
                        params.put("departamento", map.get("departamento"));

                        params.remove("fecha_nacimiento");
                        params.put("fecha_nacimiento", fecha_nac_formatted);

                        String fielfs[] = {"cui", "fecha_nacimiento", "telefono", "telefono_emergencia", "contacto_emergencia", "peso", "estatura", "flag_tiene_discapacidad", "id_tipo_discapacidad", "id_tipo_enfermedad", "id_disciplina_persona",
                            "nombre", "apellido", "sexo", "email", "regpersonal", "departamento"};

                        /*for (int i = 0; i < fielfs.length; i++) {
                            String fielf = fielfs[i];
                            System.out.println(fielf+": "+params.get(fielf));
                        }*/
                        return callResultStoredProcedure("registrar_datos_empleado", params, fielfs);

                    } else {
                        response.setSuccess(false);
                        response.setMessage("Los datos ingresados no coinciden, revise que el CUI y la fecha de nacimiento sean las correctas");
                        return response.getJsonData();
                    }

                } else {
                    response.setSuccess(false);
                    response.setMessage("No es posible realizar la búsqueda de personal en este momento");
                    return response.getJsonData();
                }
            } catch (Exception e) {
                e.printStackTrace(System.err);
                response.setSuccess(false);
                response.setMessage("Ocurrió un error: " + e.getMessage());
                return response.getJsonData();
            }

        } catch (Exception e) {
            e.printStackTrace(System.err);
            response.setSuccess(false);
            response.setMessage("Ocurrió un error: " + e.getMessage());
            return response.getJsonData();
        }

    }

}
