import classes from './ModelData.module.scss';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { getModelMarketingFields, getVersionById } from '../lib/modelHelpers';

const ModelData = ({ model = null, selectedVersionId }) => {
    const version = getVersionById(model, selectedVersionId);
    const marketing = getModelMarketingFields(model, selectedVersionId);
    const showMedical = Boolean(version?.modalityRel || version?.bodyPartRel || version?.fda || version?.fdaUrl);

    return (
        <Container className="my-5">
            <Col className={`${classes["contact-col"]} flex-fill`}>
                <Row className="justify-content-md-center d-flex flex-column justify-content-center p-lg-4 align-items-center" style={{ gap: '20px' }}>


                    {showMedical && (
                        <Row>
                            <Col xs={12} md={6} className={`${classes["form-control"]} d-flex flex-column align-items-left mb-4`}>
                                <h3 className="title_2">Body Part</h3>
                                <p>{marketing.bodyPart || 'N/A'}</p>
                            </Col>
                            <Col xs={12} md={6} className={`${classes["form-control"]} d-flex flex-column align-items-left mb-4`}>
                                <h3 className="title_2">Modality</h3>
                                <p>{marketing.modality || 'N/A'}</p>
                            </Col>
                        </Row>
                    )}

                    <Row>
                        <Col xs={12} md={showMedical ? 6 : 12} className={`${classes["form-control"]} d-flex flex-column align-items-left mb-4`}>
                            <h3 className="title_2">Use Cases</h3>
                            <p>{marketing.indications || marketing.useCases || 'N/A'}</p>
                        </Col>
                        {showMedical && (
                            <Col xs={12} md={6} className={`${classes["form-control"]} d-flex flex-column align-items-left mb-4`}>
                                <h3 className="title_2">FDA Compliant</h3>
                                <p>{version?.fda ? 'Yes' : 'No'}</p>
                                {version?.fdaUrl && (
                                    <p><a href={version.fdaUrl} target="_blank" rel="noreferrer">FDA documentation</a></p>
                                )}
                            </Col>
                        )}
                    </Row>

                    <Row>
                        <Col xs={12} className={`${classes["form-control"]} d-flex flex-column align-items-left mb-4`}>
                            <h3 className="title_2">Model Description</h3>
                            <p>{marketing.desc || 'N/A'}</p>
                        </Col>
                    </Row>

                    {marketing.tags.length > 0 && (
                        <Row>
                            <Col xs={12} className={`${classes["form-control"]} d-flex flex-column align-items-left`}>
                                <label>Tags</label>
                                <div className="d-flex flex-wrap gap-2 mt-2">
                                    {marketing.tags.map((tag, index) => (
                                        <Badge bg="primary" key={index} style={{ padding: '8px 12px', borderRadius: '20px' }}>
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </Col>
                        </Row>
                    )}

                    {marketing.features.length > 0 && (
                        <Row>
                            <Col xs={12} className={`${classes["form-control"]} d-flex flex-column align-items-left`}>
                                <label>Key Features</label>
                                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
                                    {marketing.features.map((feat, index) => (
                                        <li key={index} style={{ marginBottom: '8px', color: '#555' }}>
                                            {typeof feat === 'string' ? feat : feat.feature}
                                        </li>
                                    ))}
                                </ul>
                            </Col>
                        </Row>
                    )}

                    {marketing.metrics.length > 0 && (
                        <Row>
                            <Col xs={12} className={`${classes["form-control"]} d-flex flex-column align-items-left`}>
                                <label>Performance Metrics</label>
                                <div className="d-flex flex-wrap gap-3 mt-2">
                                    {marketing.metrics.map((metric, index) => (
                                        <div key={index} style={{ padding: '10px 15px', background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', minWidth: '150px' }}>
                                            <div style={{ fontSize: '0.9rem', color: '#6c757d', fontWeight: 'bold' }}>{metric.metric}</div>
                                            <div style={{ fontSize: '1.2rem', color: '#212529', fontWeight: 'bold' }}>
                                                {metric.value}%
                                            </div>
                                            {metric.metricsUrl && (
                                                <a href={metric.metricsUrl} target="_blank" rel="noreferrer">Details</a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Col>
                        </Row>
                    )}

                    {/* ZERO DB CHANGE FEATURE: Integration Code Snippet
                    {(marketing.category === 'REST API Access' || marketing.category === 'LLMs') && (
                        <Row className="mt-4">
                            <Col xs={12} className={`${classes["form-control"]} d-flex flex-column align-items-left`} style={{ background: '#1e1e1e', color: '#d4d4d4', borderRadius: '10px', padding: '20px' }}>
                                <label style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>Integration Snippet</label>
                                <p style={{ fontSize: '13px', color: '#888', marginBottom: '10px' }}>Use this mock cURL command to integrate the model after purchasing an API key.</p>
                                <pre style={{ background: '#000', padding: '15px', borderRadius: '5px', overflowX: 'auto', fontSize: '13px' }}>
                                    <code>
{`curl -X POST https://api.modellink.io/v1/inference \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model?.title?.replace(/\s+/g, '-').toLowerCase() || 'model-id'}",
    "version": "${marketing.version || '1.0.0'}",
    "inputs": { "text": "Your input data here..." }
}'`}
                                    </code>
                                </pre>
                            </Col>
                        </Row>
                    )} */}
                </Row>
            </Col>
        </Container>
    );
};

export default ModelData;
