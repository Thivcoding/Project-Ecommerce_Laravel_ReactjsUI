import React from 'react'
import AppRoutes from './components/routes/AppRoutes'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './components/context/AuthContext'
import { CartProvider } from './components/context/CartContext'
import { OrderProvider } from './components/context/OrderContext'

const App = () => {
  return ( 
      <AuthProvider>
        <CartProvider>  
           <OrderProvider>
              <BrowserRouter>
                  <AppRoutes/>
              </BrowserRouter>
            </OrderProvider> 
        </CartProvider>
      </AuthProvider>
  )
}

export default App