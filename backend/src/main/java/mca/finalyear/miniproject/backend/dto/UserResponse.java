package mca.finalyear.miniproject.backend.dto;

import mca.finalyear.miniproject.backend.entity.User;

public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String age;
    private String contact;
    private String role;

    public UserResponse(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.age = user.getAge();
        this.contact = user.getContact();
        this.role = user.getRole();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAge() { return age; }
    public void setAge(String age) { this.age = age; }
    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
