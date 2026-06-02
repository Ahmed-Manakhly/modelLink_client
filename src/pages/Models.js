/* eslint-disable */
import Header from '../components/layout/Header' ;
import Controls from '../components/Controls' ;
import Val from '../components/Val'
import Services from '../components/Services'
import img_2 from '../assets/instructor-1x-v3.jpg'
import Box from '../components/Box'
import {vals} from '../data' ;
import banner from '../assets/banner_2.png'
import {useDispatch} from 'react-redux'; 
import {uiActions} from '../store/UI-slice' ;
import {useEffect , useState} from 'react' ;
import {getModel} from '../lib/loaders';
import {ALL_MODELS_URL} from '../lib/api' ;


// import {ScrollRestoration } from 'react-router-dom' ;


function Models({modelsUpdated , onModelsUpdated , searchByVal ,searchVal ,modelsUpdatedLink ,onModelsUpdatedLink}) {
    const [models,setModels] = useState([]) ;
    const [applyControls,setApplyControls] = useState(null) ;
    //----------------------------------------------------
    const [currentPage , setCurrentPage] = useState()
    // const [nextPage , setNextPage] = useState()
    const [numberOfPages , setNumberOfPages] = useState()
    const [lastPath ,setLastPath]  = useState()

    const onApplyControls = (Controls)=>{
        setApplyControls(Controls)
    }
    const dispatch = useDispatch();  
    const goUpHandler = ()=> {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }
    useEffect(()=>{
        goUpHandler()
    },[models])
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
        const gettingData =(data , res)=>{
            setModels(data?data:[])
            setCurrentPage(res.pagination?.page)
            setNumberOfPages(res.pagination?.total_pages)
            setLastPath(ALL_MODELS_URL+'?')
        }
        getModel(ALL_MODELS_URL, toastHandler , loadingState , notificationState , gettingData,'list of models!' )
        dispatch(uiActions.showNotification(false))
    },[])
    //------------------------------------------ on mod update
    useEffect(() => {
        if(modelsUpdated){
            let path
            let field 
            if( searchByVal && searchVal){
                searchByVal ==='Model Title' ? field = 'title':
                searchByVal ==='Model Description'? field = 'desc':
                searchByVal ==='Body Part'? field = 'bodyPart':
                searchByVal ==='Indications'? field = 'indications':
                searchByVal ==='Modality' ? field = 'modality':''
                path = ALL_MODELS_URL+`?${field}=${searchVal.trim()}`
            }else{
                path = ALL_MODELS_URL
            }
            const toastHandler =(toast)=>{
                dispatch(uiActions.notificationDataChanged(toast))
            } 
            const loadingState = (state)=>{
                dispatch(uiActions.showLoading(state))
            }
            const notificationState =(state)=>{
                dispatch(uiActions.showNotification(state))
            }
            const gettingData =(data,res)=>{
                setModels(data?data:[])
                setCurrentPage(res.pagination?.page)
                setNumberOfPages(res.pagination?.total_pages)
                setLastPath(( searchByVal && searchVal) ?path+'&' : path+'?')
            }
            getModel(path, toastHandler , loadingState , notificationState , gettingData,'list of models!' )
            dispatch(uiActions.showNotification(false))
            onModelsUpdated(false)
        }
    },[modelsUpdated ])
    //------------------------------------------
    useEffect(() => {
        if(modelsUpdatedLink){
            let path
            if( (modelsUpdatedLink !== null )&& (modelsUpdatedLink !== 'All Models')){
                path = ALL_MODELS_URL+`?category=${modelsUpdatedLink.trim()}`
            }else{
                path = ALL_MODELS_URL
            }
            const toastHandler =(toast)=>{
                dispatch(uiActions.notificationDataChanged(toast))
            } 
            const loadingState = (state)=>{
                dispatch(uiActions.showLoading(state))
            }
            const notificationState =(state)=>{
                dispatch(uiActions.showNotification(state))
            }
            const gettingData =(data,res)=>{
                setModels(data?data:[])
                setCurrentPage(res.pagination?.page)
                setNumberOfPages(res.pagination?.total_pages)
                setLastPath(( (modelsUpdatedLink !== null )&& (modelsUpdatedLink !== 'All Models'))?path+'&' : path+'?')
            }
            getModel(path, toastHandler , loadingState , notificationState , gettingData,'list of models!' )
            dispatch(uiActions.showNotification(false))
            onModelsUpdatedLink(false)
        }
    },[modelsUpdatedLink ])
    //------------------------------------------
    useEffect(() => {
        if(applyControls){
            let path
            if(applyControls !== 'ALL'){
                path = ALL_MODELS_URL+`?${applyControls.trim()}`
            }else{
                path = ALL_MODELS_URL
            }
            const toastHandler =(toast)=>{
                dispatch(uiActions.notificationDataChanged(toast))
            } 
            const loadingState = (state)=>{
                dispatch(uiActions.showLoading(state))
            }
            const notificationState =(state)=>{
                dispatch(uiActions.showNotification(state))
            }
            const gettingData =(data,res)=>{
                setModels(data?data:[])
                setCurrentPage(res.pagination?.page)
                setNumberOfPages(res.pagination?.total_pages)
                setLastPath((applyControls !== 'ALL')?path+'&' : path+'?')
            }
            getModel(path, toastHandler , loadingState , notificationState , gettingData,'list of models!' )
            dispatch(uiActions.showNotification(false))
            setApplyControls(null)
        }
    },[applyControls])
    //==========================================
    const onGoPrev = ()=>{
        if(currentPage !== 1){
            const toastHandler =(toast)=>{
                dispatch(uiActions.notificationDataChanged(toast))
            } 
            const loadingState = (state)=>{
                dispatch(uiActions.showLoading(state))
            }
            const notificationState =(state)=>{
                dispatch(uiActions.showNotification(state))
            }
            const gettingData =(data , res)=>{
                setModels(data?data:[])
                setCurrentPage(res.pagination?.page)
            }
            getModel(lastPath+`page=${currentPage-1}`, toastHandler , loadingState , notificationState , gettingData,'list of models!' )
            dispatch(uiActions.showNotification(false))
        }
    }
    const onGoNext = ()=>{
        if(currentPage !== numberOfPages){
            const toastHandler =(toast)=>{
                dispatch(uiActions.notificationDataChanged(toast))
            } 
            const loadingState = (state)=>{
                dispatch(uiActions.showLoading(state))
            }
            const notificationState =(state)=>{
                dispatch(uiActions.showNotification(state))
            }
            const gettingData =(data , res)=>{
                setModels(data?data:[])
                setCurrentPage(res.pagination?.page)
            }
            getModel(lastPath+`page=${currentPage+1}`, toastHandler , loadingState , notificationState , gettingData,'list of models!' )
            dispatch(uiActions.showNotification(false))
        }
    }
    //------------------------------------------
    return (
        <>
            <Header 
                txt_1='The AiExchange'
                txt_2='Find the right AI models, right away'
                txt_3='You can search ,or filter based on your interests'
                banner={banner}
            />
            <Controls onApplyControls={onApplyControls}/>
            <Services models={models} title={models.length === 0 ?'No Available Models Yet..':'Available Models..'} 
            noNext={(currentPage&&numberOfPages) ?currentPage === numberOfPages : true} onGoNext={onGoNext} page={currentPage ||0} pages={numberOfPages || 0}
            noPrev={currentPage?currentPage === 1 : true} onGoPrev={onGoPrev}/>
            <Box title={`It’s Your Time!`}
                text_1={'Are you an AI developer with a groundbreaking medical solution? Look no further! Our platform is your gateway to making a difference\n, Find a Real Opportunity for Your AI Model:'}
                title_2={'Medical Expertise:'}
                content_1={'Your AI model can revolutionize healthcare. Whether it’s early disease detection, personalized treatment recommendations, or streamlining clinical workflows, there’s a place for your innovation.'}
                title_3={'Monetize Your Expertise:'}
                content_2={`Don’t just create—commercialize! Showcase your AI model to healthcare providers, researchers, and institutions actively seeking solutions.`}
                closure={`Let’s collaborate and turn your vision into reality. Join us as we empower healthcare professionals and transform patient care.`}
                // closure_2={`Remember, every line you write brings us closer to a future where AI-driven medical solutions improve lives. Let’s make it happen! `}
                img={img_2}
                action={true}
                actionTo={'/auth?mode=signup'}
                actionTitle={'Join Us Now'}
            />
            <Val products={vals} title={'A huge collection of medical AI solutions at your fingertips'} />
        </>
    )
}

export default Models