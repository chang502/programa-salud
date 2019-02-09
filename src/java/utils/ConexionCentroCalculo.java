/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utils;

import structures.*;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.json.JsonValue;

/**
 *
 * @author Andres
 */
public class ConexionCentroCalculo {

    private static enum tipoWs {
        DATOS_ESTUDIANTE,
        CARRERA_ESTUDIANTE,
        DATOS_EMPLEADO
    }
    


    public static HttpURLConnection getEstudiante(String numeroCarnet) {
        //Persona resp = null;
        String strOperacion = "datosPersonalesSimple";
        try {
            
            String url = "http://172.16.8.162:9090/fiusac-web-process/apiProcess/get/ejecutarMetodoWS/";
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            
            con.setConnectTimeout(3000);
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            con.setRequestProperty("Cache-Control", "no-cache");
            con.setRequestProperty("charset", "UTF-8");
            
            
            String strUser = "990067900";
            String strPassword = "ws-sa7ud";
            String strReference = "";
            
            String strParametros = "";
            
            
            strParametros = URLEncoder.encode("Carnet=" + numeroCarnet, "UTF-8");
            
            String StrMetadata = "test";
            
            String urlParameters = "strUser=" + strUser + "&strPassword=" + strPassword + "&strReference=" + strReference + "&strOperacion=" + strOperacion + "&strParametros=" + strParametros + "&StrMetadata=" + StrMetadata;
            
            //System.out.println(urlParameters);
            
            // Send post request
            con.setDoOutput(true);
            
            DataOutputStream wr = new DataOutputStream(con.getOutputStream());
            
            wr.writeBytes(urlParameters);
            
            /*BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(wr, "ASCII"));
            bw.write(urlParameters);
            bw.flush();
            bw.close();*/
            
            wr.flush();
            wr.close();
            
            
            return con;
        } catch (Exception ex) {
            System.err.println("Webservice '"+strOperacion+"' no disponible: "+ex.getMessage());
        }
        return null;
    }
    
    
    


    public static HttpURLConnection getTrabajador(String cui) {
        //Persona resp = null;
        String strOperacion = "datosPersonalesTrabajador";
        try {
            
            String url = "http://172.16.8.162:9090/fiusac-web-process/apiProcess/get/ejecutarMetodoWS/";
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            
            con.setConnectTimeout(3000);
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            con.setRequestProperty("Cache-Control", "no-cache");
            
            String strUser = "990067900";
            String strPassword = "ws-sa7ud";
            String strReference = "";
            
            String strParametros = "";
            
            strParametros = URLEncoder.encode("CUI=" + cui, "UTF-8");
            
            String StrMetadata = "test";
            
            String urlParameters = "strUser=" + strUser + "&strPassword=" + strPassword + "&strReference=" + strReference + "&strOperacion=" + strOperacion + "&strParametros=" + strParametros + "&StrMetadata=" + StrMetadata;
            
            //System.out.println(urlParameters);
            
            // Send post request
            con.setDoOutput(true);
            
            DataOutputStream wr = new DataOutputStream(con.getOutputStream());
            wr.writeBytes(urlParameters);
            wr.flush();
            wr.close();
            
            return con;
        } catch (Exception ex) {
            System.err.println("Webservice '"+strOperacion+"' no disponible: "+ex.getMessage());
        }
        return null;
    }

    
    
    

    
    
    

}
