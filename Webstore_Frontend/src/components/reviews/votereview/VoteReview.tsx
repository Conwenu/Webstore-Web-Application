import { useState, useEffect } from "react";
import "../votereview/VoteReview.css";
import axios from "axios";

const VoteReview = ({ reviewId, userId }: any) => {
  const [numLikes, setNumLikes] = useState(0);
  const [numDislikes, setNumDislikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);

  const checkLiked = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/review/${reviewId}/getLikes/${userId}`
      );
      if (response.status === 200) {
        setHasLiked(response.data);
      }
      getNumLikes();
    } catch (err) {
      console.log(err);
    }
  };

  const checkDisliked = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/review/${reviewId}/getDislikes/${userId}`
      );
      if (response.status === 200) {
        setHasDisliked(response.data);
      }
      getNumDislikes();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async () => {
    try {
      if (hasLiked === false) {
        const response = await axios.post(
          `http://localhost:8080/api/v1/review/${reviewId}/likeReview/${userId}`
        );
        setHasDisliked(false);
        getNumDislikes();
        checkLiked();
        console.log(response.data);
      } else {
        const response = await axios.post(
          `http://localhost:8080/api/v1/review/${reviewId}/removeLike/${userId}`
        );
        console.log(response.data);
      }

      checkLiked();
      getNumLikes();
      getNumDislikes();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDislike = async () => {
    try {
      if (hasDisliked === false) {
        const response = await axios.post(
          `http://localhost:8080/api/v1/review/${reviewId}/dislikeReview/${userId}`
        );
        setHasLiked(false);
        getNumLikes();
        console.log(response.data);
      } else {
        const response = await axios.post(
          `http://localhost:8080/api/v1/review/${reviewId}/removeDislike/${userId}`
        );
        checkDisliked();
        console.log(response.data);
      }

      checkDisliked();
      getNumDislikes();
      getNumLikes;
    } catch (err) {
      console.log(err);
    }
  };

  const getNumLikes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/review/${reviewId}/getNumLikes/${userId}`
      );

      setNumLikes(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkLiked();
    getNumLikes();
  }, []);

  const getNumDislikes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/review/${reviewId}/getNumDislikes/${userId}`
      );

      setNumDislikes(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkDisliked();
    getNumDislikes();
  }, [numDislikes]);
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        fill="currentColor"
        className="Like bi bi-chevron-up"
        viewBox="0 0 16 16"
        onClick={handleLike}
        style={{ color: hasLiked ? "green" : "black" }}
      >
        <path
          fillRule="evenodd"
          d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
        />
      </svg>
      <br />
      {numLikes == 1 ? `${numLikes} Like` : `${numLikes} Likes`} vs
      {numDislikes == 1
        ? ` ${numDislikes} Dislike`
        : ` ${numDislikes} Dislikes`}
      <br />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        fill="currentColor"
        className="Dislike bi bi-chevron-down"
        viewBox="0 0 16 16"
        onClick={handleDislike}
        style={{ color: hasDisliked ? "red" : "black" }}
      >
        <button
          type="button"
          className="btn btn-secondary"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          title="Tooltip on right"
        >
          Tooltip on right
        </button>
        <path
          fillRule="evenodd"
          d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
        />
      </svg>
    </div>
  );
};

export default VoteReview;
