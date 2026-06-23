/* eslint-disable react/prop-types */
import error_img from '../../assets/ERROR.png' ;
import success_img from '../../assets/success.png' ;
import classes from './Toast.module.scss' ;


function Toast({close , status , title , message , onAnimationEnd}) {
    let img ;
    if(status === 'error'||status === 'fail'){
        img = error_img
    }else {
        img = success_img
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
            <div className={classes["toast-banner"]}>
                <img src={img} alt="robotics" width="80" height="70"/>
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