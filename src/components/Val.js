/* eslint-disable react/prop-types */
import classes from './Val.module.scss';




const Card = ({title , description , img})=>{
    return (

        <div className={classes["room__card"]}>
            <div className={classes["room__card__image"]}>
                <img src={img} alt="product"/>
            </div>
            <div className={classes["room__card__details"]}>
                <h4>{title}</h4>
                <p>{description}</p>
            </div>
        </div>

    )
}

function Val({products , title }) {
    return (
        <div className={`${classes["container"]}`}>
            <h2 className={classes["title"]}>{title}</h2>
            <div className={classes["room__grid"]}>
                {products.map((ele,i)=>{
                    return((<Card  key={i} title={ele.title} img={ele.img} description={ele.description}/>))
                })}
            </div>
        </div>
    )
}

export default Val