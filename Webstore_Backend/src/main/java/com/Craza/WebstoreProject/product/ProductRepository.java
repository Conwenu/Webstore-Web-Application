package com.Craza.WebstoreProject.product;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends CrudRepository<Product,Long> {
    Iterable<Product> findAllByCreatorId(Long creatorId);
}
