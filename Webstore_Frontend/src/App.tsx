import "./App.css";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductComponent from "./components/product/productcomponent/ProductComponent";
import CreateProduct from "./components/product/createproduct/CreateProduct";
import { Register } from "./components/user/register/Register";
import { Login } from "./components/user/login/Login";
import { PrivateRoute } from "./components/privateroute/PrivateRoute";
import { useUser } from "./components/userprovider/UserProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import ProductPage from "./components/product/productpage/ProductPage";
import NavbarComponent from "./components/navbar/NavbarComponent";
import NonAuthNavbarComponent from "./components/navbar/NonAuthNavbarComponent";
import { Profile } from "./components/profile/Profile";
import ForgotPassword from "./components/user/passwordchange/ForgotPassword";
import ChangePassword from "./components/user/passwordchange/ChangePassword";
function App() {
  const user = useUser();
  useEffect(() => {}, [user]);
  return (
    <>
      <div>
        <Router>
          {user.jwt != undefined &&
          user.jwt !== "null" &&
          user.jwt &&
          user.jwt.length > 0 ? (
            <NavbarComponent />
          ) : (
            <NonAuthNavbarComponent />
          )}
          <Routes>
            <Route path="register" element={<Register />}></Route>
            <Route path="login" element={<Login />}></Route>
            <Route
              path="forgotPassReset/:token"
              element={<ForgotPassword />}
            ></Route>
            <Route path="" element={<Register />}></Route>

            <Route
              path="products"
              element={
                <PrivateRoute>
                  <ProductComponent />
                </PrivateRoute>
              }
            ></Route>

            <Route
              path="createProduct"
              element={
                <PrivateRoute>
                  <CreateProduct />
                </PrivateRoute>
              }
            ></Route>

            <Route
              path="changePassword"
              element={
                <PrivateRoute>
                  <ChangePassword />
                </PrivateRoute>
              }
            ></Route>

            <Route
              path="product/:prodId"
              element={
                <PrivateRoute>
                  <ProductPage />
                </PrivateRoute>
              }
            />

            <Route
              path="profile/:userId"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
