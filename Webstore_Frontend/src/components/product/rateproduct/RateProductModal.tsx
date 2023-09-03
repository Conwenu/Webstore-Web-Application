import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import axios from "axios";
import UserService from "../../services/UserService";
import { toast } from "react-toastify";

const RateProductModal = ({ productId, productName, refreshProduct }: any) => {
  const [show, setShow] = useState(false);
  let id = UserService.getCurrentUser("id");
  const handleClose = () => {
    setShow(false);
    setRating(100);
  };
  const handleShow = () => {
    setRating(100);
    setShow(true);
  };
  const [rating, setRating] = useState(0);

  const handleRating = async () => {
    axios
      .post(`http://localhost:8080/api/v1/rateProduct/${id}`, {
        rating: rating,
        productId: productId,
      })
      .then((response) => {
        toast(response.data, { autoClose: 1000, type: "success" });
        refreshProduct(productId);
        handleClose();
      })
      .catch((error) => {
        toast(error.message, { autoClose: 1000, type: "error" });
      });
  };

  const checkRating = () => {
    if (rating > 100) {
      setRating(100);
    }
    if (rating < 0) {
      setRating(0);
    }
  };
  const handleChange = (event: any) => {
    setRating(event.target.value);
  };

  useEffect(() => {
    checkRating();
  }, [rating]);
  return (
    <>
      <Button variant="outline-dark" onClick={handleShow}>
        Rate This Product
      </Button>

      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Rate "{productName}"</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Rating</label>
          <input
            onChange={handleChange}
            min={0}
            max={100}
            defaultValue={100}
            step={5}
            type="number"
          ></input>
          <label>%</label>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="outline-primary" onClick={handleRating}>
            Rate Product
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RateProductModal;
