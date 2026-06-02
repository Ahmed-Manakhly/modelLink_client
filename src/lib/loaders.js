export async function getModel(url ,toastHandler, loadingState , notificationState,gettingData , item) {
    let toast = {status :'', title :'', message:''}
    loadingState(true)
    try{
        const response = await fetch(url);
        const resData = await response.json() ;
        loadingState(false)
        const data = resData?.data?.models || resData?.data?.model || resData?.data;
        gettingData(data, resData);
    }catch(err){
        loadingState(false)
        toast = {status :'error',message:err.message || `Could not get ${item}!`,title:'Getting data failed'};
        toastHandler(toast);
        notificationState(true)
    }
}
//==============================================================================================================================
export async function getOrder(url ,headers,toastHandler, loadingState , notificationState,gettingData , item) {
    let toast = {status :'', title :'', message:''}
    loadingState(true)
    try{
        const response = await fetch(url,{headers:headers});
        const resData = await response.json() ;
        loadingState(false)
        const data = resData?.data?.orders || resData?.data?.order || resData?.data;
        gettingData(data, resData);
    }catch(err){
        loadingState(false)
        toast = {status :'error',message:err.message || `Could not get ${item}!`,title:'Getting data failed'};
        toastHandler(toast);
        notificationState(true)
    }
}