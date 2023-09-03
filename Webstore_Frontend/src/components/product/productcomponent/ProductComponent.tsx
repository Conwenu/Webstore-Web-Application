import axios from "axios";
import "./ProductComponent.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import AddToCart from "../../cart/addtocart/AddToCart";
export default function ProductComponent() {
  const [product, setProducts] = useState<any>([]);
  let a: any = Object;
  const getProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/products");

      setProducts(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getProducts();
  }, []);
  return (
    <>
      <div className="ProductsContainer">
        {product.length === 0 ? (
          <p>No Products Found</p>
        ) : (
          product?.map((product: any) => (
            <div className="Product" key={product.id}>
              <Card className="ProductContainer" style={{ width: "18rem" }}>
                <Card.Img variant="top" src={product.imageUrl} />
                <Card.Body className="ProductCardBody">
                  <Link to={`/product/${product.id}`}>
                    <Card.Title className="ProductCardTitle">
                      {product.name}
                    </Card.Title>
                    <Card.Title className="ProductCardTitle">
                      ${product.price.toLocaleString()}
                    </Card.Title>
                    {""}
                    {a.values(product.ratings).length !== 0 ? (
                      <div>
                        {a
                          .values(product.ratings)
                          .reduce(function (a: any, b: any) {
                            return a + b;
                          }) / Object.values(product.ratings).length}
                        %
                      </div>
                    ) : (
                      <div>No user has rated this product yet.</div>
                    )}
                  </Link>

                  <AddToCart prodId={product.id} />
                </Card.Body>
              </Card>
            </div>
          ))
        )}
      </div>
    </>
  );
}
