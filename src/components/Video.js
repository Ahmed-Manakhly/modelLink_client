/* eslint-disable react/prop-types */
import classes from './Video.module.scss' ;
import aix_v from '../assets/aix_v.mp4';
import poster from '../assets/poster.png';


function Video() {
    return (
        <section className={`${classes["container"]} `}>
            <h2 className={classes["title"]}>Ready to explore? Dive into ModelLink!</h2>
            <div className={`${classes["container_1"]} `}>
                <video  controls poster={poster} src={aix_v} ></video>
                {/* section__container */}
            </div>
        </section>
    )
}

export default Video
//autoPlay loop muted
//poster={poster}
