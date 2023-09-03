import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import UpdateCart from "../updatecart/UpdateCart";
import "./UpdateCartModal.css";
import { useState, useEffect } from "react";
const UpdateCartModal = ({
  prodId,
  totalStock,
  refreshCart,
  purchaseQuantity,
}: any) => {
  const [quantity, setQuantity] = useState(1);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleChange = (event: any) => {
    setQuantity(parseInt(event.target.value));
  };

  useEffect(() => {
    if (quantity > totalStock) {
      setQuantity(totalStock);
    }
    if (quantity < 1) {
      setQuantity(1);
    }
  }, [quantity]);

  return (
    <>
      <Button className="UpdateCartButton" variant="dark" onClick={handleShow}>
        Update Cart
      </Button>

      <Modal
        className="ModalTest"
        show={show}
        onHide={handleClose}
        animation={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Quantity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Total Stock: {totalStock}</label>
          <br />
          <label>Update Quantity:</label>
          <input
            type="number"
            min="1"
            defaultValue={purchaseQuantity}
            max={totalStock}
            onInput={(event) => handleChange(event)}
          ></input>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleClose}>
            Close
          </Button>
          <UpdateCart
            prodId={prodId}
            newQuantity={quantity}
            refreshCart={refreshCart}
            closeModal={handleClose}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateCartModal;
