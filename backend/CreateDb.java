import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class CreateDb {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/postgres";
        String user = "postgres";
        String password = "postgres";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {
            
            // Checking if db exists
            String createDbSql = "CREATE DATABASE bus_booking";
            stmt.executeUpdate(createDbSql);
            System.out.println("Database created successfully.");

        } catch (Exception e) {
            System.out.println("Error or Database already exists: " + e.getMessage());
        }
    }
}
