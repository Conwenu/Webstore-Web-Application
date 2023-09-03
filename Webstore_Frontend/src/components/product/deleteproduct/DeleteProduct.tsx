import axios from "axios";
import { Button } from "react-bootstrap";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { storage, db } from "../firebase";
import { toast } from "react-toastify";
import "./DeleteProduct.css";
export default function DeleteProduct({
  prodId,
  imageUrl,
  imageId,
  refreshProduct,
}: any) {
  const handleProductDeletion = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(
          `http://localhost:8080/api/v1/deleteProduct/${prodId}`
        );
        await deleteDoc(doc(db, "Images", imageId.toString()));
        const storageRef = ref(storage, imageUrl.toString());
        await deleteObject(storageRef);
        refreshProduct();
        toast("Product Deleted", { autoClose: 1000, type: "success" });
      } catch (error: any) {
        toast(error.response, { autoClose: 1000, type: "error" });
      }
    }
  };

  return (
    <Button
      className="DeleteProductButton"
      variant="danger"
      onClick={handleProductDeletion}
    >
      {"Delete Product"}
    </Button>
  );
}
