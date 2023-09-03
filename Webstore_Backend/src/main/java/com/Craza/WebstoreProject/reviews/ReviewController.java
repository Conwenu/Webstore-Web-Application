package com.Craza.WebstoreProject.reviews;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
@RestController
public class ReviewController {
    private final ReviewService reviewService;
    @PostMapping("/createReview")
    public String createReview(@RequestBody ReviewRequest reviewRequest)
    {
        return reviewService.saveReview(reviewRequest);
    }

    @GetMapping("/review/{id}")
    public Review getReview(@PathVariable Long id)
    {
        return reviewService.getReview(id);
    }

    @GetMapping("product/{id}/reviews")
    public ResponseEntity<List<Review>>getReviewByProdId(@PathVariable Long id)
    {
        return new ResponseEntity<List<Review>>((List<Review>) reviewService.getReviewByProductId(id), HttpStatus.OK);
    }

    @GetMapping("/user/{id}/reviews")
    public ResponseEntity<List<Review>> getReviewByCreatorId(@PathVariable Long id)
    {
        return new ResponseEntity<List<Review>>((List<Review>) reviewService.getReviewByCreatorId(id), HttpStatus.OK);
    }

    @DeleteMapping("/deleteReview/{id}")
    public String deleteReview (@PathVariable("id") Long id)
    {
        reviewService.deleteReview(id);
        return "Deleted";
    }

    @PutMapping("/editReview/{id}")
    public String editReview(@PathVariable("id") Long id,@RequestBody ReviewRequest reviewRequest)
    {
        return reviewService.editReview(id,reviewRequest);
    }

    @GetMapping("/review/{reviewId}/getLikes/{userId}")
    public boolean hasUserLiked(@PathVariable("reviewId") Long reviewId,  @PathVariable("userId") Long userId)
    {
        return reviewService.hasUserLiked(userId,reviewId);
    }

    @GetMapping("/review/{reviewId}/getDislikes/{userId}")
    public boolean hasUserDislikedLiked(@PathVariable("reviewId") Long reviewId,  @PathVariable("userId") Long userId)
    {
        return reviewService.hasUserDisliked(userId,reviewId);
    }

    @PostMapping("/review/{reviewId}/likeReview/{userId}")
    public String likeReview(@PathVariable("reviewId") Long reviewId,  @PathVariable("userId") Long userId)
    {
        return reviewService.likeReview(userId,reviewId);
    }
    @PostMapping("/review/{reviewId}/dislikeReview/{userId}")
    public String dislikeReview(@PathVariable("reviewId") Long reviewId,  @PathVariable("userId") Long userId)
    {
        return reviewService.dislikeReview(userId,reviewId);
    }
    @PostMapping("/review/{reviewId}/removeLike/{userId}")
    public String removeLike(@PathVariable("reviewId") Long reviewId,  @PathVariable("userId") Long userId)
    {
        return reviewService.removeLike(userId,reviewId);
    }
    @PostMapping("/review/{reviewId}/removeDislike/{userId}")
    public String removeDislike(@PathVariable("reviewId") Long reviewId,  @PathVariable("userId") Long userId)
    {
        return reviewService.removeDislike(userId,reviewId);
    }

    @GetMapping("/review/{reviewId}/getNumLikes/{userId}")
    public Long getNumOfLikes(@PathVariable("reviewId") Long reviewId,  @PathVariable("userId") Long userId)
    {
        return reviewService.getNumOfLikes(reviewId);
    }

    @GetMapping("/review/{reviewId}/getNumDislikes/{userId}")
    public Long getNumOfDislikes(@PathVariable("reviewId") Long reviewId,  @PathVariable("userId") Long userId)
    {
        return reviewService.getNumOfDislikes(reviewId);
    }

}
