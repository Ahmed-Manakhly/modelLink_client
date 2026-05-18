import {useNavigate} from 'react-router-dom' ;
import Modal from './layout/Modal'
import classes from './Cart.module.scss' ;
import {useSelector} from 'react-redux'; 
import Card from './Card'
import {cartActions} from '../store/Cart-slice' ;
import {useDispatch} from 'react-redux'; 


function Cart() {
    const items = useSelector(state => state.cart.items) ;
    const navigate = useNavigate();
    const onClose = ()=>{
        navigate('/' )
    }
    const dispatch = useDispatch();   
    const onRemoveProduct =(id)=> {
        const item = items.find((item)=>item.id === id)
        dispatch(cartActions.removeFromCart(item))
    }
    return (
        <Modal onClose={onClose} >
            <div className={classes.cartCon}>
            <div className={classes["product-container"]}>
            <div className={classes["container"]}>
                <div className={classes["product-main"]}>
                    <h2 className={classes["title"]}>Favorite List</h2>
                    <div className={classes["product-grid"]}>
                        {items.map((ele,index)=>{return(<Card
                                key={index}
                                // off={item.title}
                                seller={ele?.userData?.first_name ? ele?.userData?.first_name :ele?.userData?.org_username}
                                avatar={ele.userData.avatar}
                                id={ele.id}
                                category ={ele.category}
                                title ={ele.title}
                                desc ={ele.desc}
                                price ={ele.price}
                                deliveryTime ={ele.deliveryTime} 
                                cover ={ele.cover} 
                                starFrequency ={ele.starFrequency}
                                totalStars ={ele.totalStars}
                                onRemoveProduct={onRemoveProduct.bind(null,ele.id)}
                                cart={true}
                                userId={ele.userId}
                        
                        />)})}
                </div>
            </div>
            </div>
            </div>
            </div>
        </Modal>
    )
}

export default Cart