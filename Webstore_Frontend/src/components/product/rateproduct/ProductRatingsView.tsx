import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Button from "react-bootstrap/Button";

const ProductsRatingView = ({ productId }: any) => {
  const [ratingDisplay, setRatingDisplay] = useState(0);
  const getRating = async () => {
    await axios
      .get(`http://localhost:8080/api/v1/getRating/${productId}`)
      .then((response) => {
        setRatingDisplay(response.data);
      })
      .catch((error) => {
        toast(error, { autoClose: 1000, type: "error" });
      });
  };

  useEffect(() => {
    getRating();
  }, [ratingDisplay]);

  const [rating, setRating] = useState(0);

  const checkRating = () => {
    if (rating > 100) {
      setRating(100);
    }
    if (rating < 0) {
      setRating(0);
    }
  };

  useEffect(() => {
    checkRating();
    getRating();
  }, [rating]);

  return (
    <>
      <Button
        variant="outline-dark"
        style={{ cursor: "default", margin: "1%", textAlign: "center" }}
      >
        {ratingDisplay}%
      </Button>
      <br></br>
    </>
  );
};

export default ProductsRatingView;
