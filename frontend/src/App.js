import './App.css';
import { Navbar } from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import { ActiveMenuProvider } from './Context/ActiveMenuContext';
import { UserProvider } from "./Context/UserContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from './Pages/Signup';
import ShopContextProvider from './Context/ShopContext';
import PaymentConfirmation from './Pages/PaymentConfirmation';

function App() {
  return (
    <div>
      <BrowserRouter>
        <UserProvider>
          <ShopContextProvider>
            <ActiveMenuProvider>
              <Navbar />
              <Routes>
                <Route path='/' element={<Shop />} />
                <Route path='/manual_tools' element={<ShopCategory category="manual_tools" />} />
                <Route path='/electric_tools' element={<ShopCategory category="electric_tools" />} />
                <Route path='/construction_material' element={<ShopCategory category="construction_material" />} />
                <Route path='/security' element={<ShopCategory category="security" />} />
                <Route path='/various_accesories' element={<ShopCategory category="various_accesories" />} />
                <Route path='product' element={<Product />}>
                  <Route path=':productId' element={<Product />}></Route>
                </Route>
                <Route path='/cart' element={<Cart />}></Route>
                <Route path='/login' element={<LoginSignup />}></Route>
                <Route path='/signup' element={<Signup />}></Route>
                <Route path='/payment-confirmation' element={<PaymentConfirmation />} />
              </Routes>
            </ActiveMenuProvider>
          </ShopContextProvider>
        </UserProvider>
      </BrowserRouter>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
