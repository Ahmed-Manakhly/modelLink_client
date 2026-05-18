/* eslint-disable react/prop-types */
/* eslint-disable */
import { options ,categoriesList_2} from '../data' ;
import classes from './Controls.module.scss' ;
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import {useState} from 'react' 



const Card = ({title , items , img , onClickLink ,activeCat })=>{
  return (
    <div className={classes["category-item"]}>
    <div className={classes["category-content-box"]}>
      <div className={classes["category-content-flex"]}>
        <h3 className={classes["category-item-title"]}>{title}</h3>
      </div>
      {items.map((item,index)=>{return(
        <button key={index} onClick={onClickLink?.bind(null,item?.title)}  className={`${classes["category-btn"]} ${(activeCat === item?.title)&&classes["active"]}`}
          >{item?.title} </button >
      )})}
    </div>
    <div className={classes["category-img-box"]}>
      <img src={img} alt={title} width="30"/>
    </div>
  </div>
  )
}
const CardFilter = ({title , items , img , onClickLink ,activeControls})=>{
  return (
    <div className={classes["category-item"]}>
    <div className={classes["category-content-box"]}>
      <div className={classes["category-content-flex"]}>
        <h3 className={classes["category-item-title"]}>{title}</h3>
      </div>
      {items.map((item,index)=>{return(
        <button key={index} onClick={onClickLink?.bind(null,item?.title)}  className={`${classes["category-btn"]} ${
          (activeControls?.find(control=> control ===  item?.title)) ? classes["active"] : ''
        }`}
        >{item?.title} </button >
      )})}
    </div>
    <div className={classes["category-img-box"]}>
      <img src={img} alt={title} width="30"/>
    </div>
  </div>
  )
}

function Controls({onApplyControls}) {
  const [catFilter, setCatFilter] =useState(null);
  const [activeCat, setActiveCat] =useState(null);
  //======================
  const [payPerClick, setPayPerClick] =useState(false);
  const [subscription, setSubscription] =useState(false);
  //=======================
  const [price, setPrice] =useState(null);
  const [deliveryTime, setDeliveryTime] =useState(null);
  //=======================
  const [activeControls, setActiveControls] =useState([]);
  //===================
  const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 4
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
  };
  const onClickCatFilter = (cat)=>{
    setCatFilter(cat)
    setActiveCat(cat)
  }
  //===============
  const onClickFilter = (filter)=>{
    if(filter === 'Pay Per Click'){
      setPayPerClick(prev => !prev)
      let ex = activeControls?.find(control=> control ===  filter)
      if(ex){
        setActiveControls(prev => prev.filter(control=> control !== filter))
      }else{
        setActiveControls(prev=>  [...prev , filter])
      }
    }else  if(filter === 'Subscription'){
      setSubscription(prev => !prev)
      let ex = activeControls?.find(control=> control ===  filter)
      if(ex){
        setActiveControls(prev => prev.filter(control=> control !== filter))
      }else{
        setActiveControls(prev=>  [...prev , filter])
      }
    }else  if(filter === 'Less Than Or Equal To $300'){
      setPrice(filter)
      let ex = activeControls?.find(control=> control ===  filter)
      if(ex){
        setActiveControls(prev => prev.filter(control=> control !== 'Greater Than Or Equal To $300'))
      }else{
        setActiveControls(prev=>  [...prev , filter])
        setActiveControls(prev => prev.filter(control=> control !== 'Greater Than Or Equal To $300'))
      }
    }else  if(filter === 'Greater Than Or Equal To $300'){
      setPrice(filter)
      let ex = activeControls?.find(control=> control ===  filter)
      if(ex){
        setActiveControls(prev => prev.filter(control=> control !== 'Less Than Or Equal To $300'))
      }else{
        setActiveControls(prev=>  [...prev , filter])
        setActiveControls(prev => prev.filter(control=> control !== 'Less Than Or Equal To $300'))
      }
    }else  if(filter === 'Less Than Or Equal To 5 Days'){
      setDeliveryTime(filter)
      let ex = activeControls?.find(control=> control ===  filter)
      if(ex){
        setActiveControls(prev => prev.filter(control=> control !== 'Greater Than Or Equal To 5 Days'))
      }else{
        setActiveControls(prev=>  [...prev , filter])
        setActiveControls(prev => prev.filter(control=> control !== 'Greater Than Or Equal To 5 Days'))
      }
    }else  if(filter === 'Greater Than Or Equal To 5 Days'){
      setDeliveryTime(filter)
      let ex = activeControls?.find(control=> control ===  filter)
      if(ex){
        setActiveControls(prev => prev.filter(control=> control !== 'Less Than Or Equal To 5 Days'))
      }else{
        setActiveControls(prev=>  [...prev , filter])
        setActiveControls(prev => prev.filter(control=> control !== 'Less Than Or Equal To 5 Days'))
      }
    }
  }

  const ApplyFilters =()=>{
    if(catFilter || payPerClick ||subscription ||price ||deliveryTime){
      let filters = []
      catFilter ? filters.push(`category=${catFilter}`) : null
      payPerClick ? filters.push(`payPerClick=yes`) : null
      subscription ? filters.push(`subscription=yes`) : null
      price ? filters.push(`price=${300}`) : null
      price ==='Less Than Or Equal To $300' ? filters.push(`priceRule=lte`) : null
      price ==='Greater Than Or Equal To $300' ? filters.push(`priceRule=gte`) : null
      deliveryTime ? filters.push(`deliveryTime=${5}`) : null
      deliveryTime ==='Less Than Or Equal To 5 Days' ? filters.push(`deliveryTimeRule=lte`) : null
      deliveryTime ==='Greater Than Or Equal To 5 Days' ? filters.push(`deliveryTimeRule=gte`) : null
      onApplyControls(filters.join('&'))
    }else{
      onApplyControls('ALL')
    }
  }
  const clearCategoriesFilter =()=>{
    setCatFilter(null)
    setActiveCat(null)
  }
  const clearPriceFilter =()=>{
    setPrice(null)
    setActiveControls(prev => prev.filter(control=> control !== 'Greater Than Or Equal To $300'))
    setActiveControls(prev => prev.filter(control=> control !== 'Less Than Or Equal To $300'))
  }
  const clearDeliveryTimeFilter =()=>{
    setDeliveryTime(null)
    setActiveControls(prev => prev.filter(control=> control !== 'Greater Than Or Equal To 5 Days'))
    setActiveControls(prev => prev.filter(control=> control !== 'Less Than Or Equal To 5 Days'))
  }
  const clearAll =()=>{
    clearCategoriesFilter()
    clearPriceFilter()
    clearDeliveryTimeFilter()
    setPayPerClick(false)
    setSubscription(false)
    setActiveControls([])
  }

  return (
    <div className={classes.container}>
      <h2 className={classes["title"]}>Advanced Filters</h2>
      <Carousel responsive={responsive} showDots infinite   keyBoardControl swipeable  draggable   className='filters' >
        {categoriesList_2.map((item,index)=>{return(
          <Card
            key={index} 
            title={item.title} 
            onClickLink={onClickCatFilter}
            items={item.items}
            img={item.img}
            activeCat={activeCat}
          />
        )})}
      </Carousel>
      {/* ================================================================================================ */}
      <Carousel responsive={responsive} showDots infinite   keyBoardControl swipeable  draggable   className='filters' >
        {options.map((item,index)=>{return(
          <CardFilter
            key={index} 
            title={item.title} 
            onClickLink={onClickFilter}
            items={item.items}
            img={item.img}
            activeControls={activeControls}
          />
        )})}
      </Carousel>
      <div className={classes.buttons} > 
          <button onClick={ApplyFilters}  className={classes.apply}  >Apply Filters</button>
          <button onClick={clearCategoriesFilter} >Clear Categories Filter</button>
          <button onClick={clearPriceFilter} >Clear Price Filter</button>
          <button onClick={clearDeliveryTimeFilter} >Clear Delivery Time Filter</button>
          <button onClick={clearAll} >Clear All</button>
      </div>
  </div>
  )
}

export default Controls

