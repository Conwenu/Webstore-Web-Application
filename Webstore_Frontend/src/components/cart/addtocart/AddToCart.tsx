import axios from "axios";
import { toast } from "react-toastify";

import Button from "react-bootstrap/esm/Button";
import UserService from "../../services/UserService";
const AddToCart = ({ prodId }: any) => {
  const handleAddToCart = () => {
    axios
      .post(`http://localhost:8080/api/v1/addToCart`, {
        creatorId: UserService.getCurrentUser("id"),
        productId: prodId,
        quantity: 1,
      })
      .then((response) => {
        if (response.status === 200) {
          toast(response.data, {
            autoClose: 1000,
            type: "success",
          });
        }
      })
      .catch((error: any) => {
        toast(error.message, {
          autoClose: 1000,
          type: "error",
        });
      });
  };
  return (
    <Button variant="outline-dark" onClick={handleAddToCart}>
      AddToCart
    </Button>
  );
};

export default AddToCart;
