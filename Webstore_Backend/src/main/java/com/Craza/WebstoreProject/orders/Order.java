package com.Craza.WebstoreProject.orders;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Entity
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID orderId;
    private Long creatorId;
    private List<String> productNames = new ArrayList<>();
    private List<String> productImages = new ArrayList<>();
    private List<Double> productPrices = new ArrayList<>();
    private List<Integer> quantity = new ArrayList<>();
    private final LocalDate purchaseDate = LocalDate.now();
    private final LocalDate arrivalDate = LocalDate.now().plusDays(new Random().nextInt((14 - 2) + 1) + 2);
    private double totalPrice;


}
