/* eslint-disable react/prop-types */
import {cartActions} from '../store/Cart-slice' ;
import {useDispatch} from 'react-redux'; 
import Card from './Card' ;
import classes from './PopularServices.module.scss' ;
//------------------
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

function PopularServices({models , title}) {
    const dispatch = useDispatch();   
    const onAddProduct =(id)=> {
        const item = models.find((item)=>item.id === id)
        dispatch(cartActions.addToCart(item))
    }
    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 4
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };
    return (

    <div className={classes.container}>
        <h2 className={classes["title"]}>{`${title?title:'Popular Services!'}`}</h2>
        <Carousel responsive={responsive} showDots infinite autoPlay autoPlaySpeed={2500}  keyBoardControl swipeable  
            draggable   >
            {models.map((ele,i)=>{return(
                <Card 
                seller={ele?.userData?.first_name ? ele?.userData?.first_name :ele?.userData?.org_username}
                avatar={ele?.userData?.avatar}
                key={i}
                category ={ele?.category}
                title ={ele?.title}
                id={ele?.id}
                desc ={ele?.desc}
                price ={ele?.price}
                deliveryTime ={ele?.deliveryTime} 
                cover ={ele?.cover} 
                starFrequency ={ele?.starFrequency}
                totalStars ={ele?.totalStars}
                onAddProduct={onAddProduct.bind(null,ele?.id)}
                userId={ele.userId}
                />
            )})}
        </Carousel>
    </div>
    )
}

export default PopularServices

