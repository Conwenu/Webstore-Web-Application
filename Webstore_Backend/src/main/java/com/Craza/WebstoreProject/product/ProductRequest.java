package com.Craza.WebstoreProject.product;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class ProductRequest {
    private String name;
    private String description;
    private String imageUrl;
    private double price;
    private int totalStock;
    private String imageName;
    private String imageId;
    private Long creatorId;

}
