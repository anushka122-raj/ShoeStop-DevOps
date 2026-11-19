import { useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { productContext } from '../contextAPI/Context';

function NavbarLog() {

    const { setToken, setCartProducts, setFavProductList } = useContext(productContext);
     const navigate = useNavigate();
   const handleLogout = () => {
    localStorage.removeItem('token');

    setToken('');
    setCartProducts([]);
    setFavProductList([]);

    navigate('/login', { replace: true });
};

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/">ShoeStop</Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="m-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/cart">Cart</Nav.Link>
                        <Nav.Link href="/fav">Favourites</Nav.Link>
                    </Nav>

                    <Nav className="mx-5">
                        <Button
                            variant="light"
                            className="px-4"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarLog;