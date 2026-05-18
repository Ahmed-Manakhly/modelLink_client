/* eslint-disable */
import classes from './FormActions.module.scss' ;
import { useNavigate , Form ,useNavigation } from 'react-router-dom';
import useInput from '../hooks/Use-Input';
import React, { useState , useRef} from 'react';
import {Container , Row , Col  } from 'react-bootstrap' 
import {range} from '../utility/Consts' ;
import {useEffect} from 'react' ;
import ToggleSwitch from './ToggleSwitch' ;
import BorderColorIcon from '@mui/icons-material/BorderColor';
import imgHolder from '../assets/imgHolder.jpg'
import {origin} from '../lib/api' 


const   FormActions = ({ thisModel=null , formTitle ,onCreatingModelAction ,payPerClickInit=false ,subscriptionInit=true} ) => {
    const authority =  JSON.parse(localStorage.getItem('userData'))?.id 
    const [file,setFile] = useState() 
    const [payPerClick,setPayPerClick] = useState(false ) 
    const [subscription,setSubscription] = useState( true) 
    const [features, setfeatures] = useState([]);
    const [isEditing, setEditing] = useState({title :false , category : false , indications: false ,modality:false ,fdaUrl:false , endpointUrl: false,
            price:false , deliveryTime : false ,bodyPart : false ,desc:false});
    const [isTouched, setIsTouched] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [imgWarnning, setImgWarnning] = useState(false);
    const featuresIsValid = features.length > 0 ;
    const featuresIsInValid = !featuresIsValid && isTouched
    const imgRef = useRef(null);
    

    useEffect(() => {
        if(thisModel){
            setPayPerClick(payPerClickInit)
            setSubscription(subscriptionInit)
        }
    },[thisModel,payPerClickInit,subscriptionInit])
    // ------------------------------------
    const navigate = useNavigate();
    function cancelHandler() {
    navigate('..');
    }
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting' ;
    //--------------------------------------------------

    const urlEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    //-----------------------------------------------------------------------
    const {hasError : modelNameIsInvalid , valueIsValid : modelNameIsValid ,value : title,
    valueChangeHandler : modelNameChangeHandler , inputBlurHandler : modelNameBlurHandler} = useInput(value => (value.trim() !=='') ); 
    const {hasError : categoryIsInvalid , valueIsValid : categoryIsValid ,value: category,
    valueChangeHandler : categoryChangeHandler , inputBlurHandler : categoryBlurHandler} = useInput(value => value.trim() !=='' && value.trim() !== '--Please Choose An Option--') ;
    const {hasError : indicationsIsInvalid , valueIsValid : indicationsIsValid ,value: indications,
    valueChangeHandler : indicationsChangeHandler , inputBlurHandler : indicationsBlurHandler} = useInput(value =>( value.trim() !=='') );  
    const {hasError : modalityIsInvalid , valueIsValid : modalityIsValid ,value: modality,
    valueChangeHandler : modalityChangeHandler , inputBlurHandler : modalityBlurHandler} = useInput(value => (value.trim() !=='') );
    //---------------------------------------------------------------------------------
    const {hasError : fdaUrlIsInvalid , valueIsValid : fdaUrlIsValid ,value: fdaUrl,
    valueChangeHandler : fdaUrlChangeHandler , inputBlurHandler : fdaUrlBlurHandler} = useInput(value => (value.trim() !=='' && urlEx.test(value)) );
    const {hasError : endpointUrlIsInvalid , valueIsValid : endpointUrlIsValid ,value: endpointUrl,
    valueChangeHandler : endpointUrlChangeHandler , inputBlurHandler : endpointUrlBlurHandler} = useInput(value => (value.trim() !==''&& urlEx.test(value)) );
    //======================================================================
    const {hasError : deliveryTimeIsInvalid , valueIsValid : deliveryTimeIsValid ,value: deliveryTime,
    valueChangeHandler : deliveryTimeChangeHandler , inputBlurHandler : deliveryTimeBlurHandler} = useInput(value => (value.trim() !=='' && +value.trim() !== 0) );
    const {hasError : priceIsInvalid , valueIsValid : priceIsValid ,value: price,
    valueChangeHandler : priceChangeHandler , inputBlurHandler : priceBlurHandler} = useInput(value => (value.trim() !=='' && +value.trim() !== 0) );
    //===================================================================
    const {hasError : metricsUrlIsInvalid , valueIsValid : metricsUrlIsValid ,value: metricsUrl,
    valueChangeHandler : metricsUrlChangeHandler , inputBlurHandler : metricsUrlBlurHandler} = useInput(value =>( value.trim() !==''&& urlEx.test(value)) );
    const {hasError : imageUrlIsInvalid , valueIsValid : imageUrlIsValid ,value: imageUrl,
    valueChangeHandler : imageUrlChangeHandler , inputBlurHandler : imageUrlBlurHandler} = useInput(value => (value.trim() !==''&& urlEx.test(value)) );
    const {hasError : featureIsInvalid , valueIsValid : featureIsValid ,value:feature ,reset : resetFeature,
    valueChangeHandler : featureChangeHandler , inputBlurHandler : featureBlurHandler} = useInput(value => (value.trim() !=='') );
    //-------------------------------------------------------------------
    const {hasError : bodyPartIsInvalid , valueIsValid : bodyPartIsValid ,value: bodyPart,
    valueChangeHandler : bodyPartChangeHandler , inputBlurHandler : bodyPartBlurHandler} = useInput(value => (value.trim() !=='') ); 
    const {hasError : descIsInvalid , valueIsValid : descIsValid ,value: desc,
    valueChangeHandler : descChangeHandler , inputBlurHandler : descBlurHandler} = useInput(value => (value.trim() !=='') );
    //-------------------------------------------------
    const modelNameClasses = modelNameIsInvalid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const categoryClasses = categoryIsInvalid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const indicationsClasses = indicationsIsInvalid  ?`${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const modalityClasses = modalityIsInvalid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const fdaUrlClasses = fdaUrlIsInvalid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const endpointUrlClasses = endpointUrlIsInvalid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const metricsUrlClasses = metricsUrlIsInvalid? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    // const coverClasses = coverIsInvalid&& !thisModel?? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const deliveryTimeClasses = deliveryTimeIsInvalid? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const priceClasses = priceIsInvalid? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const imageUrlClasses = imageUrlIsInvalid? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const featureClasses = featuresIsInValid? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const bodyPartClasses = bodyPartIsInvalid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const descClasses = descIsInvalid? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    //----------------------------------------------------------

    const defaultData = { 
        sales: 0,
        revisionNumber:0,
        starFrequency:0,
        totalStars:0,
        fda : true,
        userId : authority
    }
    //===================================
    const removeFeature = (index) => {
        const clonedFeatures = [...features];
        clonedFeatures.splice(index, 1);
        setfeatures(clonedFeatures);
    };

    const addFeature = () => {
            if(feature.trim() ===''){
                return
            }
            setfeatures([...features, feature]);
            resetFeature()
    }
    //===================================
    const handelFileChange = (e)=>{
        setFile(e.target.files[0])
        setIsChanged(true)
    }
    const handelpayPerClickChange = ()=>{
        setPayPerClick(prev => !prev)
        setIsChanged(true)
    }
    const handelSubscriptionChange = ()=>{
        setSubscription(prev => !prev)
        setIsChanged(true)
    }

    const handleImgClick=()=>{
        imgRef.current.click();
    }



    const formCompleted = (thisModel &&
    !isEditing.title && !isEditing.category && !isEditing.indications && !isEditing.modality
    &&!isEditing.fdaUrl&&!isEditing.price && !isEditing.deliveryTime && !isEditing.bodyPart&&!isEditing.desc &&!isEditing.endpointUrl)

    let formIsValid = false
    if(
        ((thisModel&&!metricsUrlIsValid)||(!thisModel&&metricsUrlIsValid))&&
        ((thisModel&&!imageUrlIsValid)||(!thisModel&&imageUrlIsValid))&&
        ((thisModel&&!featuresIsValid)||(!thisModel&&featuresIsValid))&&
        (payPerClick ||subscription)&&
        ((thisModel && !isEditing.title) || (!thisModel && modelNameIsValid )|| (thisModel && isEditing.title && modelNameIsValid))&&
        (( thisModel && !isEditing.category)  || (!thisModel && categoryIsValid )|| (thisModel && isEditing.category && categoryIsValid))&&
        (( thisModel&& !isEditing.indications ) || (!thisModel && indicationsIsValid )|| (thisModel && isEditing.indications && indicationsIsValid))&&
        ((thisModel&& !isEditing.modality) || (!thisModel && modalityIsValid )|| (thisModel && isEditing.modality && modalityIsValid))&&
        (( thisModel&&!isEditing.fdaUrl) || (!thisModel && fdaUrlIsValid )|| (thisModel && isEditing.fdaUrl && fdaUrlIsValid))&&
        ((thisModel&&!isEditing.endpointUrl )|| (!thisModel && endpointUrlIsValid )|| (thisModel && isEditing.endpointUrl && endpointUrlIsValid))&&
        ((thisModel&&!isEditing.price ) || (!thisModel && priceIsValid )|| (thisModel && isEditing.price && priceIsValid))&&
        (( thisModel&& !isEditing.deliveryTime ) || (!thisModel && deliveryTimeIsValid )|| (thisModel && isEditing.deliveryTime && deliveryTimeIsValid))&&
        (( thisModel&& !isEditing.bodyPart) || (!thisModel && bodyPartIsValid )|| (thisModel && isEditing.bodyPart && bodyPartIsValid))&&
        ((  thisModel&&!isEditing.desc ) || (!thisModel && descIsValid )|| (thisModel && isEditing.desc && descIsValid))&&
        (!formCompleted ||(formCompleted&&isChanged))
    ){
        formIsValid = true;
    }


    //============================================================
    const handelSubmit =(e)=>{
        if(!file && !thisModel){
            e.preventDefault();
            setImgWarnning(true)
            return;
        }
        e.preventDefault();
        const feature = features.length !==0?features.join(','):null
        let modelData = {}
        !thisModel? modelData={...modelData,...defaultData}:null
        feature ? modelData.feature = feature : null
        title ? modelData.title = title : null
        category ? modelData.category = category : null
        indications ? modelData.indications = indications : null
        modality ? modelData.modality = modality : null
        fdaUrl ? modelData.fdaUrl = fdaUrl : null
        endpointUrl ? modelData.endpointUrl = endpointUrl : null
        price ? modelData.price = price : null
        deliveryTime ? modelData.deliveryTime = deliveryTime : null
        metricsUrl ? modelData.metricsUrl = metricsUrl : null
        desc ? modelData.desc = desc : null
        payPerClick ? modelData.payPerClick = payPerClick : null
        subscription ? modelData.subscription = subscription : null
        imageUrl ? modelData.imageUrl = imageUrl : null
        bodyPart ? modelData.bodyPart = bodyPart : null
        onCreatingModelAction(file?file:null,Object.keys(modelData).length !==0?modelData:null)
    }

    return(
        <Container>
            <section className={`${classes.secpro} w-100`}>
            <h2 className={classes["title"]}>{formTitle}</h2>
            <Container  className={`g-5 p-0  gap-5  justify-content-center`}>
                <Col  className={`${classes["contact-col"]} flex-fill`}>
                    <Form method='post'>
                        <Row className={`justify-content-md-center d-flex flex-column justify-content-center  p-lg-4 align-items-center`}>
                            <Row className={classes["img_sec"]}>
                                <Col xs={0} md lg className={`${classes.img_cover} d-flex flex-column align-items-left w-100`} >
                                    <input name='cover'type="file" onChange={handelFileChange} ref={imgRef} style={{display : 'none'}}/>
                                    <span>
                                        <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={handleImgClick} className={classes["img_ico"]} />
                                    </span>
                                    {file&&<img src={URL.createObjectURL(file)} alt="Model Cover Image" />}
                                    {(!file && thisModel?.cover) &&<img src={origin+thisModel.cover} crossOrigin="anonymous"  alt="Model Cover Image" />}
                                    {(!file && !thisModel?.cover) && <img src={imgHolder} alt="Model Cover Image" />}
                                </Col>
                                <Col> 
                                    <Row xs={0} md lg className={`${modelNameClasses} d-flex flex-column align-items-left w-100`} >
                                        <label htmlFor='modelName'>Model Name</label>
                                        {(!thisModel?.title || (thisModel?.title &&isEditing.title))&& <>
                                            <input type='text' id='modelName' name="title" placeholder="Your Model Name" required
                                            onChange={modelNameChangeHandler} onBlur={modelNameBlurHandler} defaultValue={thisModel? thisModel?.title : ''}/>
                                            {modelNameIsInvalid && <p className={classes['error-text']}>Your Model Name must not be empty</p>}
                                        </>}
                                        {(thisModel?.title&&!isEditing.title)&&
                                            <p>{thisModel?.title} <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={()=>{setEditing((prev)=>{return{...prev,title:true}})}}/></p>
                                        }
                                    </Row>                         
                                    <Row xs={0} md lg className={`${categoryClasses} d-flex flex-column align-items-left w-100`} >
                                        <label htmlFor="category" >Model Category</label>
                                        {(!thisModel?.category || (thisModel?.category &&isEditing.category))&& <>
                                            <select  defaultValue={thisModel? thisModel?.category : "--Please Choose An Option--"}  id='category' name="category" required
                                        onChange={categoryChangeHandler} onBlur={categoryBlurHandler}  className={categoryIsValid?classes.done:null}>
                                            {thisModel&&<option value={thisModel?.category}  >{thisModel?.category }</option>}
                                            {range.map(item => {return <option value={item.name} key={item.code} >{item.name}</option>})}
                                        </select>
                                        {categoryIsInvalid && <p className={classes['error-text']}>Model Category must not be empty</p>}
                                        </>}
                                        {(thisModel?.category&&!isEditing.category)&&
                                            <p>{thisModel?.category} <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={()=>{setEditing((prev)=>{return{...prev,category:true}})}}/></p>
                                        }
                                    </Row>
                                </Col>
                            </Row>
                            <Row >
                                <Col xs={0} md lg className={`${indicationsClasses} d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='indications'>Indications</label>
                                    {(!thisModel?.indications || (thisModel?.indications &&isEditing.indications))&& <>
                                        <input type='text' id='indications' name="indications" placeholder="Your Model Indications" required
                                        onChange={indicationsChangeHandler} onBlur={indicationsBlurHandler} defaultValue={thisModel? thisModel?.indications : ''}/>
                                        {indicationsIsInvalid &&  <p className={classes['error-text']}>Model Indications must not be empty</p>}
                                    </>}
                                    {(thisModel?.indications&&!isEditing.indications)&&
                                        <p>{thisModel?.indications} <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={()=>{setEditing((prev)=>{return{...prev,indications:true}})}}/></p>
                                    }
                                </Col>
                                <Col xs={0} md lg className={`${modalityClasses} d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='modality'>Model Modality</label>
                                    {(!thisModel?.modality || (thisModel?.modality &&isEditing.modality))&& <>
                                        <input type='text' id='modality' name="modality" placeholder="Model Modality" required
                                        onChange={modalityChangeHandler} onBlur={modalityBlurHandler} defaultValue={thisModel? thisModel?.modality : ''}/>
                                    {modalityIsInvalid && <p className={classes['error-text']}>Model Modality must not be empty</p>}
                                    </>}
                                    {(thisModel?.modality&&!isEditing.modality)&&
                                        <p>{thisModel?.modality} <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={()=>{setEditing((prev)=>{return{...prev,modality:true}})}}/></p>
                                    }
                                </Col>
                            </Row>
                            <Row >
                                <Col xs={0} md lg className={`${fdaUrlClasses} d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='fdaUrl'>FDA URL</label>
                                    {(!thisModel?.fdaUrl || (thisModel?.fdaUrl &&isEditing.fdaUrl))&& <>
                                        <input type='text' id='fdaUrl' name="fdaUrl" placeholder="FDA URL" required
                                        onChange={fdaUrlChangeHandler} onBlur={fdaUrlBlurHandler} defaultValue={thisModel? thisModel?.fdaUrl : ''}/>
                                        {fdaUrlIsInvalid && <p className={classes['error-text']}>Enter a valid URL</p>}
                                    </>}
                                    {(thisModel?.fdaUrl&&!isEditing.fdaUrl)&&
                                        <p>{thisModel?.fdaUrl} <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={()=>{setEditing((prev)=>{return{...prev,fdaUrl:true}})}}/></p>
                                    }
                                </Col>
                                <Col xs={0} md lg className={`${endpointUrlClasses} d-flex flex-column align-items-left w-100`} >
                                <label htmlFor='endpointUrl'>Endpoint URL</label>
                                    {(!thisModel?.endpointUrl || (thisModel?.endpointUrl &&isEditing.endpointUrl))&& <>
                                        <input type='text' id='endpointUrl' name="endpointUrl" placeholder="Endpoint URL" 
                                    onChange={endpointUrlChangeHandler} onBlur={endpointUrlBlurHandler} defaultValue={thisModel? thisModel?.endpointUrl : ''}/>
                                    {endpointUrlIsInvalid&& <p className={classes['error-text']}>Enter a valid URL</p>}
                                    </>}
                                    {(thisModel?.endpointUrl&&!isEditing.endpointUrl)&&
                                        <p>{thisModel?.endpointUrl} <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={()=>{setEditing((prev)=>{return{...prev,endpointUrl:true}})}}/></p>
                                    }
                                </Col>
                            </Row>
                            <Row >
                                <Col xs={0} md lg className={`${priceClasses} d-flex flex-column align-items-left w-100`} >
                                <label htmlFor='price'>Model Price</label>
                                    {(!thisModel?.price || (thisModel?.price &&isEditing.price))&& <>
                                        <input type='number' id='price' name="price" placeholder="Model Price (USD)" required step="0.01" min="10"
                                    onChange={priceChangeHandler} onBlur={priceBlurHandler} defaultValue={thisModel? thisModel?.price : ''}/>
                                    {priceIsInvalid && <p className={classes['error-text']}>Enter a valid Price </p>}
                                    </>}
                                    {(thisModel?.price&&!isEditing.price)&&
                                        <p>{thisModel?.price} <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={()=>{setEditing((prev)=>{return{...prev,price:true}})}}/></p>
                                    }
                                </Col>
                                <Col xs={0} md lg className={`${deliveryTimeClasses} d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='deliveryTime'>Delivery Time</label>
                                    {(!thisModel?.deliveryTime || (thisModel?.deliveryTime &&isEditing.deliveryTime))&& <>
                                        <input type='number' id='deliveryTime' name="deliveryTime" placeholder="How long it will take in days" min="1" max="30" step="1"
                                        onChange={deliveryTimeChangeHandler} onBlur={deliveryTimeBlurHandler} defaultValue={thisModel? thisModel?.deliveryTime : ''}/>
                                    {deliveryTimeIsInvalid && <p className={classes['error-text']}>Enter a valid number of days</p>}
                                    </>}
                                    {(thisModel?.deliveryTime&&!isEditing.deliveryTime)&&
                                        <p>{thisModel?.deliveryTime} <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={()=>{setEditing((prev)=>{return{...prev,deliveryTime:true}})}}/></p>
                                    }
                                </Col>
                                <Col xs={0} md lg className={`d-flex flex-column align-items-left w-100`} >
                                    <Row>
                                        <Col>
                                            <ToggleSwitch type='checkbox' name='payPerClick' value={payPerClick} onChange={handelpayPerClickChange}
                                            title='Pay Per Click' checked={payPerClick}  id={'payPerClick'}/>
                                        </Col>
                                        <Col>
                                            <ToggleSwitch type='checkbox' name='subscription' value={subscription} onChange={handelSubscriptionChange}
                                            title='Subscription' checked={subscription}  id={'subscription'}/>
                                        </Col>
                                        {(!payPerClick &&!subscription) && <p className={classes['error-text']}>at least one method should be picked up</p>}
                                    </Row>
                                </Col>
                            </Row>
                            {!thisModel&&  <>                    
                                <Row >
                                    <Col xs={0} md lg className={`${metricsUrlClasses} d-flex flex-column align-items-left w-100`} >
                                        <label htmlFor='metricsUrl'>Metrics URL</label>
                                        <input type='text' id='metricsUrl' name="metricsUrl" placeholder="Metrics URL" 
                                        onChange={metricsUrlChangeHandler} onBlur={metricsUrlBlurHandler} />
                                        {metricsUrlIsInvalid && <p className={classes['error-text']}>Enter a valid URL</p>}
                                    </Col>
                                    <Col xs={0} md lg className={`${imageUrlClasses} d-flex flex-column align-items-left w-100`} >
                                        <label htmlFor='imageUrl'>Image URL</label>
                                        <input type='text' id='imageUrl' name="imageUrl" placeholder="Image URL" 
                                        onChange={imageUrlChangeHandler} onBlur={imageUrlBlurHandler} />
                                        {imageUrlIsInvalid &&  <p className={classes['error-text']}>Enter a valid URL</p>}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={0} md lg className={`${featureClasses} d-flex flex-column align-items-left w-100`} >
                                        <label htmlFor='feature'>Model Feature</label>
                                        <Row className={`flex gap-3 items-center mb-5 ${classes.f_con_2}`}>
                                            <Col>
                                                <input type='text' id='feature' name="feature" placeholder="Enter at least one Feature Name" required
                                                onChange={featureChangeHandler} onBlur={()=>{setIsTouched(true)}} value={feature} />
                                            </Col>
                                            <Col>
                                                <button type="button" onClick={addFeature} className={classes['feature-btn']} disabled={features.length === 6} >Add Feature</button>
                                            </Col>
                                        </Row>
                                        {featuresIsInValid && <p className={classes['error-text']}>set at least one Feature</p>}
                                        <Row className={`${classes.f_list}`}>
                                            {features.map((feature, index) => {
                                                return (
                                                <Col key={feature + index.toString()} className={`${classes.f_item}`} >
                                                    <span className={`${classes.f_item_title}`}>{feature}</span>
                                                    <span className={`${classes.f_item_icon}`}  onClick={() => removeFeature(index)} > X </span>
                                                </Col>
                                                );
                                            })}
                                        </Row>
                                    </Col>
                                </Row>
                            </>}
                            <Row  >
                                <Col xs={0} md lg className={`${bodyPartClasses} d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='bodyPart'>Body part</label>
                                    {(!thisModel?.bodyPart || (thisModel?.bodyPart &&isEditing.bodyPart))&& <>
                                        <textarea id='bodyPart' name="bodyPart" cols="30" rows="7" placeholder="Body part" required
                                    onChange={bodyPartChangeHandler} onBlur={bodyPartBlurHandler} defaultValue={thisModel? thisModel?.bodyPart : ''}/>
                                    {bodyPartIsInvalid &&<p className={classes['error-text']}>Body Part Must Not Be Empty</p>}
                                    </>}
                                    {(thisModel?.bodyPart&&!isEditing.bodyPart)&&
                                        <p>{thisModel?.bodyPart} <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={()=>{setEditing((prev)=>{return{...prev,bodyPart:true}})}}/></p>
                                    }
                                </Col>
                                <Col xs={0} md lg className={`${descClasses} d-flex flex-column align-items-left w-100`} >
                                <label htmlFor='desc'>Model Description</label>
                                    {(!thisModel?.desc || (thisModel?.desc &&isEditing.desc))&& <>
                                        <textarea id='desc' name="desc" cols="30" rows="7" placeholder="Model Description" required
                                    onChange={descChangeHandler} onBlur={descBlurHandler} defaultValue={thisModel? thisModel?.desc : ''}/>
                                    {descIsInvalid && <p className={classes['error-text']}>Model Description Must Not Be Empty</p>}
                                    </>}
                                    {(thisModel?.desc&&!isEditing.desc)&&
                                        <p>{thisModel?.desc} <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={()=>{setEditing((prev)=>{return{...prev,desc:true}})}}/></p>
                                    }
                                </Col>
                            </Row>
                            <Row >
                                {imgWarnning && <p className={classes['error-text']}>Please Select a cover Image</p>}
                                <Col xs={0} md lg  className={`${classes["form-actions"]} `}>
                                    <button   onClick={handelSubmit} disabled={!formIsValid||isSubmitting}  className={`${classes["feature-btn"]} `} type="submit">{isSubmitting?'submitting...':(thisModel?  "Update" : "Submit")}</button>
                                </Col>
                                <Col xs={0} md lg  className={`${classes["form-actions"]} `}>
                                    <button type="button" onClick={cancelHandler} className={`${classes["cancel-btn"]} `}>Cancel</button>
                                </Col>
                            </Row>
                        </Row>
                    </Form>
                </Col>
            </Container>
            </section>
        </Container>
    )
}
export default FormActions