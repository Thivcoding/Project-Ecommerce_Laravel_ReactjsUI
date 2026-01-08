import api from "../../api/axios";

export const getProduct = ()=> api.get('/products')
export const getProductById = (id)=> api.get(`/products/${id}`)
export const createProduct = (data) => api.post("/products", data ,{
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const updateProduct = (id, data) => api.post(`/products/${id}?_method=PUT`, data,{
                                                    headers: {
                                                    "Content-Type": "multipart/form-data",
                                                    }
    });
export const deleteProduct = (id) => api.delete(`/products/${id}`);