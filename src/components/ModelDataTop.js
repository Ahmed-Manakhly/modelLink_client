import classes from './ModelData.module.scss' ;
import {Container , Row , Col  } from 'react-bootstrap' 
import imgHolder from '../assets/imgHolder.jpg'
import {FILES_BASE_API_URL} from '../lib/api' 



const   ModelDataTop = ({ model=null , formTitle }) => {
    let overAllRev = 0
    if(model?.totalStars > 0 && model?.starFrequency >0 ){
        overAllRev = (model?.totalStars / model?.starFrequency).toFixed(2)
    }

    return(
            <Container  className={`g-5 p-md-3 gap-5  justify-content-center`}>
            <h2 className={classes["title"]}>{formTitle}</h2>
                <Col  className={`${classes["contact-col"]} flex-fill`}>
                        <Row className={`justify-content-md-center d-flex flex-column justify-content-center  p-lg-4 align-items-center`}>
                            <Row className={classes["img_sec"]}>
                                <Col xs={0} md lg className={`${classes.img_cover} d-flex flex-column align-items-left w-100`} >
                                    {model?.cover &&<img src={FILES_BASE_API_URL+model?.cover} alt="Model Cover" crossOrigin="anonymous"  />}
                                    {!model?.cover && <img src={imgHolder} alt="Model Cover" crossOrigin="anonymous"  />}
                                </Col>
                                <Col> 
                                    <Row xs={0} md lg className={`${classes["form-control"]} d-flex flex-column align-items-left w-100`} >
                                        {overAllRev === 0  &&
                                        <label className={classes["rateFlag"]} >{`No Rateing Yet!`}</label>
                                        }
                                        {overAllRev > 0 && <>
                                        <label>{`Overall Rateing is ${overAllRev}`}</label>
                                        <div className={classes["showcase-rating"]}>
                                            <ion-icon name={`${overAllRev<1?'star-outline':'star'}`}></ion-icon>
                                            <ion-icon name={`${overAllRev<2?'star-outline':'star'}`}></ion-icon>
                                            <ion-icon name={`${overAllRev<3?'star-outline':'star'}`}></ion-icon>
                                            <ion-icon name={`${overAllRev<4?'star-outline':'star'}`}></ion-icon>
                                            <ion-icon name={`${overAllRev<5?'star-outline':'star'}`}></ion-icon>
                                        </div></>
                                        }
                                    </Row>                         
                                    <Row xs={0} md lg className={`${classes["form-control"]} d-flex flex-column align-items-left w-100`} >
                                        <label htmlFor='modelName'>Model Name</label>
                                            <p>{model?.title} </p>
                                    </Row>                         
                                    <Row xs={0} md lg className={`${classes["form-control"]} d-flex flex-column align-items-left w-100`} >
                                        <label htmlFor="category" >Model Category</label>
                                            <p>{model?.category} </p>
                                    </Row>
                                </Col>
                            </Row>
                        </Row>
                </Col>
        </Container>
    )
}
export default ModelDataTop