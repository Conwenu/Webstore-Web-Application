package com.Craza.WebstoreProject.orders;

import org.springframework.data.repository.CrudRepository;

import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends CrudRepository<Order, UUID> {
    Optional<Order> findByOrderId(UUID orderId);

    Iterable<Order> findByCreatorId(Long creatorId);
}
