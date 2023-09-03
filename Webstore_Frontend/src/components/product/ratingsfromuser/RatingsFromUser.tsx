import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import UserService from "../../services/UserService";
import "./RatingsFromUser.css";
const RatingsFromUser = () => {
  const [ratings, setRatings] = useState<any>([]);
  let id = UserService.getCurrentUser("id");
  const getRatingsFromUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/getRatingsFromUser/${id}`
      );
      setRatings(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteRating = async (rating: any, productId: any) => {
    try {
      await axios.post(`http://localhost:8080/api/v1/unrateProduct/${id}`, {
        rating: rating,
        productId: productId,
      });
      getRatingsFromUser();
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getRatingsFromUser();
  }, []);
  return (
    <>
      <div className="RatingsDisplay">
        <Button
          className="RefreshRatingsButton"
          variant="success"
          onClick={getRatingsFromUser}
        >
          Refresh Ratings
        </Button>
        <div className="RatingsContainer">
          {ratings?.length === 0 ? (
            <p>This user hasn't rated any products.</p>
          ) : (
            ratings?.map((ratings: any) => (
              <div className="RatingContainer" key={uuidv4()}>
                <Card className="RatingCard" style={{ width: "18rem" }}>
                  <Card.Img variant="top" src={ratings.productImage} />
                  <Card.Body>
                    <Card.Title>{ratings.productName}</Card.Title>
                    <Card.Title>Rated at: {ratings.rating}%</Card.Title>
                    <Button
                      onClick={() =>
                        deleteRating(ratings.rating, ratings.productId)
                      }
                      variant="danger"
                    >
                      Delete Rating
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default RatingsFromUser;
