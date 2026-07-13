/* eslint-disable react/prop-types */
import classes from './UpButton.module.scss'
import GlobalWrapper from './GlobalWrapper';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


function UpButton({scroll}) {
    const goUpHandler = ()=> {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }
    return (
        <div className={`${classes.up_container} ${scroll ? classes.show : ''}`}>
            <GlobalWrapper className={classes.up_inner}>
                <button className={`btn-glass-primary ${classes.up}`} onClick={goUpHandler} aria-label="To Top">
                    <KeyboardArrowUpIcon />
                </button>
            </GlobalWrapper>
        </div>
    )
}

export default UpButton
