import React, { useState } from 'react';
import classes from './Card.module.scss' ;
import { FILES_BASE_API_URL } from '../lib/api'
import {Link} from 'react-router-dom' ;
import {getAuthToken} from '../utility/tokenLoader'
import { useSelector } from 'react-redux';
import imgHolder from '../assets/modelPlaceholder.png'

import { socket } from '../hooks/useSocket';
import UserChip from './ui/UserChip';

const Card = ({ category, categorySlug, title, desc, price, deliveryTime, cover, galleryImages, onAddProduct, starFrequency, totalStars, avgRating = 0, id, avatar, seller, userId = null, onRemoveProduct, cart = false, tags = [], sales = 0, views = 0, reviewCount = 0, isPrimary = false, isVerified = false, sellerUser = null, modality = null, featured = false, fda = false, version = '1.0.0' }) => {
    const [currentImageIdx, setCurrentImageIdx] = useState(0);

    let overAllRev = 0
    if (avgRating > 0) {
        overAllRev = avgRating;
    } else if (totalStars > 0 && starFrequency > 0) {
        overAllRev = totalStars / starFrequency
    }
    const token = getAuthToken() ;
    const authUser = useSelector(state => state.auth.userData) || {};
    const thisUserId = token ? authUser.id : null;
    const thisUserRole = token ? authUser.role : null;

    // Fallback logic for images
    let images = [];
    if (galleryImages && galleryImages.length > 0) {
        images = galleryImages.map(img => img.startsWith('http') ? img : FILES_BASE_API_URL + img);
    } else if (cover) {
        images = [FILES_BASE_API_URL + cover];
    }

    const hasMultipleImages = images.length > 1;

    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIdx((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length);
    };

    const currentImgSrc = images.length > 0 ? images[currentImageIdx] : imgHolder;
    const hoverImgSrc = images.length > 1 ? images[(currentImageIdx + 1) % images.length] : currentImgSrc;

    const chipUser = sellerUser || {
        avatar,
        org_username: seller,
        first_name: seller,
        isVerified,
    };

    return (
        <div className={classes["showcase"]}>
            <div className={classes["showcase-banner"]}>
                <Link to={`/models/view/${id}`} onClick={()=>{
                    return thisUserId?socket.emit("refreshModel", {to:thisUserId}):null
                }} className={classes["img-wrapper"]}>
                    <img src={currentImgSrc} alt={title} crossOrigin="anonymous" className={`${classes["product-img"]} ${classes.default}`}/>
                    <img src={hoverImgSrc} alt={title} crossOrigin="anonymous" className={`${classes["product-img"]} ${classes.hover}`}/>
                </Link>

                {hasMultipleImages && (
                    <>
                        <button onClick={prevImage} className={`${classes.carouselBtn} ${classes.carouselBtnLeft}`} type="button">
                            &#10094;
                        </button>
                        <button onClick={nextImage} className={`${classes.carouselBtn} ${classes.carouselBtnRight}`} type="button">
                            &#10095;
                        </button>
                        <div className={classes.carouselDots}>
                            {images.map((_, idx) => (
                                <div key={idx} className={`${classes.carouselDot} ${idx === currentImageIdx ? classes.carouselDotActive : ''}`} />
                            ))}
                        </div>
                    </>
                )}

                <div className={classes["badges-container"]}>
                    {category && (
                        categorySlug ? (
                            <Link to={`/models?categoryRel.slug=${encodeURIComponent(categorySlug)}`} className={`${classes["showcase-badge"]} ${classes.categoryBadge}`} onClick={(e) => e.stopPropagation()}>
                                {category}
                            </Link>
                        ) : (
                            <span className={`${classes["showcase-badge"]} ${classes.categoryBadge}`}>{category}</span>
                        )
                    )}
                    {isPrimary && <p className={`${classes["showcase-badge"]} ${classes.primaryBadge}`}>Primary</p>}
                    {fda === true && <p className={`${classes["showcase-badge"]} ${classes.fdaBadge}`}>FDA Cleared</p>}
                    {featured === true && <p className={`${classes["showcase-badge"]} ${classes.featuredBadge}`}>Featured</p>}
                    <span className={`${classes["showcase-badge"]} ${classes.versionBadge}`}>v{version}</span>
                </div>

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
                        <Link className={classes["btn-action"]} to={`/models/view/${id}`} onClick={()=>{ return thisUserId?socket.emit("refreshModel", {to:thisUserId}):null}}>
                            <ion-icon name="eye-outline" ></ion-icon>
                        </Link>
                    </>}
                </div>
            </div>
            
            <div className={classes["showcase-content"]}>

                <Link to={`/models/view/${id}`} onClick={()=>{return thisUserId?socket.emit("refreshModel", {to:thisUserId}):null}} className={classes["showcase-title"]}>
                    {title}
                </Link>

                <div className={classes["seller-strip"]}>
                    <UserChip user={chipUser} showVerified linkTo={userId ? `/profile/${userId}` : null} />
                </div>

                <div className={classes["rating-area"]}>
                    {overAllRev === 0 && <span className={classes["rateFlag"]}>No Ratings Yet</span>}
                    {overAllRev > 0 && (
                        <div className={classes["showcase-rating"]}>
                            <ion-icon name={`${overAllRev < 1 ? 'star-outline' : 'star'}`}></ion-icon>
                            <ion-icon name={`${overAllRev < 2 ? 'star-outline' : 'star'}`}></ion-icon>
                            <ion-icon name={`${overAllRev < 3 ? 'star-outline' : 'star'}`}></ion-icon>
                            <ion-icon name={`${overAllRev < 4 ? 'star-outline' : 'star'}`}></ion-icon>
                            <ion-icon name={`${overAllRev < 5 ? 'star-outline' : 'star'}`}></ion-icon>
                            <span className={classes.reviewCount}>({reviewCount})</span>
                        </div>
                    )}
                </div>

                {(modality || tags?.length > 0) && (
                    <div className={classes.tagList}>
                        {modality && (
                            <span className={classes.tag} title="Modality">{modality}</span>
                        )}
                        {tags?.slice(0, 2).map((tag, i) => (
                            <Link key={i} to={`/models?tags=${encodeURIComponent(tag)}`} onClick={(e) => e.stopPropagation()} className={classes.tag}>
                                {tag}
                            </Link>
                        ))}
                        {tags?.length > 2 && (
                            <span className={classes.tagLimit} title={tags.slice(2).join(', ')}>
                                +{tags.length - 2}
                            </span>
                        )}
                    </div>
                )}

                <p className={classes["showcase-desc"]}>
                    {desc?.length > 90 ? desc.slice(0, 90) + '...' : desc}
                </p>

                <div className={classes["footer-row"]}>
                    <div className={classes["analytics"]}>
                        <span>{sales} Sales</span>
                        <span>•</span>
                        <span>{views ?? 0} Views</span>
                        <span>•</span>
                        <span>{deliveryTime}d</span>
                    </div>
                    <div className={classes["price-area"]}>
                        <span className={classes["price"]}>${price}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card;
