import axios from "axios";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

const DeleteReveiw = ({ reviewId, refreshReviews }: any) => {
  const handleReviewDeletion = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/deleteReview/${reviewId}`
      );
      toast(response.data, { autoClose: 1000, type: "success" });
      refreshReviews();
    } catch (error: any) {
      toast(error.message, { autoClose: 1000, type: "error" });
    }
  };
  return (
    <Button variant="outline-dark" onClick={handleReviewDeletion}>
      DeleteReveiw
    </Button>
  );
};

export default DeleteReveiw;
