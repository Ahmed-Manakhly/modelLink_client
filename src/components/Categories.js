/* eslint-disable react/prop-types */
import classes from './Categories.module.scss';
import { Link } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useEffect, useState } from 'react';
import GlobalWrapper from './layout/GlobalWrapper';
import { getCategoriesReq } from '../lib/loaders';
import { mapParentCategoriesToHomeCards } from '../lib/categoryHelpers';

const ParentCard = ({ title, slug, img }) => (
    <Link to={`/models?categoryParentSlug=${encodeURIComponent(slug)}`} className={classes['category-item']}>
        <div className={classes['category-content-box']}>
            <div className={classes['category-content-flex']}>
                <h3 className={classes['category-item-title']}>{title}</h3>
            </div>
            <span className={classes['category-btn']}>
                Browse all {title} models
            </span>
        </div>
        <div className={classes['category-img-box']}>
            <img src={img} alt={title} width="30" />
        </div>
    </Link>
);

function Categories({ categoryCards }) {
    const [parents, setParents] = useState([]);

    useEffect(() => {
        if (categoryCards?.length) {
            setParents(categoryCards);
            return;
        }

        getCategoriesReq('?parentId=null&limit=100')
            .then((res) => {
                const cats = res.data?.data?.categories || [];
                setParents(mapParentCategoriesToHomeCards(cats));
            })
            .catch((err) => console.error('Failed to load home categories:', err));
    }, [categoryCards]);

    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 4 },
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
    };

    return (
        <GlobalWrapper className="global-section-spacing">
            <h2 className="global-section-title">Models Categories</h2>
            <Carousel responsive={responsive} showDots infinite keyBoardControl swipeable draggable className="filters" itemClass="global-carousel-item">
                {parents.map((item, index) => (
                    <ParentCard
                        key={item.slug || index}
                        title={item.title}
                        slug={item.slug}
                        img={item.img}

                    />
                ))}
            </Carousel>
        </GlobalWrapper>
    );
}

export default Categories;
