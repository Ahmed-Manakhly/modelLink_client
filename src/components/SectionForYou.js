import {Link} from 'react-router-dom'
import classes from './SectionForYou.module.scss' ;
import img from '../assets/instructor-1x-v3.jpg'


function SectionForYou() {
    return (
        <section className={classes["container"]} >
            <div className={classes['teamwork']}>
                <h1>join us.</h1>
                <div className={classes["teamwork-container"]}>
                    <div className={classes["container-left"]}>
                    <img src={img} alt="sec-image" />
                    </div>
                    <div className={classes["container-right"]}>
                        <h3 >it's your time</h3>
                        <p>find a real opportunity for your AI model </p>
                        <Link to={"/products"} className={classes["banner-btn"]} > {"Learn More"}</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SectionForYou