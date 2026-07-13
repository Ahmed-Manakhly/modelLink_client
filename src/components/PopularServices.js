/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import GlobalWrapper from './layout/GlobalWrapper';
import {cartActions} from '../store/Cart-slice' ;
import {useDispatch} from 'react-redux';
import Card from './Card' ;
import { getModelMarketingFields } from '../lib/modelHelpers';
//------------------
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

function PopularServices({ models, title, viewAllLink }) {
    const dispatch = useDispatch();
    const onAddProduct =(id, versionId)=> {
        const item = models.find((item)=>item.id === id)
        if (item) {
            dispatch(cartActions.addToCart({ model: item, versionId }))
        }
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
    <GlobalWrapper className="global-section-spacing">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <h2 className="global-section-title">{`${title ? title : 'Popular Services!'}`}</h2>
            {viewAllLink && (
                <Link to={viewAllLink} className="btn-glass-outline">
                    View all
                </Link>
            )}
        </div>
        <Carousel responsive={responsive} showDots infinite autoPlay autoPlaySpeed={2500} keyBoardControl swipeable
            draggable itemClass="global-carousel-item">
            {models.map((ele,i)=>{
                const m = getModelMarketingFields(ele);
                return(
                <Card
                sellerUser={ele?.developer}
                key={i}
                id={ele?.id}
                category={m.category}
                categorySlug={m.categorySlug}
                title={m.title}
                desc={m.desc}
                price={m.price}
                deliveryTime={m.deliveryTime}
                cover={ele?.cover || ele?.galleryImages?.[0]}
                galleryImages={ele?.galleryImages}
                starFrequency={ele?.starFrequency}
                totalStars={ele?.totalStars}
                avgRating={ele?.avgRating}
                sales={m.sales}
                views={ele?.views ?? 0}
                reviewCount={m.reviewCount}
                tags={m.tags}
                modality={m.modality}
                isPrimary={m.isPrimary}
                featured={ele?.featured === true}
                onAddProduct={() => onAddProduct(ele?.id)}
                userId={ele?.developer?.id}
                />
            )})}
        </Carousel>
    </GlobalWrapper>
    )
}

export default PopularServices
