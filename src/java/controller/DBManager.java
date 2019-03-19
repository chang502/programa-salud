/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;

import java.sql.*;
import java.util.Properties;

/**
 *
 * @author Andres
 */
public class DBManager {

    static final String DRIVER = "org.mariadb.jdbc.Driver";

    private static String connectionstring;
    private static String user;
    private static String password;

    private static Connection conn;

    private static void loadProperties() {
        if (connectionstring != null) {
            return;
        }
        try {
            Properties prop = new Properties();
            String conf_path=System.getenv("PROSALUD_CONFIG");
            String db_conf_file=conf_path+java.io.File.separator+"database.properties";
            //System.out.println(db_conf_file);
            prop.load(new java.io.FileInputStream(db_conf_file));
            connectionstring = prop.getProperty("connectionstring");
            user = prop.getProperty("user");
            password = prop.getProperty("password");

        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace(System.err);
        }
    }

    private static void connect() {

        try {
            if (conn != null && !conn.isClosed()) {
                //System.out.println("connection already created");
                return;
            }
            //System.out.println("Creating the connection");
            Class.forName("org.mariadb.jdbc.Driver");
            conn = DriverManager.getConnection(connectionstring, user, password);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            System.out.println(e.toString());
        }
    }

    public DBManager() {
        loadProperties();
        connect();
    }

    public ResultSet getResultSet(String query) {
        try {
            return conn.createStatement().executeQuery(query);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    public ResultSet callGetProcedure(String procedure_name) throws Exception {

        String query = "{ call " + procedure_name + "() }";

        CallableStatement stmt = conn.prepareCall(query);

        if (stmt.execute()) {
            return stmt.getResultSet();
        }

        return null;

    }

    public ResultSet callGetProcedure(String procedure_name, java.util.Map<String, String> params, String fields[]) throws Exception {

        String param_list = "";
        for (int i = 0; i < params.size(); i++) {
            param_list += "?,";
        }
        if (params.size() > 0) {
            param_list = param_list.substring(0, param_list.length() - 1);
        }

        String query = "{ call " + procedure_name + "(" + param_list + ") }";

        CallableStatement stmt = conn.prepareCall(query);

        for (int i = 0; i < fields.length; i++) {
            stmt.setString(i + 1, params.get(fields[i]));
        }

        if (stmt.execute()) {
            return stmt.getResultSet();
        }

        return null;

    }

    public CallableStatement callResultProcedure(String procedure, java.util.Map<String, String> params, String fields[]) throws Exception {

        String param_list = "";
        for (int i = 0; i < fields.length; i++) {
            param_list += "?,";
        }

        if (fields.length > 0) {
            param_list = param_list.substring(0, param_list.length() - 1);
        }

        String query = "{ call " + procedure + "(" + param_list + ",?,?) }";//2 parámetros más para el id y el mensaje

        CallableStatement stmt = conn.prepareCall(query);

        for (int i = 0; i < fields.length; i++) {
            stmt.setString(i + 1, params.get(fields[i]));
        }
        stmt.registerOutParameter(fields.length + 1, java.sql.Types.INTEGER);//"o_result"
        stmt.registerOutParameter(fields.length + 2, java.sql.Types.VARCHAR);//"o_mensaje"

        stmt.executeUpdate();

        return stmt;

    }

    public CallableStatement callResultProcedureWith4Outputs(String procedure, java.util.Map<String, String> params, String fields[]) throws Exception {

        String param_list = "";
        for (int i = 0; i < fields.length; i++) {
            param_list += "?,";
        }

        if (fields.length > 0) {
            param_list = param_list.substring(0, param_list.length() - 1);
        }

        String query = "{ call " + procedure + "(" + param_list + ",?,?,?,?) }";//2 parámetros más para el id y el mensaje

        CallableStatement stmt = conn.prepareCall(query);

        for (int i = 0; i < fields.length; i++) {
            stmt.setString(i + 1, params.get(fields[i]));
        }
        stmt.registerOutParameter(fields.length + 1, java.sql.Types.INTEGER);//"o_result"
        stmt.registerOutParameter(fields.length + 2, java.sql.Types.VARCHAR);//"o_mensaje"
        stmt.registerOutParameter(fields.length + 3, java.sql.Types.INTEGER);//"o_id_persona"
        stmt.registerOutParameter(fields.length + 4, java.sql.Types.VARCHAR);//"o_nombre_completo"

        stmt.executeUpdate();

        return stmt;

    }

}
