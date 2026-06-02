/* eslint-disable react/prop-types */
import classes from './Services.module.scss';
import Card from './Card' ;
import {cartActions} from '../store/Cart-slice' ;
import {useDispatch} from 'react-redux'; 





function Services({models , title ,noNext,onGoNext,page,pages,noPrev,onGoPrev}) {
    const dispatch = useDispatch();   
    const onAddProduct =(id)=> {
        const item = models.find((item)=>item.id === id)
        dispatch(cartActions.addToCart(item))
    }
    return (
        <div className={`${classes["container"]}`}>
            <h2 className={classes["title"]}>{title}</h2>
            <div className={classes["room__grid"]}>
            {models.map((ele,i)=>{
                return(
                <Card 
                seller={ele?.User?.first_name ? ele?.User?.first_name :ele?.User?.org_username}
                avatar={ele?.User?.avatar}
                key={i}
                id={ele.id}
                category ={ele.category}
                title ={ele.title}
                desc ={ele.desc}
                price ={ele.price}
                deliveryTime ={ele.deliveryTime} 
                cover ={ele.cover} 
                starFrequency ={ele.starFrequency}
                totalStars ={ele.totalStars}
                onAddProduct={onAddProduct.bind(null,ele.id)}
                userId={ele.userId}
                />
            )})}
            </div>
            <div className={classes["pages"]}>
                <button disabled={noPrev} onClick={onGoPrev} >Previous Page</button>
                <span>{`Page ${page}/${pages}`}</span>
                <button disabled={noNext} onClick={onGoNext}>Next Page</button>
            </div>
        </div>
    )
}

export default Services