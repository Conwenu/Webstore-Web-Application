import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PurchaseFromCart from "./PurchaseFromCart";
import UserService from "../services/UserService";
import axios from "axios";
const PurchaseFromCartModal = ({ refreshCart }: any) => {
  const [show, setShow] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const id = UserService.getCurrentUser("id");
  const getTotalPrice = () => {
    axios
      .get(`http://localhost:8080/api/v1/getTotalPriceFromCart/${id}`)
      .then((response) => {
        setTotalPrice(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getTotalPrice();
  }, [show]);
  return (
    <>
      <Button variant="success" onClick={handleShow}>
        Purchase Cart
      </Button>

      <Modal centered show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            Are you sure you would like to purchase all the items in the cart
            for ${totalPrice.toLocaleString()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <PurchaseFromCart close={handleClose} refreshCart={refreshCart} />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PurchaseFromCartModal;
