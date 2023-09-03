package com.Craza.WebstoreProject.cart;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private Long productId;
    private String name;
    private String description;
    private double price;
    private int maxQuantityPerOrder;
    private int totalStock;
    private String imageUrl;
    private String imageName;
    private String imageId;
    private Long creatorId;
    private Integer quantity;
}
