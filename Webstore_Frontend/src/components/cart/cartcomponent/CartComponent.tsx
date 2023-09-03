import axios from "axios";
import { Button } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import "./CartComponent.css";
import { Card } from "react-bootstrap";
import UserService from "../../services/UserService";
import EmptyCart from "../emptycart/EmptyCart";
import RemoveFromCart from "../removefromcart/RemoveFromCart";
import UpdateCartModal from "../updatecartmodal/UpdateCartModal";
import PurchaseFromCartModal from "../../purchase/PurchaseFromCartModal";
import { useState, useEffect } from "react";
const CartComponent = () => {
  const [cart, setCart] = useState<any>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const id = UserService.getCurrentUser("id");
  const getCart = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/getCartFromUser/${id}`
      );
      setCart(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getCart();
  }, []);
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
  }, [cart]);
  return (
    <>
      <Button className="RefreshCartButton" variant="success" onClick={getCart}>
        Refresh Cart
      </Button>
      <div className="EmptyCart">
        {cart.length === 0 ? <div></div> : <EmptyCart />}
      </div>

      {cart.length === 0 ? (
        <div></div>
      ) : (
        <Button className="TotalPriceContainer" variant="dark">
          Total Price: ${totalPrice.toLocaleString()}
        </Button>
      )}

      <div key={uuidv4()} className="CartDisplay">
        {cart.length === 0 ? (
          <p>No Items In Cart</p>
        ) : (
          cart?.map((cart: any) => (
            <>
              <div className="CartItemContainer" key={uuidv4()}>
                <Card key={uuidv4()} border="secondary" className="CartCard">
                  {" "}
                  <Card.Header>"{cart.name}"</Card.Header>
                  <Card.Header>Price: ${cart.price}</Card.Header>
                  <Card.Header>
                    Total Price: ${cart.price * cart.quantity}
                  </Card.Header>
                  <Card.Header>Quantity: {cart.quantity}</Card.Header>
                  <Card.Img src={cart.imageUrl}></Card.Img>
                  <Card.Body>
                    <Card.Header>{cart.description}</Card.Header>
                  </Card.Body>
                  <br />
                  <>
                    <UpdateCartModal
                      refreshCart={getCart}
                      purchaseQuantity={cart.quantity}
                      totalStock={cart.totalStock}
                      prodId={cart.productId}
                      maxQuantityPerOrder={cart.maxQuantityPerOrder}
                    />
                    <RemoveFromCart
                      refreshCart={getCart}
                      prodId={cart.productId}
                    />
                  </>
                </Card>
              </div>
            </>
          ))
        )}
        <div className="PurchaseFromCart">
          {cart.length === 0 ? (
            <div></div>
          ) : (
            <PurchaseFromCartModal key={uuidv4()} refreshCart={getCart} />
          )}
        </div>
      </div>
    </>
  );
};

export default CartComponent;
