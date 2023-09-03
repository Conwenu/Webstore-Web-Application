import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import UserService from "../../services/UserService";
import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "./OrderComponent.css";
const OrderComponent = () => {
  const [orders, setOrders] = useState<any>([]);
  const id = UserService.getCurrentUser("id");
  const getOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/getOrdersFromUser/${id}`
      );
      setOrders(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);
  return (
    <>
      <div key={uuidv4()} className="OrdersDisplay">
        <Button
          className="RefreshOrdersButton"
          variant="success"
          onClick={getOrders}
        >
          Refresh Orders
        </Button>
        <div className="OrdersContainer">
          {orders?.length === 0 ? (
            <div>This user hasn't ordered any products.</div>
          ) : (
            orders?.map((orders: any) => (
              <div className="OrderContainer" key={uuidv4()}>
                <Card className="OrderCard" style={{ width: "20rem" }}>
                  <Card.Img variant="top" src={orders.productImages} />
                  <Card.Body>
                    <Card.Header>Order id: {orders.orderId}</Card.Header>
                    <Card.Header>
                      You puchased the following item(s){" "}
                      {JSON.stringify(orders.productNames)}
                    </Card.Header>
                    <Card.Header>
                      You Purchased this order on {orders.purchaseDate}
                    </Card.Header>
                    <Card.Header>
                      Your Order has or will arrive by {orders.arrivalDate}
                    </Card.Header>
                    <Card.Header>
                      Number of Items Purchased :{" "}
                      {orders.quantity.reduce(function (a: any, b: any) {
                        return a + b;
                      })}
                    </Card.Header>
                    <Card.Header>
                      Total Price: ${orders.totalPrice.toLocaleString()}
                    </Card.Header>
                  </Card.Body>
                </Card>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default OrderComponent;
