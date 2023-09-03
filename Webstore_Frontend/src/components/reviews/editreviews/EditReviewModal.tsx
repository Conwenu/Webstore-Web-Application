import { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import UserService from "../../services/UserService";
import "./EditReviewModal.css";
function EditReviewModal({ prodId, refreshReviews, reviewId }: any) {
  const [show, setShow] = useState(false);
  const [tempProduct, setTempProduct] = useState<any>([]);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    getProduct();
  };
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  const getProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/product/${prodId}`
      );
      setTempProduct(response.data);
    } catch (error: any) {
      toast(error.message, { autoClose: 1000, type: "error" });
    }
  };

  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  async function handleSubmit(event: any) {
    event.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/editReview/${reviewId}`,
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
        className="EditReviewButton"
        variant="outline-dark"
        onClick={handleShow}
      >
        Edit Review
      </Button>

      <div className="ModalContainer">
        <Modal centered show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              Edit Review For "{tempProduct.name}"
              {<img src={tempProduct.imageUrl} width="50%" height="50%"></img>}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mt-3"
                controlId="exampleForm.ControlInput1"
              >
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
              Edit Review!
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default EditReviewModal;
