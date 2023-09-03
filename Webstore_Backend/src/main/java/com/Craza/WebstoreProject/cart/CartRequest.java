package com.Craza.WebstoreProject.cart;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class CartRequest {
    private Long creatorId;
    private Long productId;
    private int quantity;
}
