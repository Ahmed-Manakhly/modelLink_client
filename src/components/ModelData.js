import classes from './ModelData.module.scss' ;
import {Container , Row , Col  } from 'react-bootstrap' 


const   ModelData = ({ model=null }) => {
    return(
        <Container>

                <Col  className={`${classes["contact-col"]} flex-fill`}>
                        <Row className={`justify-content-md-center d-flex flex-column justify-content-center  p-lg-4 align-items-center`}>
                            <Row >
                                <Col xs={0} md lg className={`${classes["form-control"]} d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='fdaUrl'>FDA URL</label>
                                    <p>{model?.fdaUrl} </p>
                                </Col>
                                <Col xs={0} md lg className={` ${classes["form-control"]}  d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='endpointUrl'>Endpoint URL</label>
                                    <p>{model?.endpointUrl} </p>
                                </Col>
                            </Row>
                            <Row  >
                                <Col xs={0} md lg className={` ${classes["form-control"]}  d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='bodyPart'>Body part</label>
                                    <p>{model?.bodyPart} </p>
                                </Col>
                                <Col xs={0} md lg className={` ${classes["form-control"]}  d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='desc'>Model Description</label>
                                    <p>{model?.desc} </p>
                                </Col>
                            </Row>
                        </Row>
                </Col>
        </Container>
    )
}
export default ModelData