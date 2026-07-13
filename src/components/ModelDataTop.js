import classes from './ModelData.module.scss';
import { Container, Row, Col, Badge } from 'react-bootstrap'
import { getModelMarketingFields, getModelRating } from '../lib/modelHelpers';//getVersionById

// const formatDate = (value) => {
//     if (!value) return 'N/A';
//     return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
// };

const ModelDataTop = ({ model = null, formTitle, selectedVersionId }) => {
    const marketing = getModelMarketingFields(model);
    // const activeVersion = getVersionById(model, selectedVersionId);
    // const price = activeVersion?.price ?? marketing.price;
    // const deliveryTime = activeVersion?.deliveryTime ?? marketing.deliveryTime;
    const overAllRev = getModelRating(model);
    const ratingDisplay = overAllRev > 0 ? overAllRev.toFixed(2) : 0;

    return (
        <Container className="my-5">
            <h2 className="title">{formTitle}</h2>
            <Col className={`${classes["contact-col"]} flex-fill`}>
                <Row className={`justify-content-md-center d-flex flex-column justify-content-center p-lg-4 align-items-center`}>
                    <Row className={classes["img_sec"]}>

                        <Col>
                            <Row xs={0} md lg className={`${classes["form-control"]} d-flex flex-column align-items-left w-100 mb-4`} >
                                {overAllRev === 0 &&
                                    <h3 className="title_2" style={{ color: '#ef9a9a' }}>{`No Rating Yet!`}</h3>
                                }
                                {overAllRev > 0 && <>
                                    <h3 className="title_2">Overall Rating</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div className={classes["showcase-rating"]} style={{ marginBottom: 0 }}>
                                            <ion-icon name={`${overAllRev < 1 ? 'star-outline' : 'star'}`}></ion-icon>
                                            <ion-icon name={`${overAllRev < 2 ? 'star-outline' : 'star'}`}></ion-icon>
                                            <ion-icon name={`${overAllRev < 3 ? 'star-outline' : 'star'}`}></ion-icon>
                                            <ion-icon name={`${overAllRev < 4 ? 'star-outline' : 'star'}`}></ion-icon>
                                            <ion-icon name={`${overAllRev < 5 ? 'star-outline' : 'star'}`}></ion-icon>
                                        </div>
                                        <div style={{ background: 'var(--cultured)', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold', color: 'var(--primary)' }}>
                                            {ratingDisplay}
                                        </div>
                                    </div></>
                                }
                            </Row>
                            {model?.featured === true && (
                                <Row xs={0} md lg className={`${classes["form-control"]} d-flex flex-column align-items-left w-100 mb-4`} >
                                    <h3 className="title_2">Featured</h3>
                                    <div><Badge bg="warning" text="dark" style={{ fontSize: '14px', padding: '8px 12px' }}>Featured</Badge></div>
                                </Row>
                            )}
                            <Row xs={0} md lg className={`${classes["form-control"]} d-flex flex-column align-items-left w-100 mb-4`} >
                                <h3 className="title_2">Model Name</h3>
                                <p>{model?.title} </p>
                            </Row>
                            <Row xs={0} md lg className={`${classes["form-control"]} d-flex flex-column align-items-left w-100 mb-4`}>
                                <h3 className="title_2">Public Statistics</h3>
                                <div className="d-flex flex-column flex-md-row w-100" style={{ gap: '20px', marginTop: '10px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, backgroundColor: 'rgba(238, 238, 238, 0.278)', borderLeft: '10px solid var(--cultured)', padding: '15px', borderRadius: '4px' }}>
                                        <span style={{ fontWeight: '600', color: 'var(--sonic-silver)', fontSize: '13px', textTransform: 'uppercase' }}>Views</span>
                                        <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary)' }}>{model?.views || 0}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, backgroundColor: 'rgba(238, 238, 238, 0.278)', borderLeft: '10px solid var(--cultured)', padding: '15px', borderRadius: '4px' }}>
                                        <span style={{ fontWeight: '600', color: 'var(--sonic-silver)', fontSize: '13px', textTransform: 'uppercase' }}>Total Sales</span>
                                        <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary)' }}>{model?.sales || 0}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, backgroundColor: 'rgba(238, 238, 238, 0.278)', borderLeft: '10px solid var(--cultured)', padding: '15px', borderRadius: '4px' }}>
                                        <span style={{ fontWeight: '600', color: 'var(--sonic-silver)', fontSize: '13px', textTransform: 'uppercase' }}>Total Reviews</span>
                                        <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary)' }}>{marketing.reviewCount || 0}</span>
                                    </div>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Row>
            </Col>
        </Container>
    )
}
export default ModelDataTop