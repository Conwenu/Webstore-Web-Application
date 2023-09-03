import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import UserService from "../../services/UserService";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EditProduct from "../editproduct/EditProduct";
import DeleteProduct from "../deleteproduct/DeleteProduct";
import "./UserProducts.css";
import { Button } from "react-bootstrap";
import { Card } from "react-bootstrap";
const UserProducts = () => {
  const [userProducts, setuserProducts] = useState<any>([]);
  const id = UserService.getCurrentUser("id");
  const getUserProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/products/user/${id}`
      );
      setuserProducts(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getUserProducts();
  }, []);
  return (
    <div>
      <Button
        className="RefreshProductsButton"
        onClick={getUserProducts}
        variant="success"
      >
        Refresh Products
      </Button>
      {userProducts.length === 0 ? (
        <div>This user has created no products.</div>
      ) : (
        userProducts.map((userProducts: any) => (
          <div key={uuidv4()} className="UserProductContainer">
            <>
              <Card border="secondary" className="ProductCard">
                {" "}
                <Link to={`/product/${userProducts.id}`}>
                  <Card.Header>{userProducts.name}</Card.Header>
                  <Card.Header>Price: ${userProducts.price}</Card.Header>
                  <Card.Header>
                    Total Stock Left: {userProducts.totalStock}
                  </Card.Header>
                </Link>
                <Card.Img src={userProducts.imageUrl}></Card.Img>
                <Card.Header>
                  <Card.Text>{userProducts.description}</Card.Text>
                </Card.Header>
                <br />
                <>
                  <EditProduct
                    className="EditProduct"
                    product={userProducts}
                    prodId={userProducts.id}
                    imageUrl={userProducts.imageUrl}
                    imageId={userProducts.imageId}
                    prevName={userProducts.name}
                    refreshProduct={getUserProducts}
                  />
                  <DeleteProduct
                    className="DeleteProduct"
                    prodId={userProducts.id}
                    imageUrl={userProducts.imageUrl}
                    imageId={userProducts.imageId}
                    refreshProduct={getUserProducts}
                  />
                </>
              </Card>
            </>
          </div>
        ))
      )}
    </div>
  );
};

export default UserProducts;
