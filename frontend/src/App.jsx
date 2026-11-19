import React, { useContext } from 'react';
import './App.css';

import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';

import Home from './component/home/Home';
import Fav from './component/fav/Fav';
import Navbar from './component/navbar/Navbar';
import Cart from './component/cart/Cart';
import Signup from './component/signup/Signup';
import Login from './component/login/Login';
import NavbarLog from './component/navbar/NavbarLog';

import { productContext } from './component/contextAPI/Context';

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {

    const { token } = useContext(productContext);

    return (
        <BrowserRouter>

            {token ? <NavbarLog /> : <Navbar />}

            <Routes>

                <Route
                    path="/"
                    element={token ? <Home /> : <Login />}
                />

                <Route path="/home" element={<Home />} />

                <Route path="/login" element={<Login />} />

                <Route path="/signup" element={<Signup />} />

                <Route path="/cart" element={<Cart />} />

                <Route path="/fav" element={<Fav />} />

            </Routes>

        </BrowserRouter>
    );
};

export default App;