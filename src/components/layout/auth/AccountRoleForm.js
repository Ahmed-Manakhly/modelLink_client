import { Link  } from 'react-router-dom';
import classes from './Auth.module.scss' ;
//-----------------------------------------
const AccountRoleForm = ( ) => {
    return (
        < div className={`${classes['form-btn-con']}`}> 
            <div>
                <button type="button" className={`d-flex flex-column align-items-left w-100`} >
                    <Link className={`${classes['form-btn']} d-flex flex-column align-items-left w-100`} to={'?role=developer&step=1'}>{ 'I\'m A Developer'} </Link >
                </button>
            </div>
            <div >
                <button type="button" className={`d-flex flex-column align-items-left w-100`} >
                    <Link className={`${classes['form-btn']} d-flex flex-column align-items-left w-100`} to={'?role=client&step=1'}>{ 'I\'m A Client'} </Link >
                </button>
            </div>
        </div>
    )
}
export default AccountRoleForm
