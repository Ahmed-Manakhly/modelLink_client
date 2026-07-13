/* eslint-disable react/prop-types */
import classes from './Video.module.scss' ;
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import aix_v from '../assets/aix_v.mp4';
import videoPosterDesktop from '../assets/video_poster_desktop.png';
import videoPosterMobile from '../assets/video_poster_mobile.png';
import headerClasses from './layout/Header.module.scss';
import GlobalWrapper from './layout/GlobalWrapper';

function Video() {
    const [poster, setPoster] = useState(videoPosterDesktop);
    const [aspectRatio, setAspectRatio] = useState('21/9');

    useEffect(() => {
        const updatePoster = () => {
            if (window.innerWidth <= 768) {
                setPoster(videoPosterMobile);
                setAspectRatio('16/9');
            } else {
                setPoster(videoPosterDesktop);
                setAspectRatio('21/9');
            }
        };
        updatePoster();
        window.addEventListener('resize', updatePoster);
        return () => window.removeEventListener('resize', updatePoster);
    }, []);

    return (
        <GlobalWrapper className="global-section-spacing">
            <div className={headerClasses["hero-container"]} style={{flexDirection: 'column', padding: '40px', alignItems: 'flex-start'}}>
                <h1 className={headerClasses["banner-title"]} style={{textAlign: 'left', marginBottom: '30px'}}>
                    Ready to explore? <br/>
                    <span className={headerClasses["gradientText"]}>Dive into ModelLink!</span>
                </h1>
                <div className={`${classes["container_1"]} `} style={{width: '100%', margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                    <video  controls poster={poster} src={aix_v} style={{width: '100%', aspectRatio: aspectRatio, objectFit: 'cover', borderRadius: 'var(--radius-card)', marginBottom: '30px'}}></video>
                    <Link to="/models" className="btn-glass-primary" style={{display: 'inline-block', fontSize: '18px', padding: '12px 30px'}}>
                        Explore All Models
                    </Link>
                </div>
            </div>
        </GlobalWrapper>
    )
}

export default Video
//autoPlay loop muted
//poster={poster}
