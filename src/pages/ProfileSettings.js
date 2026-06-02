/* eslint-disable */
import BoxWidgets from '../components/BoxWidgets' ;
import FormProfile from '../components/FormProfile' ;
import Val from '../components/Val'
import {vals} from '../data' ;
import {UPDATE_MY_PROFILE_URL} from '../lib/api'
import axios from 'axios'
import {useDispatch} from 'react-redux'; 
import {uiActions} from '../store/UI-slice' ;
import {useState} from 'react' ;
import {useNavigate } from 'react-router-dom';
import {authActions} from '../store/Auth.-slice' ;
import {getAuthToken} from '../utility/tokenLoader'


function ProfileSettings() {
    const token = getAuthToken() ;
    const navigate = useNavigate();
    const dispatch = useDispatch();  
    const [file,setFile] = useState() ;
    const [isChanged, setIsChanged] = useState(false);
    const user_Data =  JSON.parse(localStorage.getItem('userData'));
    const id =  JSON.parse(localStorage.getItem('userData')).id;
    let avatar = null
    if (user_Data?.avatar){
        avatar = user_Data.avatar;
    }

    const HandelFileChange = (file)=>{
        setFile(file)
        setIsChanged(true)
    }
    //==============================================
    const onUpdateProfileAction =(file=null,authData=null)=>{

        let toast = {status :'', title :'', message:''}
        if(!file && !avatar){
            toast = {status :'error',message:'Please Select a cover Image',title:'Updating Information failed'};
            dispatch(uiActions.notificationDataChanged(toast))
            dispatch(uiActions.showNotification(true))
            return;
        }
        async function updateProfileAction (actions ,toastHandler , loadingState ) {
            loadingState(true)
            //---------------------------------------------
                const formdata = new FormData();
                if (file) formdata.append('avatar', file);
                if (authData) formdata.append('data', JSON.stringify(authData));
                const config = {
                    headers: {
                    'Content-Type': 'multipart/form-data', // Use 'multipart/form-data' for FormData
                    'Authorization': `Bearer ${token}`,
                    }
                };
                try{
                    const response = await axios.patch(UPDATE_MY_PROFILE_URL, formdata , config);
                    const resData =  response.data ;
                    loadingState(false)
                    const token =  localStorage.getItem('token') ;
                    const userData = {...resData.data.updatedUser , token}
                    actions(userData)
                    localStorage.setItem('userData' , JSON.stringify(userData)) ;
                    toast= {status :resData.status,message:resData.message || "Your Informations has been Updated",title:'Update Informations'}
                    toastHandler(toast);
                }catch(err){
                    loadingState(false)
                    toast = {status :'error',message:err.response.data.message,title:'Updating Information failed'};
                    toastHandler(toast);
                }
        } 
        const toastHandler =(toast)=>{
            dispatch(uiActions.notificationDataChanged(toast))
            dispatch(uiActions.showNotification(true))
        } 
        const actions =(data)=>{
            dispatch(authActions.onLogin(data))
        }
        const loadingState = (state)=>{
            dispatch(uiActions.showLoading(state))
        }
        updateProfileAction(actions ,toastHandler , loadingState )
        dispatch(uiActions.showNotification(false))
        navigate(`/`,{replace :false});
    }
    //==============================================
    return (
        <>
            <BoxWidgets  profile={true} HandelFileChange={HandelFileChange} file={file} />
            <FormProfile  onUpdateProfileAction={onUpdateProfileAction.bind(null,file?file:null)} isChanged={isChanged} />
            <Val products={vals} title={'A huge collection of medical AI solutions at your fingertips'} />
        </>
    )
}

export default ProfileSettings