package com.Craza.WebstoreProject.product;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private double price;
    private int totalStock;
    private String imageUrl;
    private String imageName;
    private String imageId;
    private Long creatorId;
    private String creatorFirstName;
    private String creatorLastName;
    @ElementCollection()
    @MapKeyColumn(name = "userId")
    private Map<Long, Integer> ratings;

    // Key -> User Value -> Ratings
    // Rating value 1-100
    // Get sum of Values and divide by length


}
