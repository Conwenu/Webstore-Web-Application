package com.Craza.WebstoreProject.reviews;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends CrudRepository<Review,Long> {
    Iterable<Review> findByProdId(Long prodId);

    Iterable<Review> findByCreatorId(Long creatorId);
}
