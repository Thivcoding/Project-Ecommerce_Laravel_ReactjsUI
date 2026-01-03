import { Routes, Route } from "react-router-dom"

// frontend
import Home from "../pages/frontend/Home"
import Cart from "../pages/frontend/Cart"
import Orders from "../pages/frontend/Orders"
import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import Dashboard from "../pages/admin/Dashboard"
import MasterLayoutUser from "../layout/MasterLayoutUser"
import DetailProduct from "../pages/frontend/Product/DetailProduct"
import Checkout from "../pages/frontend/Checkout"
import Product from "../pages/frontend/Product/Product"
import Profile from "../pages/frontend/Profile"


const AppRoutes = () => {
  return (
    <Routes>
      
      {/* user */}
      <Route path="/" element={<MasterLayoutUser />}>
          <Route index element={<Home />} /> {/* default child route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* product */}
          <Route path="/product" element={<Product/>}/>

          {/* product Detail*/}
          <Route path="/product/:id" element={<DetailProduct/>}/>

          {/* cart page */}
          <Route path="/cart" element={<Cart />}/>

          {/* Check out page */}
          <Route path="/checkout" element={<Checkout/>}/>

          {/* History Order */}
          <Route path="/orders" element={<Orders />}/>

          <Route path="/profile" element={<Profile/>}/>
      </Route>

      {/* admin */}
      <Route
        path="/admin"
        element={
          <Dashboard/>
        }
      />
    </Routes>
  )
}

export default AppRoutes
