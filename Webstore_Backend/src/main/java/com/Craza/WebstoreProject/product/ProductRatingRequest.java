package com.Craza.WebstoreProject.product;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProductRatingRequest {
    private int rating;
    private Long productId;
}
