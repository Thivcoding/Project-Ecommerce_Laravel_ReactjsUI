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
import Products from "../pages/admin/Products/Products"
import Users from "../pages/admin/Users"
import DashboardLayout from "../layout/DashboardLayout"
import CreateProduct from "../pages/admin/Products/CreateProduct"
import EditProduct from "../pages/admin/Products/EditProduct"
import Categories from "../pages/admin/Categorys/Category"
import CreateCategory from "../pages/admin/Categorys/CreateCategory"
import EditCategory from "../pages/admin/Categorys/EditCategory"
import OrdersList from "../pages/admin/Orders"


const AppRoutes = () => {
  return (
    <Routes>
      
      {/* user */}
      <Route path="/" element={<MasterLayoutUser />}>
          <Route index element={<Home />} />
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
      <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          {/*  */}
          <Route path="products" element={<Products />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          {/*  */}
          <Route path="categories" element={<Categories />} />
          <Route path="categories/create" element={<CreateCategory />} />
          <Route path="categories/edit/:id" element={<EditCategory />} />

          <Route path="orders" element={<OrdersList/>} />
          <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
