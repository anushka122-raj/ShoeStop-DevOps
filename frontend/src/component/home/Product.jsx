import API_BASE_URL from '../../api';
import axios from 'axios';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import './home.css';
import { productContext } from '../contextAPI/Context';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [sortBy, setSortBy] = useState('featured');

    const { token, favProList, getFav } = useContext(productContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/getproducts`
                );
                setProducts(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Unable to load products:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (token) {
            getFav();
        }
    }, [token]);

    const brands = useMemo(
        () => ['All', ...new Set(products.map(p => p.company).filter(Boolean))],
        [products]
    );

    const filteredProducts = useMemo(() => {
        let result = products.filter(product => {
            const matchesSearch =
                `${product.title} ${product.company}`
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesBrand =
                selectedBrand === 'All' || product.company === selectedBrand;

            return matchesSearch && matchesBrand;
        });

        if (sortBy === 'low') {
            result.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortBy === 'high') {
            result.sort((a, b) => Number(b.price) - Number(a.price));
        }

        return result;
    }, [products, search, selectedBrand, sortBy]);

    const addToCart = async (product) => {
        if (!token) {
            alert('Please login to add products to your cart.');
            return;
        }

        try {
            await axios.post(
                `${API_BASE_URL}/api/addcart`,
                {
                    image: product.image,
                    title: product.title,
                    company: product.company,
                    price: product.price
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert('Product added to cart!');
        } catch (error) {
            console.error(error);
            alert('Unable to add product. Please try again.');
        }
    };

    const toggleFavourite = async (product) => {
        if (!token) {
            alert('Please login to add products to your favourites.');
            return;
        }

        const existingFavourite = favProList.find(
            item => item.title === product.title
        );

        try {
            if (existingFavourite) {
                await axios.delete(
                    `${API_BASE_URL}/api/addfav/${existingFavourite._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            } else {
                await axios.post(
                    `${API_BASE_URL}/api/addfav`,
                    {
                        image: product.image,
                        title: product.title,
                        company: product.company,
                        price: String(product.price)
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }

            await getFav();

        } catch (error) {
            console.error('Favourite update failed:', error);
            alert('Unable to update favourites. Please try again.');
        }
    };

    return (
        <section className="shop-section">
            <div className="shop-heading">
                <span className="shop-eyebrow">THE COLLECTION</span>
                <h2>Find Your <span>Perfect Pair.</span></h2>
                <p>Discover footwear that moves with your style.</p>
            </div>

            <div className="shop-toolbar">
                <input
                    type="search"
                    placeholder="Search shoes or brands..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    aria-label="Search products"
                />

                <select
                    value={selectedBrand}
                    onChange={e => setSelectedBrand(e.target.value)}
                    aria-label="Filter by brand"
                >
                    {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </select>

                <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    aria-label="Sort products"
                >
                    <option value="featured">Featured</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                </select>
            </div>

            <div className="shop-result-count">
                Showing {filteredProducts.length} products
            </div>

            <div className="premium-product-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => {
                        const isFavourite = favProList.some(
                            item => item.title === product.title
                        );

                        return (
                            <article className="premium-card" key={product._id}>
                                <div className="premium-image-wrap">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        loading="lazy"
                                        onError={e => {
                                            e.currentTarget.src =
                                                'https://placehold.co/600x600/f3f3f3/555?text=Image+Unavailable';
                                        }}
                                    />

                                    <span className="product-badge">
                                        NEW ARRIVAL
                                    </span>

                                    <button
                                        type="button"
                                        className={`favourite-heart ${isFavourite ? 'active' : ''}`}
                                        onClick={() => toggleFavourite(product)}
                                        aria-label={
                                            isFavourite
                                                ? 'Remove from favourites'
                                                : 'Add to favourites'
                                        }
                                        title={
                                            isFavourite
                                                ? 'Remove from favourites'
                                                : 'Add to favourites'
                                        }
                                    >
                                        {isFavourite ? '♥' : '♡'}
                                    </button>
                                </div>

                                <div className="premium-card-info">
                                    <span className="premium-brand">
                                        {product.company}
                                    </span>

                                    <h3>{product.title}</h3>

                                    <div className="premium-card-bottom">
                                        <span className="premium-price">
                                            ₹{Number(product.price).toLocaleString('en-IN')}
                                        </span>

                                        <button
                                            className="premium-cart-btn"
                                            onClick={() => addToCart(product)}
                                        >
                                            Add to Cart <span>+</span>
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })
                ) : (
                    <div className="shop-empty">
                        <h3>No shoes found</h3>
                        <p>Try another search or select a different brand.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Product;