/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utils;

import controller.DBManager;
import java.sql.ResultSet;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;
/**
 *
 * @author Andres
 */
public class SendEmail {
    
    private final String USERNAME="saludfiusac";
    private final String PASSWORD="programasalud2018";
    
    public void sendRecoverMyPasswordEmail(String email, String nombre,String tempPassword)throws Exception{
                Properties props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", "587");

		Session session = Session.getInstance(props,
		  new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(USERNAME, PASSWORD);
			}
		  });


			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress("saludfiusac@gmail.com"));
			message.setRecipients(Message.RecipientType.TO,
				InternetAddress.parse(email));
			message.setSubject("Programa Salud: Recuperar contraseña");
			message.setText("Hola, "+nombre
				+ "\n\nHas recibido este correo porque solicitó un reinicio de contraseña."
                                        + "\n\nTu nueva contraseña es:"
                                        + "\n\n\n"+tempPassword+""
                                                + "\n\n\nRecurda cambiar la contraseña al ingresar al sistema."
                                                + "\n\nNo respondas a este email.");

			Transport.send(message);

			System.out.println("Done");
    }
    
    public boolean sendAppointmentConfirmationEmail(String id_cita){
        try {
            Properties props = new Properties();
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.host", "smtp.gmail.com");
            props.put("mail.smtp.port", "587");

            Session session = Session.getInstance(props,
              new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                            return new PasswordAuthentication(USERNAME, PASSWORD);
                    }
              });
            
            java.util.Map<String, String> params= new java.util.HashMap<>();
            String fields[] = {"id_cita"};
            params.put("id_cita", id_cita);
            
            DBManager dm = new DBManager();
            ResultSet rs = dm.callGetProcedure("get_appointment_info_for_email", params, fields);
            
            
            String paciente="", email="", fecha="", hora="", atiende="", clinica="", ubicacion="";
            
            while(rs.next()){
                paciente = rs.getString("paciente");
                email = rs.getString("email");
                fecha = rs.getString("fecha");
                hora = rs.getString("hora");
                atiende = rs.getString("atiende");
                clinica = rs.getString("clinica");
                ubicacion = rs.getString("ubicacion");
            }

            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("saludfiusac@gmail.com"));
            message.setRecipients(Message.RecipientType.TO,
                    InternetAddress.parse(email));
            message.setSubject("Programa Salud: Confirmación de cita");
            message.setText("Hola, "+paciente
                    + "\n\nTienes una cita en la clínica "+clinica+", ubicada en "+ubicacion+", el "+fecha+" a las "+hora+" horas. Te atenderá "+atiende+".\n"
                                    + "\n\nNo respondas a este email.");

            Transport.send(message);

            return true;
        } catch (Exception e) {
            e.printStackTrace(System.err);
        }
        return false;

    }
    
}
