/* eslint-disable */
import Header from '../components/layout/Header' ;
import Categories from '../components/Categories' ;
import Val from '../components/Val'
import {vals} from '../data' ;
import banner from '../assets/banner_4.png'
import {useParams}  from "react-router-dom";
import {useDispatch} from 'react-redux'; 
import {uiActions} from '../store/UI-slice' ;
import {getAuthToken} from '../utility/tokenLoader'
import {useEffect , useState} from 'react' ;
import {useNavigate } from 'react-router-dom';
import FormActions from '../components/FormActions'
import { getData, getModelByIdReq } from '../lib/loaders';
import { updateModelReq } from '../lib/modelRequests';
import io from "socket.io-client";
import { BASE_URL } from '../lib/api';




function EditModel() {
    const navigate = useNavigate();
    const token = getAuthToken() ;
    const authority = token? JSON.parse(localStorage.getItem('userData')).role === "DEVELOPER": false
    useEffect(() => {
        if(!token && !authority){
            let toast = {status :'error',message:'you have no access for this!',title:'Access Denied'};
            dispatch(uiActions.notificationDataChanged(toast))
            dispatch(uiActions.showNotification(true))
            navigate("/",{replace :true});
            return ;
        }
    },[authority,token])
    const dispatch = useDispatch();  
    const [model,setModel] = useState([]) ;
    const [subscriptionInit,setSubscriptionInit] = useState(true) ;
    const [payPerClickInit,setPayPerClickInit] = useState(false) ;
    const { id } = useParams();
    //------------------------------------------------
    useEffect(() => {

        const toastHandler =(toast)=>{
            dispatch(uiActions.notificationDataChanged(toast))
        } 
        const loadingState = (state)=>{
            dispatch(uiActions.showLoading(state))
        }
        const notificationState =(state)=>{
            dispatch(uiActions.showNotification(state))
        }
        const gettingData =(data)=>{
            setModel(data?data:null)
            setSubscriptionInit(data? (+data?.subscription === 1? true : false) : true)
            setPayPerClickInit(data? (+data?.payPerClick === 1? true : false) : false)
        }
        getData(() => getModelByIdReq(id), toastHandler , loadingState , notificationState , gettingData,'model!' )
        dispatch(uiActions.showNotification(false))
    },[])
    //------------------------------------------
    const onUpdatingModelAction =(file=null,modelData=null)=>{
        const socket = io(BASE_URL);
        async function creatingModelAction (toastHandler , loadingState ) {
            let toast = {status :'', title :'', message:''}
            loadingState(true)
            //---------------------------------------------
                const formdata = new FormData();
                if (file) formdata.append('cover',file);
                    if (modelData) {
                        formdata.append('data', JSON.stringify(modelData));
                    }
                try{
                    const response = await updateModelReq(id, formdata, token);
                    const resData =  response.data ;
                    loadingState(false)
                    toast= {status :resData.status,message:"Model has been updated",title:'Updating  Model'}
                    socket.emit("new_model");
                    toastHandler(toast);
                }catch(err){
                    loadingState(false)
                    toast = {status :'error',message:err.response.data.message,title:'Updating Model failed'};
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
    return (
        <>
            <Header 
                txt_1='The ModelLink'
                txt_2=' Getting New Ideas is always amazing'
                txt_3=' Share your insights, Together, we’re shaping the future of AI in healthcare.'
                banner={banner}
            />
            <Categories/>
            <FormActions  formTitle={'Modify Your Model'} thisModel={model} onCreatingModelAction={onUpdatingModelAction} subscriptionInit={subscriptionInit} payPerClickInit={payPerClickInit}/>
            <Val products={vals} title={'A huge collection of medical AI solutions at your fingertips'} />
        </>
    )
}

export default EditModel