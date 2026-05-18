/* eslint-disable react/prop-types */
import { categoriesList_2} from '../data' ;
import classes from './Categories.module.scss' ;
import {Link} from 'react-router-dom';
//------------
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';



const Card = ({title , items, img , onClickLink })=>{
  return (
    <div className={classes["category-item"]}>
    <div className={classes["category-content-box"]}>
      <div className={classes["category-content-flex"]}>
        <h3 className={classes["category-item-title"]}>{title}</h3>
      </div>
      {items.map((item,index)=>{return(
        <Link key={index} to={item?.to} onClick={onClickLink?.bind(null,item?.title)}  className={classes["category-btn"]}>{item?.title} </Link >
      )})}
    </div>
    <div className={classes["category-img-box"]}>
      <img src={img} alt={title} width="30"/>
    </div>
  </div>
  )
}

function Categories({onClickLink}) {
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
  return (
    <div className={classes.container}>
    <h2 className={classes["title"]}>Models Categories</h2>
    <Carousel responsive={responsive} showDots infinite   keyBoardControl swipeable  draggable  className='filters'  >
      {categoriesList_2.map((item,index)=>{return(
        <Card
          key={index} 
          title={item.title} 
          img={item.img}
          onClickLink={onClickLink}
          items={item.items}
        />
      )})}
    </Carousel>
</div>
  )
}

export default Categories
//autoPlay autoPlaySpeed={2500}
