import classes from './ToggleSwitch.module.scss' ;
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCheck ,faXmark } from '@fortawesome/free-solid-svg-icons'

// import { FaToggleOff } from "react-icons/fa";
// import { FaToggleOn } from "react-icons/fa";

const ToggleSwitch = props => {

    return (
        <label className={classes.ToggleSwitch} htmlFor={props.id}>
            <input type={props.type} value={props.value} id={props.id} onChange={props.onChange} disabled={props.disabled} checked={props.checked} name={props.name}  className={classes.switch} />
            {props.title}
            <div >
                <span className={classes.circle}>
                    {/* <div className={classes.off} ></div>
                    <div className={classes.on}></div> */}
                    {/* <FaToggleOff className={classes.off_}/>
                    <FaToggleOn  className={classes.on}/> */}
                </span>
            </div>
        </label>
    )
} ;


export default ToggleSwitch ;