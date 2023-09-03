import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import { toast } from "react-toastify";
import "./RemoveFromCart.css";
import UserService from "../../services/UserService";
const RemoveFromCart = ({ prodId, refreshCart }: any) => {
  const handleRemoveFromCart = () => {
    axios
      .post(`http://localhost:8080/api/v1/removeFromCart`, {
        creatorId: UserService.getCurrentUser("id"),
        productId: prodId,
        quantity: 1,
      })
      .then((response) => {
        if (response.status === 200) {
          toast(response.data, { autoClose: 1000, type: "success" });
          refreshCart();
        }
      })
      .catch((error: any) => {
        toast(error.message, { autoClose: 1000, type: "error" });
      });
  };
  return (
    <Button
      variant="dark"
      className="DeleteFromCartButton"
      onClick={handleRemoveFromCart}
    >
      Delete From Cart
    </Button>
  );
};

export default RemoveFromCart;
