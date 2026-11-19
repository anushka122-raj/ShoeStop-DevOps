
import API_BASE_URL from '../../api';
import React, { useContext } from 'react';
import './fav.css';
import { Button } from 'react-bootstrap';
import { productContext } from '../contextAPI/Context';
import axios from 'axios';

const Fav = () => {
    const url = `${API_BASE_URL}/api/addfav`;

    const {
        favProList,
        setFavProductList,
        token
    } = useContext(productContext);

    // Fetch favourite products
    const getFav = async () => {
        try {
            if (token) {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setFavProductList(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch favourites:', error);
        }
    };

    // Remove a favourite product
    const removeFavItems = async (id) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/api/addfav/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );

        setFavProductList(prev =>
            prev.filter(item => item._id !== id)
        );

        console.log('Favourite removed:', response.data);

    } catch (error) {
        console.error('Delete error:', error.response?.data || error.message);
        alert(error.response?.data?.message || 'Could not remove favourite');
    }
};

    return (
        <div>
            {favProList.length > 0 ? (
                <div className="fav">

                    <h4>{favProList.length} fav items here</h4>

                    {favProList.map((li) => (
                        <div className="items" key={li._id}>

                            <img
                                src={li.image}
                                className="img"
                                alt={li.title}
                            />

                            <p className="title">{li.title}</p>

                            <p className="company">{li.company}</p>

                            <p className="price text-dark">
                                Rs: {li.price}
                            </p>

                            <div className="Fbtns">
                                <Button
                                    variant="danger"
                                    onClick={() => removeFavItems(li._id)}
                                >
                                    Remove From Favourite
                                </Button>
                            </div>

                        </div>
                    ))}

                </div>
            ) : (
                <div className="no-items">
                    <p>No fav items here</p>
                </div>
            )}
        </div>
    );
};

export default Fav;
