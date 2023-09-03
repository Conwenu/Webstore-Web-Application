package com.Craza.WebstoreProject.product;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class ProductRatingResponse {
    private int rating;
    private Long productId;
    private String productName;
    private String productImage;
}
