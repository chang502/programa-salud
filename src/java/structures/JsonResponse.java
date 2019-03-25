/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package structures;

import controller.DBManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Types;

/**
 *
 * @author Andres
 */
public class JsonResponse {

    private boolean success;
    private boolean sessionexpired;
    private String message;
    private ResultSet rs;
    private String payload;
    private String idInsert;

    public JsonResponse() {
        this.success = true;
        this.sessionexpired = false;
        this.message = "";
        this.rs = null;
        this.payload = "";
        this.idInsert = "";
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public boolean setSessionExpired(boolean sessionexpired) {
        this.sessionexpired = sessionexpired;
        return sessionexpired;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void fillData(String str) {
        DBManager dm = new DBManager();

        this.rs = dm.getResultSet(str);
    }

    public void setResultSet(ResultSet result) {
        this.rs = result;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    public void setIdInsert(String id) {
        this.idInsert = id;
    }

    public void callSelectStoredProcedure(String procedure_name) {
        try {

            DBManager dm = new DBManager();
            this.rs = dm.callGetProcedure(procedure_name);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace(System.err);
            this.setSuccess(false);
            this.setMessage("Ocurrió un error: " + e.getMessage());
        }
    }

    public void callSelectStoredProcedure(String procedure_name, java.util.Map<String, String> params, String fields[]) {
        try {

            DBManager dm = new DBManager();
            this.rs = dm.callGetProcedure(procedure_name, params, fields);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace(System.err);
            this.setSuccess(false);
            this.setMessage("Ocurrió un error: " + e.getMessage());
        }
    }

    public void callResultStoredProcedure(String operation, java.util.Map<String, String> map, String fields[]) {
        try {
            DBManager dm = new DBManager();
            java.sql.CallableStatement result = dm.callResultProcedure(operation, map, fields);

            this.setSuccess(result.getInt(fields.length + 1) > 0);
            this.setIdInsert(result.getInt(fields.length + 1)+"");
            this.setMessage(result.getString(fields.length + 2));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace(System.err);
            this.setSuccess(false);
            this.setMessage("Ocurrió un error: " + e.getMessage());
        }

    }

    public void callResultStoredProcedureWith4Outputs(String operation, java.util.Map<String, String> map, String fields[]) {
        try {
            DBManager dm = new DBManager();
            java.sql.CallableStatement result = dm.callResultProcedureWith4Outputs(operation, map, fields);

            this.setSuccess(result.getInt(fields.length + 1) > 0);
            this.setMessage(result.getString(fields.length + 2));
            this.setPayload("{\"id_persona\": "+result.getInt(fields.length+3)+",\"nombre_completo\": \""+result.getString(fields.length+4)+"\"}");
            
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace(System.err);
            this.setSuccess(false);
            this.setMessage("Ocurrió un error: " + e.getMessage());
        }

    }

    public boolean getSuccess() {
        return this.success;
    }

    public boolean getSessionExpired() {
        
        return this.sessionexpired;
    }

    public String getMessage() {
        return this.message;
    }

    public String getPayload() {
        return this.payload;
    }
    
    public boolean hasPayload(){
        return this.payload.length()>0;
    }

    public String getIdInsert() {
        return this.idInsert;
    }

    public ResultSet getResultSet() {
        return this.rs;
    }

    public String getJsonData() {

        StringBuilder data = new StringBuilder();
        int rowcount = 0;

        if (!this.getSessionExpired() && rs != null) {
            try {
                ResultSetMetaData md = rs.getMetaData();

                int columncount = md.getColumnCount();

                int[] dtypes = new int[columncount];

                for (int i = 0; i < columncount; i++) {
                    dtypes[i] = md.getColumnType(i + 1);
                }

                while (rs.next()) {
                    data.append("{");

                    for (int i = 0; i < columncount; i++) {
                        data.append("\"");
                        data.append(md.getColumnLabel(i + 1));
                        data.append("\":");

                        data.append((dtypes[i] == Types.VARCHAR || dtypes[i] == Types.CHAR || dtypes[i] == Types.VARBINARY) ? "\"" : "");
                                
                        //Types.
                        //System.out.println(i + " " + md.getColumnName(i + 1) + ": " + dtypes[i] + "\twas null?: " + rs.wasNull());

                        data.append(dtypes[i] == Types.BIT ? rs.getBoolean(i + 1) ? "true" : "false" : dtypes[i] == Types.DECIMAL ? ((rs.getLong(i + 1)*0l==0l && rs.wasNull())?"null":rs.getLong(i + 1)): rs.getString(i + 1) != null ? rs.getString(i + 1).replaceAll("\"", "\'").replaceAll("\n", "\\\\n") : dtypes[i] == Types.INTEGER?((rs.getInt(i + 1)*0l==0l && rs.wasNull())?"null":rs.getInt(i + 1)): "");

                        data.append((dtypes[i] == Types.VARCHAR || dtypes[i] == Types.CHAR || dtypes[i] == Types.VARBINARY) ? "\"" : "");
                        data.append(",");
                    }
                    if (data.length() > 1) {
                        data.deleteCharAt(data.length() - 1);
                    }
                    rowcount++;
                    data.append("},");
                }

                if (data.length() > 0) {
                    data.deleteCharAt(data.length() - 1);
                } else {
                    //this.setMessage("No se encontraron registros");
                }

            } catch (Exception ex) {
                System.out.println(ex.getMessage());
                ex.printStackTrace(System.out);
                this.setSuccess(false);
                rowcount = -1;
                this.setMessage("Ocurrió un error: " + ex.getMessage().replaceAll("\"", "\'"));
            }
        } else if (this.getSessionExpired()) {
            this.setSuccess(false);
            this.setMessage("Sesión expirada");
        }

        StringBuilder sb = new StringBuilder();
        sb.append("{");

        sb.append("\"success\":");
        sb.append(this.getSuccess());
        sb.append(",");

        sb.append("\"sessionexpired\":");
        sb.append(this.getSessionExpired());
        sb.append(",");

        sb.append("\"message\":\"");
        sb.append(this.getMessage().replaceAll("\"", "\'"));
        sb.append("\",");
        
        if(this.hasPayload()){
            sb.append("\"payload\": ");
            sb.append(this.getPayload());
            sb.append(",");
        }

        sb.append("\"rows\":");
        sb.append(rowcount);
        sb.append(",");

        sb.append("\"data\":[");

        if (!this.getSessionExpired() && rs != null) {
            sb.append(data);
        }

        sb.append("]");

        sb.append("}");
        return sb.toString();
    }

}
