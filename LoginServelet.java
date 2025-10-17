package com.example;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import org.mindrot.jbcrypt.BCrypt;

public class LoginServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        String email = request.getParameter("email");
        String password = request.getParameter("password");

        String jdbcUrl = "jdbc:mysql://localhost:3306/project?useSSL=false&serverTimezone=UTC";
        String dbUser = "root";
        String dbPass = "Soham@07";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(jdbcUrl, dbUser, dbPass);

            String sql = "SELECT password FROM users WHERE email = ?";
            PreparedStatement pst = con.prepareStatement(sql);
            pst.setString(1, email);

            ResultSet rs = pst.executeQuery();

            if (rs.next()) {
                String storedHash = rs.getString("password");

                if (BCrypt.checkpw(password, storedHash)) {
                    // Create session
                    HttpSession session = request.getSession();
                    session.setAttribute("email", email);
                    
                    out.print("{\"status\": \"success\", \"message\": \"Login successful\"}");
                } else {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    out.print("{\"status\": \"fail\", \"message\": \"Invalid password\"}");
                }
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                out.print("{\"status\": \"fail\", \"message\": \"User not found\"}");
            }

            rs.close();
            pst.close();
            con.close();
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"status\": \"fail\", \"message\": \"Server error: " + e.getMessage().replace("\"", "'") + "\"}");
        }

        out.flush();
    }
}
