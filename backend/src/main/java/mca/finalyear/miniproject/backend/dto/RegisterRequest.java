package mca.finalyear.miniproject.backend.dto;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String age;
    private String contact;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getAge() { return age; }
    public void setAge(String age) { this.age = age; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
}
