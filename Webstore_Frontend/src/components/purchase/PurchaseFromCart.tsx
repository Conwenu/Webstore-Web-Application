import { Button } from "react-bootstrap";
import axios from "axios";
import UserService from "../services/UserService";
import { toast } from "react-toastify";

const PurchaseFromCart = ({ close, refreshCart }: any) => {
  const id = UserService.getCurrentUser("id");
  const handlePurchaseFromCart = async () => {
    await axios
      .post(`http://localhost:8080/api/v1/handleOrderFromCart/${id}`)
      .then((response) => {
        if (response.status === 200) {
          toast("You have successfully purchased your cart.", {
            autoClose: 1000,
            type: "success",
          });
          close();
          refreshCart();
          //update cart.
        }
      })
      .catch((error) => {
        toast(error.message, { autoClose: 1000, type: "error" });
      });
  };
  return (
    <Button variant="success" onClick={handlePurchaseFromCart}>
      Purchase!
    </Button>
  );
};

export default PurchaseFromCart;
