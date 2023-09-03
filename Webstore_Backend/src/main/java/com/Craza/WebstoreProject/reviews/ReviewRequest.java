package com.Craza.WebstoreProject.reviews;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class ReviewRequest {
    private Long creatorId;
    private Long prodId;
    private String reviewHead;
    private String reviewBody;
}
