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
                            <h2 className={classes["title"]}>Your Cart</h2>
                            {items.length === 0 ? (
                                <div className="text-center py-5">
                                    <p>Your cart is empty.</p>
                                    <Link to="/models" className="btn btn-primary" onClick={onClose}>
                                        Browse Models
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className={classes["product-grid"]}>
                                        {items.map((ele) => {
                                            const m = getModelMarketingFields(ele, ele.versionId);
                                            return (
                                                <div key={ele.cartKey || `${ele.id}-${ele.versionId}`}>
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
                                                    <div className="d-flex justify-content-between align-items-center px-2 pb-3">
                                                        <span className="text-muted small">
                                                            Version: {ele.versionLabel || m.version || 'Primary'}
                                                        </span>
                                                        <Link
                                                            to={`/models/view/${ele.id}${ele.versionId ? `?versionId=${ele.versionId}` : ''}`}
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={onClose}
                                                        >
                                                            View / Purchase
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="d-flex justify-content-end px-3 pb-4">
                                        <strong>Subtotal: ${Number(totalAmount).toFixed(2)}</strong>
                                    </div>
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
