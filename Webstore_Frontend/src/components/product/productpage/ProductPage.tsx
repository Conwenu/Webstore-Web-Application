import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import { Card } from "react-bootstrap";
import { ListGroup } from "react-bootstrap";
import ReviewComponent from "../../reviews/reviewcomponent/ReviewComponent";
import AddToCart from "../../cart/addtocart/AddToCart";
import PurchaseProductModal from "../../purchase/PurchaseProductModal";
import RateProductModal from "../rateproduct/RateProductModal";
import ProductsRatingView from "../rateproduct/ProductRatingsView";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import "./ProductPage.css";
const ProductPage = ({}) => {
  const { prodId } = useParams();
  const [product, setProduct] = useState<any>([]);
  const getProduct = async (prodId: any) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/product/${prodId}`
      );

      setProduct(response.data);
      console.log(product.id);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProduct(prodId);
  }, []);
  return (
    <div>
      {product.length === 0 ? (
        <p>No Product Found</p>
      ) : (
        <div className="ProductPageSpecific" key={uuidv4()}>
          <Card className="ProductPageCard">
            <Card.Body>
              <div>
                <Container>
                  <Row>
                    <Col>
                      <span>
                        <img
                          className="ProductPageImage"
                          src={product.imageUrl}
                        ></img>
                      </span>
                    </Col>
                    <Col>
                      <span className="ProductPageInfo">
                        <ListGroup className="list-group-flush">
                          <ListGroup.Item className="ProductPageListGroupItem">
                            {product.name}
                          </ListGroup.Item>
                          <ListGroup.Item className="ProductPageListGroupItem">
                            {product.description}
                          </ListGroup.Item>
                          <ListGroup.Item className="ProductPageListGroupItem">
                            ${product.price.toLocaleString()}
                          </ListGroup.Item>
                          <ListGroup.Item className="ProductPageListGroupItem">
                            <ProductsRatingView
                              productId={product.id}
                              productName={product.name}
                            />
                            <RateProductModal
                              productId={product.id}
                              productName={product.name}
                              refreshProduct={getProduct}
                            />
                          </ListGroup.Item>
                          <ListGroup.Item className="ProductPageListGroupItem">
                            <AddToCart prodId={product.id} />
                          </ListGroup.Item>
                          <ListGroup.Item className="ProductPageListGroupItem">
                            {" "}
                            {product.totalStock < 1 ? (
                              <div>
                                This Item is currently out of stock, please try
                                again later
                              </div>
                            ) : (
                              <PurchaseProductModal
                                productName={product.name}
                                productPrice={product.price}
                                productId={product.id}
                                productImageUrl={product.imageUrl}
                                totalStock={product.totalStock}
                              />
                            )}
                          </ListGroup.Item>
                        </ListGroup>
                      </span>
                    </Col>
                  </Row>
                </Container>
              </div>
            </Card.Body>
          </Card>

          <ReviewComponent
            prodId={product.id}
            imageUrl={product.imageUrl}
            productName={product.name}
          />
        </div>
      )}
    </div>
  );
};

export default ProductPage;
