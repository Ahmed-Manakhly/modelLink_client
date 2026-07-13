
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import UserProfileStrip from './UserProfileStrip';
import GlobalWrapper from './layout/GlobalWrapper';
import cardClasses from './Card.module.scss';

function TopDevelopersSlider({ developers, title }) {
    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 4 },
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
    };
    
    if (!developers || developers.length === 0) return null;

    return (
        <GlobalWrapper className="global-section-spacing">
            <div>
            <h2 className="global-section-title">{title ? title : 'Top AI Developers'}</h2>
            <Carousel responsive={responsive} showDots infinite autoPlay autoPlaySpeed={3000} keyBoardControl swipeable draggable itemClass="global-carousel-item">
                {developers.map((dev, i) => (
                    <div key={dev.id || i} className={cardClasses.showcase} style={{ padding: '25px 20px', height: '100%', cursor: 'pointer' }} onClick={() => window.location.href = `/profile/${dev.id}`}>
                        <UserProfileStrip 
                            user={dev} 
                            variant="public" 
                            showViewProfileLink={true} 
                            profileLinkTo={`/profile/${dev.id}`}
                        />
                    </div>
                ))}
            </Carousel>
            </div>
        </GlobalWrapper>
    );
}
export default TopDevelopersSlider;
