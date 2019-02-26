
package utils;

import java.io.DataOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;


/**
 *
 * @author Andres
 */
public class ConexionCentroCalculo {

private static final int TIMEOUT = 3000;
private static final String URL = "http://172.16.240.70:9090/fiusac-web-process/apiProcess/get/ejecutarMetodoWS/";

    public static HttpURLConnection getEstudiante(String numeroCarnet) {
        //Persona resp = null;
        String strOperacion = "datosPersonalesSimple";
        try {
            
            //String url = "http://172.16.240.70:9090/fiusac-web-process/apiProcess/get/ejecutarMetodoWS/";
            URL obj = new URL(URL);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            
            con.setConnectTimeout(TIMEOUT);
            
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
            
            
            URL obj = new URL(URL);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            
            con.setConnectTimeout(TIMEOUT);
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

    
    
    

    
    
    
    


    public static HttpURLConnection getEstudianteCarrera(String carnet) {
        //Persona resp = null;
        String strOperacion = "carrerasEstudiante";
        try {
            
            URL obj = new URL(URL);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            
            con.setConnectTimeout(TIMEOUT);
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            con.setRequestProperty("Cache-Control", "no-cache");
            
            String strUser = "990067900";
            String strPassword = "ws-sa7ud";
            String strReference = "";
            
            String strParametros = "";
            
            strParametros = URLEncoder.encode("Carnet=" + carnet, "UTF-8");
            
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
