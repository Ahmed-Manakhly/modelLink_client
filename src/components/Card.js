import classes from './Card.module.scss' ;
import { BASE_URL, FILES_BASE_API_URL } from '../lib/api' 
import {Link} from 'react-router-dom' ;
import {getAuthToken} from '../utility/tokenLoader'
import imgHolder from '../assets/imgHolder.jpg'


//reloadDocument

import io from "socket.io-client";
const socket = io(BASE_URL);


const Card =({category,title, desc, price, deliveryTime , cover , onAddProduct,starFrequency,totalStars ,id ,avatar,seller , userId ,onRemoveProduct , cart=false})=> {
    let overAllRev = 0
    if(totalStars > 0 && starFrequency >0 ){
        overAllRev = totalStars / starFrequency
    }
    const token = getAuthToken() ;
    const thisUserId  = token? JSON.parse(localStorage.getItem('userData')).id  : null
    const thisUserRole  = token? JSON.parse(localStorage.getItem('userData')).role  : null
    return (
        <div className={classes["showcase"]}>
            <div className={classes["showcase-banner"]} >
                <Link to={`/models/view/${id}`}   onClick={()=>{
                    return thisUserId?socket.emit("refreshModel", {to:thisUserId}):null
                }} >
                    {cover && <img src={FILES_BASE_API_URL+cover} alt={title}  crossOrigin="anonymous"  width="300" className={`${classes["product-img"]} ${classes.default}`}/>}
                    {cover && <img src={FILES_BASE_API_URL+cover}  alt={title}  crossOrigin="anonymous"  width="300" className={`${classes["product-img"]} ${classes.hover}`}/>}
                    {!cover && <img src={imgHolder} alt={title} crossOrigin="anonymous" width="300" className={`${classes["product-img"]} ${classes.default}`}/>}
                    {!cover && <img src={imgHolder} alt={title} crossOrigin="anonymous" width="300" className={`${classes["product-img"]} ${classes.hover}`}/>}
                </Link>
                <p className={classes["showcase-badge"]}>{category}</p>
                <div className={classes["showcase-actions"]}>
                    {token &&
                    <> 
                        {
                        thisUserRole==='CLIENT' &&
                        <>
                            {!cart && <Link to={'/'}className={classes["btn-action"]} onClick={onAddProduct} >
                                <ion-icon name="heart-outline"></ion-icon>
                            </Link>}
                            {cart && <Link to={'/cart'}className={classes["btn-action"]} onClick={onRemoveProduct} >
                                <ion-icon name="trash-outline"></ion-icon>
                            </Link>}
                        </>
                        }                     
                        <Link className={classes["btn-action"]} to={`/models/view/${id}`}  onClick={()=>{ return thisUserId?socket.emit("refreshModel", {to:thisUserId}):null}}>
                            <ion-icon name="eye-outline" ></ion-icon>
                        </Link>
                    </>}
                </div>
            </div>
            <div className={classes["showcase-content"]}>
                <div className={classes["user-card"]}>
                    <div className={` ${classes.imgCon_1}`} >
                        <Link to={`/profile/${userId}`}  className={` ${classes.imgCon}`} >
                            {avatar &&<img src={FILES_BASE_API_URL+avatar} alt="Model Cover" crossOrigin="anonymous"  />}
                            {!avatar &&  <div className={classes['UserHolder']} >{seller&&seller[0]?.toUpperCase()}</div>}
                        </Link>
                    </div>
                    <div className={` ${classes.infoPart}`} >
                        <Link to={`/profile/${userId}`}  className={classes["info-box"]}>
                            {seller && <h4>{seller?.toUpperCase()?.slice(0, 9)}</h4>}
                        </Link>
                        {overAllRev === 0 && <span className={classes["rateFlag"]}>No Rateing Yet!</span>}
                        {overAllRev > 0 &&                        
                        <div className={classes["showcase-rating"]}>
                            <ion-icon name={`${overAllRev<1?'star-outline':'star'}`}></ion-icon>
                            <ion-icon name={`${overAllRev<2?'star-outline':'star'}`}></ion-icon>
                            <ion-icon name={`${overAllRev<3?'star-outline':'star'}`}></ion-icon>
                            <ion-icon name={`${overAllRev<4?'star-outline':'star'}`}></ion-icon>
                            <ion-icon name={`${overAllRev<5?'star-outline':'star'}`}></ion-icon>
                        </div>
                        }
                    </div>
                </div>
                <Link to={`/models/view/${id}`} onClick={()=>{return thisUserId?socket.emit("refreshModel", {to:thisUserId}):null}} className={classes["showcase-category"]}>{title}</Link>
                <h3 className={classes["showcase-title"]}>{desc}</h3>
                <div className={classes["info-box"]}>                    
                        <p>${price}</p>
                        <h6>Delivery time :{deliveryTime} Day(s)</h6>
                </div>
            </div>
        </div>
    )
}


export default Card;