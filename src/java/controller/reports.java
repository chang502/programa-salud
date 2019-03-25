/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Types;
import javax.servlet.ServletException;
import javax.servlet.http.*;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.*;
import org.apache.poi.ss.util.WorkbookUtil;

/**
 *
 * @author Andres
 */
public class reports extends HttpServlet {

    private String rname = null;
    private int paramcount;

    private ResultSet getReportResultSet(HttpSession ses, HttpServletRequest request) {
        String id_usuario = ses.getAttribute("id_usuario").toString();
        String id_reporte = request.getParameter("id_reporte");

        java.util.Map<String, String> paramap = new java.util.HashMap();
        paramap.put("id_reporte", id_reporte);
        paramap.put("id_usuario", id_usuario);
        String parafields[] = {"id_reporte", "id_usuario"};

        DBManager dm = new DBManager();

        java.util.Map<String, String> params = new java.util.HashMap();
        java.util.ArrayList<String> al = new java.util.ArrayList();
        String sp_name = null;
        try {
            ResultSet rsparam = dm.callGetProcedure("get_report_data_and_params", paramap, parafields);
            this.paramcount = 0;
            while (rsparam.next()) {
                this.rname = rsparam.getString("nombre");
                sp_name = rsparam.getString("sp_name");

                String varname = rsparam.getString("var_name");
                if (varname != null && !varname.equals("")) {
                    this.paramcount++;
                    params.put(varname, request.getParameter(varname));
                    al.add(varname);
                }
            }
        } catch (Exception e) {
            e.printStackTrace(System.err);
            return null;
        }

        if (sp_name == null) {
            return null;
        }

        params.put("id_usuario", id_usuario);
        al.add("id_usuario");

        try {
            String[] tmp = new String[this.paramcount];
            ResultSet resp = dm.callGetProcedure(sp_name, params, al.toArray(tmp));
            return resp;
        } catch (Exception e) {
            e.printStackTrace(System.err);
        }

        return null;
    }

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession ses = request.getSession();
        if (ses == null || ses.isNew()) {
            response.sendRedirect("login.jsp");
            return;
        }

        try {
            ResultSet rs = getReportResultSet(ses, request);
            if (rs == null) {
                response.sendRedirect("error.jsp");
                return;
            }

            ResultSetMetaData md = rs.getMetaData();

            int columncount = md.getColumnCount();
            int rowcount = 1;//starting on 1 because of the headers

            int[] dtypes = new int[columncount];

            for (int i = 0; i < columncount; i++) {
                dtypes[i] = md.getColumnType(i + 1);
                //System.out.println(md.getColumnTypeName(i + 1));
            }

            Workbook wb = new XSSFWorkbook();
            Sheet sh = wb.createSheet(WorkbookUtil.createSafeSheetName(this.rname != null ? this.rname != null : "Reporte"));

            CreationHelper createHelper = wb.getCreationHelper();

            //headers
            CellStyle style = wb.createCellStyle();
            Font font = wb.createFont();
            font.setBold(true);
            style.setFont(font);
            Row header = sh.createRow(0);
            for (int i = 0; i < columncount; i++) {
                Cell c = header.createCell(i);
                c.setCellValue(
                        createHelper.createRichTextString(md.getColumnLabel(i + 1)));
                c.setCellStyle(style);
            }

            CellStyle dateStyle = wb.createCellStyle();
            dateStyle.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));

            /*CellStyle timeStyle = wb.createCellStyle();
            timeStyle.setDataFormat(createHelper.createDataFormat().getFormat("hh:mm"));*/
            CellStyle dateTimeStyle = wb.createCellStyle();
            dateTimeStyle.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy hh:mm"));

            /*for (int i = 0; i < dtypes.length; i++) {
                int dtype = dtypes[i];
                //System.out.println("dtype: "+dtype+", "+String.valueOf(Types.));
            }*/
            while (rs.next()) {
                Row row = sh.createRow(rowcount);
                for (int i = 0; i < columncount; i++) {

                    //Object val=dtypes[i] == Types.BIT ? rs.getBoolean(i + 1) : dtypes[i] == Types.DECIMAL ? ((rs.getLong(i + 1)*0l==0l && rs.wasNull())?"null":rs.getLong(i + 1)): rs.getString(i + 1) != null ? rs.getString(i + 1).replaceAll("\"", "\'").replaceAll("\n", "\\\\n") : dtypes[i] == Types.INTEGER?((rs.getInt(i + 1)*0l==0l && rs.wasNull())?"null":rs.getInt(i + 1)): ""
                    switch (dtypes[i]) {
                        case Types.BIT:
                            row.createCell(i).setCellValue(rs.getBoolean(i + 1));
                            break;
                        case Types.DECIMAL:
                            row.createCell(i).setCellValue(rs.getLong(i + 1));
                            break;
                        case Types.INTEGER:
                            row.createCell(i).setCellValue(rs.getInt(i + 1));
                            break;
                        case Types.TIMESTAMP:
                            Cell c = row.createCell(i);
                            c.setCellValue(rs.getDate(i + 1));
                            c.setCellStyle(dateTimeStyle);
                            break;
                        case Types.DATE:
                            Cell cd = row.createCell(i);
                            cd.setCellValue(rs.getDate(i + 1));
                            cd.setCellStyle(dateStyle);
                            break;
                        default:
                            row.createCell(i).setCellValue(createHelper.createRichTextString(rs.getString(i + 1)));
                            break;
                    }
                }
                rowcount++;
            }

            for (int i = 0; i < columncount; i++) {
                sh.autoSizeColumn(i);
            }

            if (sh.getPhysicalNumberOfRows() > 1) {
                response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                if (this.rname != null) {
                    response.setHeader("Content-disposition", "attachment; filename=\"" + this.rname + "\"");
                }

                OutputStream fileOut = response.getOutputStream();
                wb.write(fileOut);
            } else {
                response.setContentType("text/html;charset=UTF-8");
                request.setAttribute("titulo", "Generar Reporte");
                request.setAttribute("mensaje", "El reporte no contiene información");
                request.getRequestDispatcher("reportresult.jsp").include(request, response);

            }

            //Runtime.getRuntime().exec("excel "+f.toString());
        } catch (Exception e) {
            e.printStackTrace(System.err);
        }

    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //response.sendRedirect("index.jsp");
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "reportes";
    }// </editor-fold>

}
