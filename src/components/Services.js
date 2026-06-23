import React from 'react';
import classes from './Services.module.scss';
import Card from './Card';
import ModelCardSkeleton from './ModelCardSkeleton';
import BottomFeaturesBox from './layout/BottomFeaturesBox';
import { cartActions } from '../store/Cart-slice';
import { useDispatch } from 'react-redux';
import { getModelMarketingFields } from '../lib/modelHelpers';

function Services({
    models,
    title,
    isLoading = false,
    pagination,
    onPageChange,
    onPageNext,
    onPagePrevious,
}) {
    const dispatch = useDispatch();
    const onAddProduct = (id) => {
        const item = models.find((item) => item.id === id);
        if (item) {
            dispatch(cartActions.addToCart({ model: item }));
        }
    };

    return (
        <div className={`${classes["container"]}`}>
            <h2 className={classes["title"]}>{title}</h2>
            <div className={classes["room__grid"]}>
                {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <ModelCardSkeleton key={i} />
                    ))
                    : models.map((ele, i) => {
                        const m = getModelMarketingFields(ele);
                        return (
                            <Card
                                sellerUser={ele?.developer}
                                key={i}
                                id={ele.id}
                                category={m.category}
                                categorySlug={m.categorySlug}
                                title={m.title}
                                desc={m.desc}
                                price={m.price}
                                deliveryTime={m.deliveryTime}
                                cover={ele.cover || ele.galleryImages?.[0]}
                                galleryImages={ele.galleryImages}
                                starFrequency={ele.starFrequency}
                                totalStars={ele.totalStars}
                                sales={m.sales}
                                views={ele.views ?? 0}
                                reviewCount={m.reviewCount}
                                tags={m.tags}
                                modality={m.modality}
                                isPrimary={m.isPrimary}
                                featured={ele?.featured === true}
                                fda={m.fda}
                                version={m.version}
                                features={m.features}
                                metrics={m.metrics}
                                onAddProduct={onAddProduct?.bind(null, ele.id)}
                                userId={ele?.developer?.id}
                            />
                        );
                    })}
            </div>
            {!isLoading && pagination?.total_pages > 0 && (
                <BottomFeaturesBox
                    pagination={pagination}
                    handlePageNumberChange={onPageChange}
                    handlePageNext={onPageNext}
                    handlePagePrevious={onPagePrevious}
                    mainSite
                    footerMsg="Models on this page:"
                />
            )}
        </div>
    );
}

export default Services;
