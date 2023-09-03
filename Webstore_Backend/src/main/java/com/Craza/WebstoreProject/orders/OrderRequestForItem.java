package com.Craza.WebstoreProject.orders;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class OrderRequestForItem {
//    @Id
//    @Transient
//    private UUID orderId = UUID.randomUUID();
    private Long productId;
    private int quantity;
    private Long creatorId;
//    private String productName;
//    private String productImage;
//    private Double productPrice;
//    private final LocalDate purchaseDate = LocalDate.now();
//    private final LocalDate arrivalDate = LocalDate.now().plusDays(new Random().nextInt((14 - 2) + 1) + 2);
//    private double totalPrice;

}
