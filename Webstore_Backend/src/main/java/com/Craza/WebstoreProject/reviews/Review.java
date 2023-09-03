package com.Craza.WebstoreProject.reviews;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.HashSet;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "review")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long creatorId;
    private Long prodId;
    private String creatorFirstName;
    private String creatorLastName;
    private String reviewHead;
    private String reviewBody;
    private HashSet<Long> likedByUserId = new HashSet<>();
    private HashSet<Long> dislikedByUserId = new HashSet<>();
    private LocalDate reviewCreationDate = LocalDate.now();

    public void addToLikeList(Long userId)
    {
        likedByUserId.add(userId);
    }
    public void addToDislikeList(Long userId)
    {
        dislikedByUserId.add(userId);
    }
    public void removeFromLikeList(Long userId)
    {
        likedByUserId.remove(userId);
    }

    public void removeFromDislikeList(Long userId)
    {
        dislikedByUserId.remove(userId);
    }


}
