import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import UserService from "../../services/UserService";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import DeleteReveiw from "../deletereviews/DeleteReveiw";
import EditReviewModal from "../editreviews/EditReviewModal";
import "./UserReviews.css";
const UserReviews = () => {
  const [userReviews, setUserReviews] = useState<any>([]);

  const id = UserService.getCurrentUser("id");

  const getUserReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/user/${id}/reviews`
      );
      setUserReviews(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getUserReviews();
  }, []);
  return (
    <>
      <Button
        className="reviewRefreshButton"
        variant="success"
        onClick={getUserReviews}
      >
        Refresh Reviews
      </Button>
      <br />
      <div className="ReviewsContainer">
        {userReviews.length === 0 ? (
          <div>This user hasn't reviewd any products.</div>
        ) : (
          userReviews.map((userReviews: any) => (
            <div key={uuidv4()} className="ReviewContainer">
              <Card className="ReviewCard" style={{ width: "18rem" }}>
                <Card.Body>
                  <Link to={`/product/${userReviews.prodId}`}>
                    <Card.Title>{userReviews.reviewHead}</Card.Title>
                    <Card.Text>{userReviews.reviewBody}</Card.Text>
                  </Link>
                  <DeleteReveiw
                    refreshReviews={getUserReviews}
                    reviewId={userReviews.id}
                  />
                  <EditReviewModal
                    refreshReviews={getUserReviews}
                    prodId={userReviews.prodId}
                    reviewId={userReviews.id}
                  />
                </Card.Body>
              </Card>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default UserReviews;
