import classes from './PopularServices.module.scss' ;
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import UserProfileStrip from './UserProfileStrip';

function TopDevelopersSlider({ developers, title }) {
    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 4 },
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
    };
    
    if (!developers || developers.length === 0) return null;

    return (
        <div className={classes.container} style={{marginTop: '20px', marginBottom: '20px'}}>
            <h2 className={classes["title"]}>{title ? title : 'Top AI Developers'}</h2>
            <Carousel responsive={responsive} showDots infinite autoPlay autoPlaySpeed={3000} keyBoardControl swipeable draggable>
                {developers.map((dev, i) => (
                    <div key={dev.id || i} style={{ padding: '10px 15px', height: '100%' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.03) 0%, rgba(34, 211, 238, 0.06) 100%)', 
                            backdropFilter: 'blur(12px)',
                            borderRadius: '15px', 
                            padding: '20px 10px', 
                            boxShadow: 'var(--glass-shadow)',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            border: '1px solid rgba(34, 211, 238, 0.1)',
                            transition: 'var(--transition-smooth)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 15px rgba(34, 211, 238, 0.15)';
                            e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.3)';
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 211, 238, 0.08) 0%, rgba(34, 211, 238, 0.03) 100%)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
                            e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.1)';
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 211, 238, 0.03) 0%, rgba(34, 211, 238, 0.06) 100%)';
                        }}
                        >
                            <UserProfileStrip 
                                user={dev} 
                                variant="public" 
                                showViewProfileLink={true} 
                                profileLinkTo={`/profile/${dev.id}`}
                            />
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}
export default TopDevelopersSlider;
