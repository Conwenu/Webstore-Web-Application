import Button from "react-bootstrap/esm/Button";
import UserService from "../../services/UserService";
import { toast } from "react-toastify";

import axios from "axios";
const EmptyCart = () => {
  const handleEmptyCart = () => {
    axios
      .put(
        `http://localhost:8080/api/v1/emptyCart/${UserService.getCurrentUser(
          "id"
        )}`
      )
      .then((response) => {
        if (response.status === 200) {
          toast(response.data, { autoClose: 1000, type: "success" });
        }
      })
      .catch((error) => {
        toast(error, { autoClose: 1000, type: "error" });
      });
  };
  return (
    <Button
      className="EmptyCartButton"
      variant="danger"
      onClick={handleEmptyCart}
    >
      Empty Cart
    </Button>
  );
};

export default EmptyCart;
