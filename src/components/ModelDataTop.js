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
        <div className="my-5 w-100">
            <div className="mb-5">
              <h2 className="page-main-title m-0">
                <span className="gradient-text">{formTitle}</span>
              </h2>
            </div>
            <div className={`${classes["contact-col"]} flex-fill w-100`}>
                <div className={`d-flex flex-column justify-content-center align-items-center w-100`}>
                    <div className={`${classes["img_sec"]} w-100`}>

                        <div className="w-100">
                            <div className={`${classes["form-control"]} d-flex flex-column align-items-start w-100 mb-4`} >
                                {overAllRev === 0 &&
                                    <h3 className="title_2" style={{ color: '#ef9a9a' }}>{`No Rating Yet!`}</h3>
                                }
                                {overAllRev > 0 && <>
                                    <h3 className="title_2">Overall Rating</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div className={classes["showcase-rating"]} style={{ marginBottom: 0, fontSize: '24px', letterSpacing: '2px', textShadow: '0 0 10px rgba(255, 193, 7, 0.3)' }}>
                                            <ion-icon name={`${overAllRev < 1 ? 'star-outline' : 'star'}`}></ion-icon>
                                            <ion-icon name={`${overAllRev < 2 ? 'star-outline' : 'star'}`}></ion-icon>
                                            <ion-icon name={`${overAllRev < 3 ? 'star-outline' : 'star'}`}></ion-icon>
                                            <ion-icon name={`${overAllRev < 4 ? 'star-outline' : 'star'}`}></ion-icon>
                                            <ion-icon name={`${overAllRev < 5 ? 'star-outline' : 'star'}`}></ion-icon>
                                        </div>
                                        <div style={{ background: 'var(--surface-glass)', border: '1px solid var(--primary)', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', color: 'var(--primary)', boxShadow: '0 0 10px rgba(34, 211, 238, 0.2)' }}>
                                            {ratingDisplay}
                                        </div>
                                    </div></>
                                }
                            </div>
                            {model?.featured === true && (
                                <div className={`${classes["form-control"]} d-flex flex-column align-items-start w-100 mb-4`} >
                                    <h3 className="title_2">Featured</h3>
                                    <div><Badge bg="warning" text="dark" style={{ fontSize: '14px', padding: '8px 12px' }}>Featured</Badge></div>
                                </div>
                            )}
                            <div className={`${classes["form-control"]} d-flex flex-column align-items-start w-100 mb-4`} >
                                <h3 className="title_2 mb-2">Model Name</h3>
                                <div className="global-read-only-field" style={{ minHeight: 'auto', padding: '12px 15px', fontSize: '16px', fontWeight: '500' }}>
                                    {model?.title}
                                </div>
                            </div>
                            <div className={`${classes["form-control"]} d-flex flex-column align-items-start w-100 mb-4`}>
                                <h3 className="title_2">Public Statistics</h3>
                                <div className="d-flex flex-column flex-md-row w-100" style={{ gap: '20px', marginTop: '10px' }}>
                                    <div className="global-read-only-field" style={{ flex: 1, minHeight: 'auto' }}>
                                        <span style={{ fontWeight: '600', color: 'var(--sonic-silver)', fontSize: '13px', textTransform: 'uppercase', marginBottom: '5px' }}>Views</span>
                                        <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary)' }}>{model?.views || 0}</span>
                                    </div>
                                    <div className="global-read-only-field" style={{ flex: 1, minHeight: 'auto' }}>
                                        <span style={{ fontWeight: '600', color: 'var(--sonic-silver)', fontSize: '13px', textTransform: 'uppercase', marginBottom: '5px' }}>Total Sales</span>
                                        <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary)' }}>{model?.sales || 0}</span>
                                    </div>
                                    <div className="global-read-only-field" style={{ flex: 1, minHeight: 'auto' }}>
                                        <span style={{ fontWeight: '600', color: 'var(--sonic-silver)', fontSize: '13px', textTransform: 'uppercase', marginBottom: '5px' }}>Total Reviews</span>
                                        <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary)' }}>{marketing.reviewCount || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ModelDataTop