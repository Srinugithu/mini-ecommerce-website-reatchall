import React, { useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const Home = ({ searchTerm }) => {
    const { products, loading, page, pages, count, category, setPage, setCategory, fetchProducts } = useProducts();
    const { addToCart } = useCart();

    const categories = ['All', 'Apparel', 'Electronics', 'Accessories', 'Food & Beverage', 'Footwear', 'Fitness', 'Home & Living'];

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts(searchTerm, page, category === 'All' ? '' : category);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, page, category, fetchProducts]);

    const handleCategoryChange = (cat) => {
        setCategory(cat);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pages) {
            setPage(newPage);
            window.scrollTo(0, 0);
        }
    };

    if (loading && products.length === 0) {
        return (
            <div className="loading-state">
                <Loader2 size={48} className="animate-spin" />
                <p>Loading products...</p>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <header className="page-header">
                <h1>Our Products</h1>
                <p>{count} items found</p>
            </header>

            <div className="filters-section">
                <div className="category-filters">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-btn ${category === cat || (cat === 'All' && !category) ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="loading-state" style={{ minHeight: '400px' }}>
                    <Loader2 size={48} className="animate-spin" />
                </div>
            ) : products.length === 0 ? (
                <div className="no-products">
                    <h2>No Products Found</h2>
                    <p>Try adjusting your search criteria or category.</p>
                </div>
            ) : (
                <>
                    <div className="product-grid">
                        {products.map(product => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onAddToCart={addToCart}
                            />
                        ))}
                    </div>

                    {pages > 1 && (
                        <div className="pagination">
                            <button
                                className="page-btn"
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                            >
                                <ChevronLeft size={20} />
                                Previous
                            </button>

                            <div className="page-numbers">
                                {[...Array(pages).keys()].map(x => (
                                    <button
                                        key={x + 1}
                                        className={`page-num ${page === x + 1 ? 'active' : ''}`}
                                        onClick={() => handlePageChange(x + 1)}
                                    >
                                        {x + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                className="page-btn"
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === pages}
                            >
                                Next
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Home;
