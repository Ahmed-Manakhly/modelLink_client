import Header from '../components/layout/Header' ;
import Categories from '../components/Categories' ;
import Val from '../components/Val'
import {vals} from '../data' ;
import banner from '../assets/banner_3.png'
import {useDispatch} from 'react-redux'; 
import {uiActions} from '../store/UI-slice' ;
import {getAuthToken} from '../utility/tokenLoader'
import {useEffect} from 'react' ;
import {useNavigate } from 'react-router-dom';
import FormActions from '../components/FormActions'
import { useSelector } from 'react-redux'; 
import {ALL_MODELS_URL} from '../lib/api'
import axios from 'axios'
import io from "socket.io-client";
import {origin} from '../lib/api'




function CreateModel() {
    const navigate = useNavigate();
    const token = getAuthToken() ;
    const authority = token? JSON.parse(localStorage.getItem('userData')).role === "DEVELOPER": false
    const userData = useSelector(state => state.auth.userData) ;
    const {rule_id , target_id , module_id} = userData;
    const PROFILE_COMPLETED = (rule_id!==0&&target_id!==0 && module_id!==0)
    const dispatch = useDispatch();  
    //=============================================================================
    useEffect(() => {
        if(!token && !authority){
            let toast = {status :'error',message:'you have no access for this!',title:'Access Denied'};
            dispatch(uiActions.notificationDataChanged(toast))
            dispatch(uiActions.showNotification(true))
            navigate("/",{replace :true});
            return ;
        }
    },[authority,token ,dispatch ,navigate ])
    //==========================================================================================
    useEffect(() => {
        if(!PROFILE_COMPLETED){
            let toast = {status :'error',message:'it seems like you have important profile settings missing!',title:'Complete Your Profile'};
            dispatch(uiActions.notificationDataChanged(toast))
            dispatch(uiActions.showNotification(true))
            navigate(`/profileSettings`,{replace :true});
            return ;
        }
    },[PROFILE_COMPLETED , dispatch , navigate])
    //==========================================================================================

        const onCreatingModelAction =(file,modelData)=>{
            const socket = io(origin);
            async function creatingModelAction (toastHandler , loadingState ) {
                let toast = {status :'', title :'', message:''}
                loadingState(true)
                    const formdata = new FormData();
                    if (file) formdata.append('cover',file);
                    if (modelData) {
                        formdata.append('data', JSON.stringify(modelData));
                    }
                    try{
                        const response = await axios.post(ALL_MODELS_URL, formdata);
                        const resData =  response.data ;
                        loadingState(false)
                        toast= {status :resData.status,message:'Model has been created',title:'Creating Model'}
                        socket.emit("new_model");
                        toastHandler(toast);
                    }catch(err){
                        loadingState(false)
                        toast = {status :'error',message:err.response.data.message,title:'Creating Model failed'};
                        toastHandler(toast);
                    }
            } 
            const toastHandler =(toast)=>{
                dispatch(uiActions.notificationDataChanged(toast))
                dispatch(uiActions.showNotification(true))
            } 
            const loadingState = (state)=>{
                dispatch(uiActions.showLoading(state))
            }
    
            creatingModelAction(toastHandler , loadingState )
            dispatch(uiActions.showNotification(false))
            navigate(`/dashboard-dev`,{replace :false});
        }
    //==========================================================================================
    return (
        <>
            <Header 
                txt_1='The AiExchange'
                txt_2=' Be part of something bigger'
                txt_3=' Share your insights, Together, we’re shaping the future of AI in healthcare.'
                banner={banner}
            />
            <Categories/>
            <FormActions  formTitle={'Create a New Model'} onCreatingModelAction={onCreatingModelAction}/>
            <Val products={vals} title={'A huge collection of medical AI solutions at your fingertips'} />
        </>
    )
}

export default CreateModel