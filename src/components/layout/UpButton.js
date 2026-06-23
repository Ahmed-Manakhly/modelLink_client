/* eslint-disable react/prop-types */
import classes from './UpButton.module.scss'


function UpButton({scroll}) {
    const goUpHandler = ()=> {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }
    return (
        <button className={` ${scroll && classes.show} ${classes.up} btn__ `} onClick={goUpHandler}>
            To Top
        </button>
    )
}

export default UpButton
