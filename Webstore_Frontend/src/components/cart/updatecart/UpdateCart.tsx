import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import UserService from "../../services/UserService";
import { toast } from "react-toastify";

const UpdateCart = ({ prodId, newQuantity, refreshCart, closeModal }: any) => {
  const handleUpdateCart = () => {
    axios
      .put(`http://localhost:8080/api/v1/updateCart`, {
        creatorId: UserService.getCurrentUser("id"),
        productId: prodId,
        quantity: newQuantity, // I'll change this to the actual new quantity later.
      })
      .then((response) => {
        if (response.status === 200) {
          toast(response.data, { autoClose: 1000, type: "success" });
          refreshCart();
          closeModal();
        }
      })
      .catch((error) => {
        toast(error, { autoClose: 1000, type: "error" });
      });
  };
  return (
    <Button variant="dark" onClick={handleUpdateCart}>
      UpdateCart
    </Button>
  );
};

export default UpdateCart;
