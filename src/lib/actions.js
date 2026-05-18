import {LOGIN_URL} from './api' ;
import {SIGNUP_URL} from './api' ;
import {ALL_MODELS_URL} from './api' ;
import {authError} from '../utility/errorCodeMSG' ;

//------------------------------------------------------
export async function LoginAction (request , actions , toastHandler , loadingState ) {
    let toast = {status :'', title :'', message:''}
    //---------------------------------------------
    const searchParams = new URL(request.url).searchParams ;
    const mode = searchParams.get('mode') || null ;
    const role = searchParams.get('role') || null ; 
    //---------------------------------------------
    const data = await request.formData() ;
    //---------------------------------------------
    if(mode === 'login'){
        loadingState(true)
        const authData = {org_username : data.get('org_username') , password :  data.get('password')  } ;
        const response = await fetch(LOGIN_URL , {method : 'POST' , headers : {'Content-Type' : 'application/json'} , body : JSON.stringify(authData)});
        const resData = await response.json() ;
        if (!response.ok) {
            loadingState(false)
            toast = {status :'error',message:authError(response.status ),title:'Authentication failed'};
            toastHandler(toast);
        }else {
            loadingState(false)
            //------ store user data
            const token = resData.token ;
            const userData = {...resData.data.user , token}
            actions(userData);
            localStorage.setItem('token' , token) ;
            localStorage.setItem('userData' , JSON.stringify(userData)) ;
            //-----------------------------------
            const expiration = new Date();
            expiration.setMinutes(expiration.getMinutes()+40) ;
            localStorage.setItem('expiration' , expiration.toISOString()) ;
            toast= {status :'success',message:`Well Come Back ${userData.org_username}`,title:'logged in'}
            toastHandler(toast);
        }
        //------------------------------------
    }else if((mode !== 'forgotPassword')){
        loadingState(true)
        const authData = {
            email: data.get('email'),
            org_name: data.get('org_name'),
            org_username: data.get('email'),
            org_phone: data.get('org_phone'),
            password: data.get('password'),
            passwordConfirm: data.get('passwordConfirm'),
            country: data.get('country'),
            
            role: role === 'client'?'CLIENT':(role === 'developer' && 'DEVELOPER' ),
            org_desc: '',
            rule_id: 0,
            target_id:0,
            module_id:0
        }
        const response = await fetch(SIGNUP_URL, {method : 'POST' ,headers : {'Content-Type' : 'application/json'} ,body : JSON.stringify(authData)}) ;
        const resData = await response.json() ;
        //------------------------------------------------
        if (!response.ok) {
            loadingState(false)
            toast = {status :'error',message:authError(response.status ),title:'registration failed'};
            toastHandler(toast);
        }else {
            loadingState(false)
            //------ store user data
            const token = resData.token ;
            const userData = {...resData.data.user , token}
            actions(userData);
            localStorage.setItem('token' , token) ;
            localStorage.setItem('userData' , JSON.stringify(userData)) ;
            //-----------------------------------
            const expiration = new Date();
            expiration.setMinutes(expiration.getMinutes()+40) ;
            localStorage.setItem('expiration' , expiration.toISOString()) ;
            toast= {status :'success',message:`Welcome on board, We Have logged You In Now!`,title:'account is registered'}
            toastHandler(toast);
        }
    }
} 


//-------------------------------------------------------------------------

export async function deletingModelAction (request , toastHandler , loadingState,params ) {
    let toast = {status :'', title :'', message:''}
    loadingState(true)
    //---------------------------------------------
    if(params.id){
        const id = params.id 
        try{
            const response = await fetch(ALL_MODELS_URL+`/${id}`, {method : 'DELETE' }) ;
            const resData = await response.json() ;
            loadingState(false)
            toast= {status :resData.status,message:resData.message || "Model has been Deleted",title:'Delete Model'}
            toastHandler(toast);
        }catch(err){
            loadingState(false)
            toast = {status :'error',message:err.message,title:'Deleting Model failed'};
            toastHandler(toast);
        }
    }
} 


