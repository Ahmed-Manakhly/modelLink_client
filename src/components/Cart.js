import { Link, useNavigate } from 'react-router-dom';
import Modal from './layout/Modal'
import classes from './Cart.module.scss';
import { useSelector } from 'react-redux';
import Card from './Card'
import { cartActions } from '../store/Cart-slice';
import { useDispatch } from 'react-redux';
import { getModelMarketingFields } from '../lib/modelHelpers';


function Cart() {
    const items = useSelector(state => state.cart.items);
    const totalAmount = useSelector(state => state.cart.totalAmount);
    const navigate = useNavigate();
    const onClose = () => {
        navigate('/')
    }
    const dispatch = useDispatch();
    const onRemoveProduct = (item) => {
        dispatch(cartActions.removeFromCart(item))
    }

    return (
        <Modal onClose={onClose} >
            <div className={classes.cartCon}>
                <div className={classes["product-container"]}>
                    <div className={classes["container"]}>
                        <div className={classes["product-main"]}>
                            <div className="text-center mb-5 mt-3">
                                <h1 className="page-main-title" style={{ textAlign: 'center' }}>
                                    <span className="gradient-text">Your Cart</span>
                                    <span className="sub-title d-block mt-3">Ready to checkout? 🚀 Secure your AI models and accelerate your workflow!</span>
                                </h1>
                            </div>
                            {items.length === 0 ? (
                                <div className="text-center py-5">
                                    <p>Your cart is empty.</p>
                                    <Link to="/models" className="btn-glass-primary" onClick={onClose}>
                                        Browse Models
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className={classes["product-grid"]}>
                                        {items.map((ele) => {
                                            const m = getModelMarketingFields(ele, ele.versionId);
                                            return (
                                                <div key={ele.cartKey || `${ele.id}-${ele.versionId}`} className="w-100 d-flex flex-column h-100">
                                                    <div className="flex-grow-1">
                                                        <Card
                                                        sellerUser={ele?.developer}
                                                        id={ele.id}
                                                        category={m.category}
                                                        categorySlug={m.categorySlug}
                                                        title={m.title}
                                                        desc={m.desc}
                                                        price={ele.linePrice ?? m.price}
                                                        deliveryTime={m.deliveryTime}
                                                        cover={ele.cover || ele.galleryImages?.[0]}
                                                        galleryImages={ele.galleryImages}
                                                        starFrequency={ele.starFrequency}
                                                        totalStars={ele.totalStars}
                                                        avgRating={ele?.avgRating}
                                                        sales={m.sales}
                                                        views={ele?.views ?? 0}
                                                        reviewCount={m.reviewCount}
                                                        tags={m.tags}
                                                        modality={m.modality}
                                                        isPrimary={m.isPrimary}
                                                        featured={ele?.featured === true}
                                                        fda={m.fda}
                                                        version={m.version}
                                                        onRemoveProduct={() => onRemoveProduct(ele)}
                                                        cart={true}
                                                        userId={ele.developerId}
                                                    />
                                                    <div className="text-center px-2 pb-3 mt-3">
                                                        <div className="mb-2 text-muted small">
                                                            Version: {ele.versionLabel || m.version || 'Primary'}
                                                        </div>
                                                        <Link
                                                            to={`/models/view/${ele.id}${ele.versionId ? `?versionId=${ele.versionId}` : ''}`}
                                                            className="btn-glass-primary btn-sm fw-bold px-4"
                                                            onClick={onClose}
                                                        >
                                                            View / Purchase
                                                        </Link>
                                                    </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className={`d-flex justify-content-end align-items-center px-3 py-3 mt-4 ${classes.subtotalSection}`}>
                                        <h5 className={`mb-0 fw-bold ${classes.subtotalAmount}`}>
                                            <span className={`me-2 ${classes.subtotalLabel}`}>Subtotal:</span>
                                            ${Number(totalAmount).toFixed(2)}
                                        </h5>
                                    </div>
                                    <div className="pb-4"></div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default Cart
