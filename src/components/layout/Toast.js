/* eslint-disable react/prop-types */
import { RiRobot2Line } from "react-icons/ri";
import classes from './Toast.module.scss' ;


function Toast({close , status , title , message , onAnimationEnd}) {
    let color;
    if(status === 'error'||status === 'fail'){
        color = 'var(--color-danger)';
    }else {
        color = 'var(--color-success)';
    }
    //-------------------
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //----------------------------
    return (
        <div className={classes["notification-toast"]} data-toast  onAnimationEnd={onAnimationEnd}>
            <button className={classes["toast-close-btn"]} onClick={close}>
                <ion-icon name="close-outline"></ion-icon>
            </button>
            <div className={classes["toast-banner"]} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RiRobot2Line style={{ fontSize: '40px', color: color }} />
            </div>
            <div className={classes["toast-detail"]}>
                <h3 className={classes["toast-message"]}>
                    {message}
                </h3>
                <p className={classes["toast-title"]}>
                    {title}
                </p>
                <p className={classes["toast-meta"]}>
                    <time dateTime="PT2M"> {time}</time>
                </p>
            </div>
        </div>
    )
}

export default Toast