import { useState } from "react";
import axios from "axios";
import UserService from "../../services/UserService";
import "../createreview/CreateReviews.css";
import { toast } from "react-toastify";

export const CreateReviews = () => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  async function handleSubmit(event: any) {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/createReview",
        {
          creatorId: UserService.getCurrentUser("id"),
          prodId: 1,
          reviewHead: formData.title,
          reviewBody: formData.body,
        }
      );
      if (response.status == 200) {
        toast("Successfully Created Review.", {
          autoClose: 1000,
          type: "success",
        });
      }
    } catch (error: any) {
      toast(error.message, { autoClose: 1000, type: "error" });
    }
  }
  return (
    <div className="FormHolder">
      <label>Write A Review For </label>
      <br />
      <br />
      <label>Review Title</label>
      <br />
      <input
        name="title"
        type="text"
        onChange={(event) => handleChange(event)}
      ></input>
      <br />
      <br />
      <label>Review Body</label>
      <br />
      <textarea
        name="body"
        onChange={(event) => handleChange(event)}
      ></textarea>
      <br />
      <br />
      <button onClick={handleSubmit} className="btn btn-dark">
        Create Review
      </button>
    </div>
  );
};
