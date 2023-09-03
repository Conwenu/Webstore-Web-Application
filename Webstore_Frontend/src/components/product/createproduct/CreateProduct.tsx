import axios from "axios";
import { useState, useEffect } from "react";
import { storage, db } from "../firebase";
import Button from "react-bootstrap/Button";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import ProgressBar from "react-bootstrap/ProgressBar";
import { collection, addDoc } from "firebase/firestore";
import UserService from "../../services/UserService";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import "./CreateProduct.css";
const CreateProduct = () => {
  const id = UserService.getCurrentUser("id");
  const [progPercent, setProgPercent] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [tempImage, setTempImage] = useState<File>();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    price: 0,
    totalStock: 0,
    imageName: "",
    imageId: "",
    creatorId: id,
  });

  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleImageChange = (event: any) => {
    setTempImage(event.target.files![0]);
  };

  useEffect(() => {
    console.log("The download URL is now: " + imageUrl);
  }, [imageUrl]);

  async function handleSubmit(event: any) {
    event.preventDefault();

    try {
      if (!tempImage) return {};
      if (tempImage.size > 5242880) {
        toast("Please uploaad a file smaller than 5MB", {
          autoClose: 1000,
          type: "error",
        });
        return {};
      }
      let tempName = `${Date.now()}${tempImage.name}`;
      const storageRef = ref(storage, `/files/${tempName}`);
      const uploadTask = uploadBytesResumable(storageRef, tempImage!);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgPercent(prog);
          console.log(prog);
        },

        (error) => console.log(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUrl(downloadURL);
            const dbRef = collection(db, "Images");
            addDoc(dbRef, { url: downloadURL, fileName: tempName }).then(
              (docRef) => {
                axios.post("http://localhost:8080/api/v1/createProduct", {
                  name: formData.name,
                  description: formData.description,
                  price: formData.price,
                  totalStock: formData.totalStock,
                  imageUrl: downloadURL,
                  imageName: tempName,
                  imageId: docRef.id,
                  creatorId: UserService.getCurrentUser("id"),
                });
                toast("You have successfully created your product!", {
                  autoClose: 1000,
                  type: "success",
                });
                setFormData({
                  name: "",
                  description: "",
                  imageUrl: "",
                  price: 0,
                  totalStock: 0,
                  imageName: "",
                  imageId: "",
                  creatorId: UserService.getCurrentUser("id"),
                });
                tempName = "";
                setProgPercent(0);
              }
            );

            return { downloadURL };
          });
        }
      );
      console.log(imageUrl + " TESTING");
    } catch (err) {
      console.log(err);
      toast("Product Creation Failed", { autoClose: 1000, type: "error" });
    }
  }

  return (
    <div className="FormContainer">
      <Form onSubmit={handleSubmit}>
        <div style={{ color: "Black" }}>Create Your Product</div>
        <br />
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            className="FormFillIn"
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
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label className="ProductDescription">
            Product Description
          </Form.Label>
          <Form.Control
            className="FormFillIn"
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
            className="FormFillIn"
            type="file"
            accept="image/*"
            name="imageUpload"
            required
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
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Total Stock</Form.Label>
          <Form.Control
            className="FormFillIn"
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
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Price</Form.Label>
          <Form.Control
            className="FormFillIn"
            name="price"
            min={0.99}
            step={0.01}
            max={100000.0}
            type="number"
            placeholder="$33.99"
            defaultValue={formData.price}
            required
            onChange={(event) => handleChange(event)}
          />
        </Form.Group>
        <Button type="submit">Create Product</Button>
      </Form>
    </div>
  );
};

export default CreateProduct;
