import classes from './Val.module.scss';
import GlobalWrapper from './layout/GlobalWrapper';
import headerClasses from './layout/Header.module.scss';




const Card = ({ title, description, img, index }) => {
    const cardClass = index % 2 !== 0
        ? `${classes["room__card"]} ${classes["room__card--blended"]}`
        : classes["room__card"];

    return (

        <div className={cardClass}>
            <div className={classes["room__card__image"]}>
                <img src={img} alt="product" />
            </div>
            <div className={classes["room__card__details"]}>
                <h4>{title}</h4>
                <p>{description}</p>
            </div>
        </div>

    )
}

function Val({ products, title }) {
    return (
        <GlobalWrapper className="global-section-spacing">
            {title && (
                <h1 className={headerClasses["banner-title"]} style={{ textAlign: 'left', marginBottom: '40px' }}>
                    <span className={headerClasses["gradientText"]}>{title}</span>
                </h1>
            )}
            <div className={classes["room__grid"]}>
                {products.map((ele, i) => {
                    return ((<Card key={i} index={i} title={ele.title} img={ele.img} description={ele.description} />))
                })}
            </div>
        </GlobalWrapper>
    )
}

export default Val