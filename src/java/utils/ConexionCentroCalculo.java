
package utils;

import java.io.DataOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Properties;


/**
 *
 * @author Andres
 */
public class ConexionCentroCalculo {

    //private static final int TIMEOUT = 3000;
    //private static final String URL = "http://172.16.240.70:9090/fiusac-web-process/apiProcess/get/ejecutarMetodoWS/";
    private static String timeout;
    private static String user;
    private static String password;
    private static String url;
    
    
    private static final String encoding="UTF-8";

    private static void loadProperties() {
        if (url != null) {
            return;
        }
        try {
            Properties prop = new Properties();
            String conf_path=System.getenv("PROSALUD_CONFIG");
            String db_conf_file=conf_path+java.io.File.separator+"webservice.properties";
            prop.load(new java.io.FileInputStream(db_conf_file));
            url = prop.getProperty("url");
            timeout = prop.getProperty("timeout");
            user = prop.getProperty("user");
            password = prop.getProperty("password");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace(System.err);
        }
    }
    
    public static HttpURLConnection getEstudiante(String numeroCarnet) {
        loadProperties();
        String strOperacion = "datosPersonalesSimple";
        try {
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            
            con.setConnectTimeout(Integer.parseInt(timeout));
            
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            con.setRequestProperty("Cache-Control", "no-cache");
            con.setRequestProperty("charset", encoding);
            
            
            String strUser = user;
            String strPassword = password;
            String strReference = "";
            
            String strParametros = "";
            
            strParametros = URLEncoder.encode("Carnet=" + numeroCarnet, encoding);
            
            
            String StrMetadata = "test";
            
            String urlParameters = "strUser=" + strUser + "&strPassword=" + strPassword + "&strReference=" + strReference + "&strOperacion=" + strOperacion + "&strParametros=" + strParametros + "&StrMetadata=" + StrMetadata;
            //String urlParameters = "strUser=" + strUser + "&strPassword=" + URLEncoder.encode(strPassword,encoding) + "&strReference=" + strReference + "&strOperacion=" + strOperacion + "&strParametros=" + strParametros + "&StrMetadata=" + StrMetadata;
            
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
    
    
    


    public static HttpURLConnection getTrabajador(String cui) {
        loadProperties();
        String strOperacion = "datosPersonalesTrabajador";
        try {
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            
            con.setConnectTimeout(Integer.parseInt(timeout));
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            con.setRequestProperty("Cache-Control", "no-cache");
            con.setRequestProperty("charset", encoding);
            
            String strUser = user;
            String strPassword = password;
            String strReference = "";
            
            String strParametros = "";
            
            strParametros = URLEncoder.encode("CUI=" + cui, encoding);
            
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
        loadProperties();
        String strOperacion = "carrerasEstudiante";
        try {
            
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            
            con.setConnectTimeout(Integer.parseInt(timeout));
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            con.setRequestProperty("Cache-Control", "no-cache");
            con.setRequestProperty("charset", encoding);
            
            String strUser = user;
            String strPassword = password;
            String strReference = "";
            
            String strParametros = "";
            
            strParametros = URLEncoder.encode("Carnet=" + carnet, encoding);
            
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
