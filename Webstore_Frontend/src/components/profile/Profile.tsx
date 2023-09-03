import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CartComponent from "../cart/cartcomponent/CartComponent";
import UserProducts from "../product/userproducts/UserProducts";
import UserReviews from "../reviews/userreviews/UserReviews";
import UserSettings from "../usersettings/UserSettings";
import OrderComponent from "../purchase/ordercomponent/OrderComponent";
import RatingsFromUser from "../product/ratingsfromuser/RatingsFromUser";
import CreateProduct from "../product/createproduct/CreateProduct";
import "./Profile.css";
export const Profile = () => {
  return (
    <div>
      <Tabs defaultActiveKey="Cart" id="fill-tab-example" className="mb-3" fill>
        <Tab eventKey="Cart" title="Cart">
          <CartComponent />
        </Tab>
        <Tab eventKey="Products" title="Products">
          <UserProducts />
        </Tab>
        <Tab eventKey="Create Product" title="Create Product">
          <CreateProduct />
        </Tab>
        <Tab eventKey="Reviews" title="Reviews">
          <UserReviews />
        </Tab>
        <Tab eventKey="Ratings" title="Ratings">
          <RatingsFromUser />
        </Tab>
        <Tab eventKey="Orders" title="Orders">
          <OrderComponent />
        </Tab>
        <Tab eventKey="User Settings" title="User Settings">
          <UserSettings />
        </Tab>
      </Tabs>
    </div>
  );
};
