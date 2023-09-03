package com.Craza.WebstoreProject.reviews;

import com.Craza.WebstoreProject.user.User;
import com.Craza.WebstoreProject.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    // Get Reviews by CreatorId
    public Iterable<Review> getReviewByCreatorId(Long id)
    {
       return reviewRepository.findByCreatorId(id);
    }

    // Get Reviews by ProductId
    public Iterable<Review> getReviewByProductId(Long id)
    {
        return reviewRepository.findByProdId(id);
    }

    // Get SpecificReview // by ReviewID
    public Review getReview(Long id) {
        return reviewRepository.findById(id).orElse(null);
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
    public String saveReview(ReviewRequest reviewRequest)
    {
        Review reviewToSave = new Review();
        Optional<User> reviewCreator = userRepository.findById(reviewRequest.getCreatorId());
        if(reviewCreator.isPresent())
        {
            reviewToSave.setCreatorFirstName(reviewCreator.get().getFirstName());
            reviewToSave.setCreatorLastName(reviewCreator.get().getLastName());
            reviewToSave.setCreatorId(reviewRequest.getCreatorId());
            reviewToSave.setProdId(reviewRequest.getProdId());
            reviewToSave.setReviewHead(reviewRequest.getReviewHead());
            reviewToSave.setReviewBody(reviewRequest.getReviewBody());
            reviewToSave.setLikedByUserId(new HashSet<>());
            reviewToSave.setDislikedByUserId(new HashSet<>());
            reviewRepository.save(reviewToSave);
            return "Saved Review";
        }
        return "Creator Does Not Exist?? Review Cannot be made.";
    }

    public String editReview(Long id, ReviewRequest reviewRequest)
    {
        Review reviewToEdit = getReview(id);
        Optional<User> reviewCreator = userRepository.findById(reviewRequest.getCreatorId());
        if(reviewToEdit == null)
        {
            this.deleteReview(id);
            return "This Review Does Not Exist";
        }
        if(reviewCreator.isPresent())
        {
            reviewToEdit.setCreatorFirstName(reviewCreator.get().getFirstName());
            reviewToEdit.setCreatorLastName(reviewCreator.get().getLastName());
            reviewToEdit.setCreatorId(reviewRequest.getCreatorId());
            reviewToEdit.setProdId(reviewRequest.getProdId());
            reviewToEdit.setReviewHead(reviewRequest.getReviewHead());
            reviewToEdit.setReviewBody(reviewRequest.getReviewBody());
            reviewRepository.save(reviewToEdit);
            return "Edited Review";
        }
        return "Creator Does Not Exist?? Review cannot be edited.";

    }

    public String likeReview(Long userId, Long reviewId)
    {
        Review review = getReview(reviewId);
        review.addToLikeList(userId);
        review.removeFromDislikeList(userId);
        reviewRepository.save(review);
        return "Liked";
    }

    public String dislikeReview(Long userId, Long reviewId)
    {
        Review review = getReview(reviewId);
        review.addToDislikeList(userId);
        review.removeFromLikeList(userId);
        reviewRepository.save(review);
        return "Disliked";
    }
    public String removeLike(Long userId, Long reviewId)
    {
        Review review = getReview(reviewId);
        review.removeFromLikeList(userId);
        reviewRepository.save(review);
        return "Removed Like";
    }
    public String removeDislike(Long userId, Long reviewId)
    {
        Review review = getReview(reviewId);
        review.removeFromDislikeList(userId);
        reviewRepository.save(review);
        return "Removed Dislike";
    }

    public Boolean hasUserLiked(Long userId, Long reviewId)
    {
        Review review = getReview(reviewId);
        return review.getLikedByUserId().contains(userId);
    }

    public Boolean hasUserDisliked(Long userId, Long reviewId)
    {
        Review review = getReview(reviewId);
        return review.getDislikedByUserId().contains(userId);
    }

    public Long getNumOfLikes(Long reviewId)
    {
        Review review = getReview(reviewId);
        return (long) review.getLikedByUserId().size();
    }

    public Long getNumOfDislikes(Long reviewId)
    {
        Review review = getReview(reviewId);
        return (long) review.getDislikedByUserId().size();
    }

    public void deleteAllReviewsFromUser(Long userId)
    {
        Iterable<Review> reviews = getReviewByCreatorId(userId);
        for(Review review : reviews)
        {
            this.deleteReview(review.getId());
        }
    }

    public void deleteAllReviewsFromProduct(Long productId)
    {
        Iterable<Review> reviews = getReviewByProductId(productId);
        for(Review review : reviews)
        {
            this.deleteReview(review.getId());
        }
    }

    public void deleteAllReviewVotesFromUser(Long userId)
    {
        Iterable<Review> reviews = getReviewByCreatorId(userId);
        for(Review review : reviews)
        {
            if(review.getLikedByUserId().contains(userId))
            {
                review.removeFromLikeList(userId);
            }
            if(review.getDislikedByUserId().contains(userId))
            {
                review.removeFromDislikeList(userId);
            }
        }
    }
}
