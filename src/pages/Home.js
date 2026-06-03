import Header from '../components/layout/Header' ;
import Categories from '../components/Categories' ;
import PopularServices from '../components/PopularServices' ;
import Val from '../components/Val'
import Video from '../components/Video'
import Box from '../components/Box'
import img from '../assets/about.jpg'
import {vals} from '../data' ;
import banner from '../assets/banner.png'
import img_2 from '../assets/instructor-1x-v3.jpg'
import { getData, getAllModelsReq } from '../lib/loaders';
import {useDispatch} from 'react-redux'; 
import {uiActions} from '../store/UI-slice' ;
import {useEffect , useState} from 'react' ;


function Home({modelsUpdated , onModelsUpdated , onClickLink }) {
    const [models,setModels] = useState([]) ;
    const dispatch = useDispatch();  
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
            setModels(data?data:[])
        }
        getData(() => getAllModelsReq(''), toastHandler , loadingState , notificationState , gettingData,'list of models!' )
        dispatch(uiActions.showNotification(false))
        // return redirect('');
    },[dispatch])
    //------------------------------------------
    //------------------------------------------------
    useEffect(() => {
        if(modelsUpdated){
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
                setModels(data?data:[])
            }
            getData(() => getAllModelsReq(''), toastHandler , loadingState , notificationState , gettingData,'list of models!' )
            dispatch(uiActions.showNotification(false))
            onModelsUpdated(false)
            // return redirect('');
        }
    },[modelsUpdated , dispatch , onModelsUpdated])
    //------------------------------------------
    return (
        <>
            <Header 
                txt_1='The ModelLink'
                txt_2='A digital marketplace for medical AI'
                txt_3='that facilitates the connection between AI developers'
                banner={banner}
            />
            <Categories onClickLink={onClickLink} />
            <PopularServices models={models}/>
            
            <Box title={'Welcome to ModelLink!'}
                text_1={'At ModelLink, we’re more than just a marketplace. We’re a vibrant community where AI enthusiasts, developers, and healthcare professionals converge. Here’s what sets us apart:'}
                text_2={'We’re on a mission to revolutionize how AI impacts healthcare. Whether you’re a seasoned developer or a curious medical practitioner, ModelLink is your go-to hub for innovation'}
                img={img}
            />
            <Video/>
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

export default Home