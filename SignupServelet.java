package com.example;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import org.mindrot.jbcrypt.BCrypt;

public class SignupServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String name = email.split("@")[0];
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());

        String jdbcUrl = "jdbc:mysql://localhost:3306/project?useSSL=false&serverTimezone=UTC";
        String dbUser = "root";
        String dbPass = "Soham@07";

        Connection con = null;
        PreparedStatement pst = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            con = DriverManager.getConnection(jdbcUrl, dbUser, dbPass);

            String sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
            pst = con.prepareStatement(sql);
            pst.setString(1, name);
            pst.setString(2, email);
            pst.setString(3, hashedPassword);

            int rows = pst.executeUpdate();

            if (rows > 0) {
                out.print("{\"success\": true, \"message\": \"Signup successful! Please sign in.\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"success\": false, \"message\": \"Failed to create account\"}");
            }

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_CONFLICT);
            
            if (e.getMessage().contains("Duplicate entry")) {
                out.print("{\"success\": false, \"message\": \"Email already exists\"}");
            } else {
                out.print("{\"success\": false, \"message\": \"Database error: " + e.getMessage().replace("\"", "'") + "\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\": false, \"message\": \"Server error: " + e.getMessage().replace("\"", "'") + "\"}");
        } finally {
            try {
                if (pst != null) pst.close();
                if (con != null) con.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
            out.close();
        }
    }
}
