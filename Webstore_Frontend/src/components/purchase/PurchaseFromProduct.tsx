import { Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

import UserService from "../services/UserService";
const PurchaseFromProduct = ({
  productId,
  quantity,
  close,
  productName,
}: any) => {
  const id = UserService.getCurrentUser("id");
  const handlePurchaseFromProduct = async () => {
    await axios
      .post(`http://localhost:8080/api/v1/handleOrderFromItem`, {
        productId: productId,
        quantity: quantity,
        creatorId: id,
      })
      .then((response) => {
        if (response.status === 200) {
          toast(
            `You have successfully purchased
              ${productName} 
               x  
              ${quantity}`,
            {
              autoClose: 1000,
              type: "success",
            }
          );
          close();
        }
      })
      .catch((error) => {
        toast(error.message, { autoClose: 1000, type: "error" });
      });
  };
  return (
    <Button variant="success" onClick={handlePurchaseFromProduct}>
      Purchase!
    </Button>
  );
};

export default PurchaseFromProduct;
