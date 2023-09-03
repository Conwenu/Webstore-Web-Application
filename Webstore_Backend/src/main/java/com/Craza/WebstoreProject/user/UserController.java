package com.Craza.WebstoreProject.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    @GetMapping
    public List<User> getUsers()
    {
        return userService.getUsers();
    }

    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id)
    {
        return new ResponseEntity<>(userService.deleteUser(id), HttpStatus.OK);
    }


    @PutMapping("/editFirstName/{id}")
    public ResponseEntity<?> editFirstName(@PathVariable Long id, @RequestBody EditUserRequest editUserRequest)
    {
        return new ResponseEntity<>(userService.editFirstName(id,editUserRequest),HttpStatus.OK);
    }

    @PutMapping("/editLastName/{id}")
    public ResponseEntity<?> editLastName(@PathVariable Long id, @RequestBody EditUserRequest editUserRequest)
    {
        return new ResponseEntity<>(userService.editLastName(id,editUserRequest),HttpStatus.OK);
    }

    @PutMapping("/editEmail/{id}")
    public ResponseEntity<?> editEmail(@PathVariable Long id, @RequestBody EditUserRequest editUserRequest)
    {
        return new ResponseEntity<>(userService.editEmail(id,editUserRequest),HttpStatus.OK);
    }
}
