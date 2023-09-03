import axios from "axios";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { doc, updateDoc } from "firebase/firestore";
import UserService from "../../services/UserService";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import ProgressBar from "react-bootstrap/ProgressBar";
import "./EditProduct.css";
import {
  deleteObject,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage, db } from "../firebase";
import { useState } from "react";
export default function EditProduct({
  product,
  prodId,
  imageUrl,
  imageId,
  prevName,
  refreshProduct,
}: any) {
  const [progPercent, setProgPercent] = useState(0);
  const [tempImage, setTempImage] = useState<File>();
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    imageUrl: imageUrl,
    price: product.price,
    maxQuantityPerOrder: product.maxQuantityPerOrder,
    totalStock: product.totalStock,
    imageName: product.imageName,
    imageId: imageId,
  });

  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleImageChange = (event: any) => {
    setTempImage(event.target.files[0]);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let userId = UserService.getCurrentUser("id");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    event.persist();
    try {
      if (!tempImage) {
        console.log("No File here!");
        axios.put(`http://localhost:8080/api/v1/editProduct/${prodId}`, {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          maxQuantityPerOrder: formData.maxQuantityPerOrder,
          totalStock: formData.totalStock,
          imageUrl: formData.imageUrl,
          imageName: formData.imageName,
          imageId: formData.imageId,
        });
        toast("You have successfully editied your product!", {
          autoClose: 1000,
          type: "success",
        });
        handleClose();
        setFormData({
          name: "",
          description: "",
          imageUrl: "",
          price: 0,
          maxQuantityPerOrder: 0,
          totalStock: 0,
          imageName: "",
          imageId: "",
        });
      }
      if (tempImage!.size > 5242880) {
        toast("Please uploaad a file smaller than 5MB", {
          autoClose: 1000,
          type: "error",
        });
        return {};
      } else {
        let tempName = `${Date.now()}${tempImage!.name}`;
        const storageRef = ref(storage, `/files/${tempName}`);
        const uploadTask = uploadBytesResumable(storageRef, tempImage!);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const prog = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgPercent(prog);
            console.log("Edit file upload progress: " + prog + "%");
          },
          (error) => console.log(error),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setFormData({ ...formData, [imageUrl]: downloadURL });
              const tempRef = doc(db, "Images", formData.imageId);
              const storageRef = ref(storage, product.imageUrl);
              deleteObject(storageRef);
              updateDoc(tempRef, { url: downloadURL, fileName: tempName }).then(
                () => {
                  axios.put(
                    `http://localhost:8080/api/v1/editProduct/${prodId}`,
                    {
                      name: formData.name,
                      description: formData.description,
                      price: formData.price,
                      maxQuantityPerOrder: formData.maxQuantityPerOrder,
                      totalStock: formData.totalStock,
                      imageUrl: downloadURL,
                      imageName: tempName,
                      imageId: formData.imageId,
                      creatorId: userId,
                    }
                  );
                  toast("You have successfully editied your product!", {
                    autoClose: 1000,
                    type: "success",
                  });
                  refreshProduct(prodId);
                  handleClose();
                  setFormData({
                    name: "",
                    description: "",
                    imageUrl: "",
                    price: 0,
                    maxQuantityPerOrder: 0,
                    totalStock: 0,
                    imageName: "",
                    imageId: "",
                  });
                  tempName = "";
                }
              );
              return { downloadURL };
            });
          }
        );
      }
    } catch (error) {}
  };

  return (
    <>
      <Button
        className="EditProductButton"
        variant="success"
        onClick={handleShow}
      >
        Edit Product Info
      </Button>

      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header className="EditFormTitle" closeButton>
          <Modal.Title>Edit "{prevName}"</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="FormContainer">
            <Form onSubmit={handleSubmit}>
              <br />
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  minLength={1}
                  maxLength={255}
                  type="text"
                  name="name"
                  placeholder="Apple"
                  required
                  defaultValue={formData.name}
                  onChange={(event) => handleChange(event)}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label className="ProductDescription">
                  Product Description
                </Form.Label>
                <Form.Control
                  placeholder="A juicy fruit"
                  name="description"
                  minLength={1}
                  maxLength={255}
                  required
                  defaultValue={formData.description}
                  onChange={(event) => handleChange(event)}
                  as="textarea"
                  rows={3}
                />
              </Form.Group>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Image [MAX SIZE: 5MB]</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  name="imageUpload"
                  onChange={(event) => handleImageChange(event)}
                />
                {progPercent === 0 ? null : (
                  <ProgressBar
                    variant="success"
                    animated
                    now={progPercent}
                    label={`${progPercent}%`}
                  />
                )}
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Total Stock</Form.Label>
                <Form.Control
                  type="number"
                  name="totalStock"
                  placeholder="1500"
                  step={1}
                  min="0"
                  max="100000"
                  defaultValue={formData.totalStock}
                  required
                  onChange={(event) => handleChange(event)}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Price</Form.Label>
                <Form.Control
                  name="price"
                  min={1.0}
                  step={0.01}
                  max={100000.0}
                  type="number"
                  placeholder="$33.99"
                  defaultValue={formData.price}
                  required
                  onChange={(event) => handleChange(event)}
                />
              </Form.Group>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button type="submit">Edit Product!</Button>
              </Modal.Footer>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
