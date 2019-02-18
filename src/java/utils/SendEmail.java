/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utils;

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

/*
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

            Transport.send(message);*/

            return true;
        } catch (Exception e) {
        }
        return false;

    }
    
}
