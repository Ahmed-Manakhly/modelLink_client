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
                            background: '#fff', 
                            borderRadius: '15px', 
                            padding: '20px 10px', 
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            border: '1px solid #eaeaea'
                        }}>
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
