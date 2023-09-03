package com.Craza.WebstoreProject.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EditUserRequest {
    private String email;
    private String firstName;
    private String lastName;
    private String password;
}
