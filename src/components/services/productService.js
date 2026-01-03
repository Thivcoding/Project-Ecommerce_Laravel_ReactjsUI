import api from "../../api/axios";

export const getProduct = ()=> api.get('/products')

export const getProductById = (id)=> api.get(`/products/${id}`)