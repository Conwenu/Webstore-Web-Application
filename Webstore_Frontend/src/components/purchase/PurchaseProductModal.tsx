import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PurchaseFromProduct from "./PurchaseFromProduct";
const PurchaseProductModal = ({
  productName,
  productPrice,
  productId,
  productImageUrl,
  totalStock,
}: any) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(quantity * productPrice);
  const checkQuantity = () => {
    if (quantity > totalStock) {
      setQuantity(totalStock);
    }
    if (quantity < 1) {
      setQuantity(1);
    }
  };
  useEffect(() => {
    setTotalPrice(quantity * productPrice);
  }, [quantity]);
  const handleChange = (event: any) => {
    setQuantity(parseInt(event.target.value));
    checkQuantity();
  };
  return (
    <>
      <Button variant="outline-success" onClick={handleShow}>
        Purchase!
      </Button>

      <Modal centered show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            Are you sure you would like to purchase "{productName}" x {quantity}
          </Modal.Title>
        </Modal.Header>
        <Modal.Header>
          <img src={productImageUrl} width="75%" height="75%" />
        </Modal.Header>
        <Modal.Header>
          <label>Quantity(Max:{totalStock}):</label>
          <input
            type="number"
            min="1"
            defaultValue={quantity}
            max={totalStock}
            onInput={(event) => handleChange(event)}
          ></input>
        </Modal.Header>

        <Modal.Header>
          <Modal.Title>
            <div> For ${totalPrice.toLocaleString()}</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <PurchaseFromProduct
            close={handleClose}
            productName={productName.toString()}
            productId={productId}
            quantity={quantity}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PurchaseProductModal;
