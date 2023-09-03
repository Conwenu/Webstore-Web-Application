import { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import UserService from "../../services/UserService";
import { toast } from "react-toastify";
import "./CreateReviewModal.css";
function CreateReviewModal({
  productName,
  prodId,
  imageUrl,
  refreshReviews,
}: any) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
          prodId: prodId,
          reviewHead: formData.title,
          reviewBody: formData.body,
        }
      );
      if (response.status == 200) {
        toast("Success!", { autoClose: 1000, type: "success" });
        refreshReviews();
        handleClose();
      }
    } catch (error: any) {
      toast(error.message, { autoClose: 1000, type: "error" });
    }
  }

  return (
    <>
      <Button
        className="reviewButton"
        variant="outline-dark"
        onClick={handleShow}
      >
        Write A Review
      </Button>

      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Write a Review For "{productName}"
            {<img src={imageUrl} width="17.5%" height="17.5%"></img>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mt-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="SAVED MY LIFE!"
                autoFocus
                onChange={(event) => handleChange(event)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="body"
                placeholder="Once In A Lifetime Offer!"
                rows={3}
                onChange={(event) => handleChange(event)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Review!
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateReviewModal;
