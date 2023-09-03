import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import UserService from "../../services/UserService";
import VoteReview from "../votereview/VoteReview";
import { Card } from "react-bootstrap";
import CreateReviewModal from "../../reviews/createreview/CreateReviewModal";
import "../reviewcomponent/ReviewComponent.css";
const ReviewComponent = ({ prodId, imageUrl, productName }: any) => {
  const [reviews, setReviews] = useState<any>([]);
  useEffect(() => {
    getReviews();
  }, []);
  const getReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/product/${prodId}/reviews`
      );

      setReviews(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="ProductDisplay">
        <div className="CreateReviewModal">
          <CreateReviewModal
            className="CreateReviewModal"
            productName={productName}
            prodId={prodId}
            imageUrl={imageUrl}
            refreshReviews={getReviews}
          />
        </div>
        {reviews.length === 0 ? (
          <p>No Reviews Found</p>
        ) : (
          <>
            {reviews?.map((reviews: any) => (
              <div key={uuidv4()} className="ReviewSpecific">
                <Card>
                  <Card.Header className="ReviewSpecificHead">
                    {reviews.reviewHead}
                  </Card.Header>
                  <Card.Body className="ReviewSpecificBody">
                    <blockquote className="blockquote mb-0">
                      <p>{reviews.reviewBody}</p>
                      <footer className="blockquote-footer">
                        {"Created by: "}
                        <span style={{ textDecoration: "underline" }}>
                          {reviews.creatorFirstName +
                            " " +
                            reviews.creatorLastName}
                        </span>
                        <cite title="Source Title">
                          {" "}
                          at {reviews.reviewCreationDate}
                        </cite>
                      </footer>
                    </blockquote>
                    <hr />
                    <VoteReview
                      className="VoteReview"
                      reviewId={reviews.id}
                      userId={UserService.getCurrentUser("id")}
                    />
                  </Card.Body>
                </Card>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default ReviewComponent;
