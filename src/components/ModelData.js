import classes from './ModelData.module.scss';
// import { Container, Row, Col, Badge } from 'react-bootstrap';
import { getModelMarketingFields, getVersionById } from '../lib/modelHelpers';

const ModelData = ({ model = null, selectedVersionId }) => {
    const version = getVersionById(model, selectedVersionId);
    const marketing = getModelMarketingFields(model, selectedVersionId);
    const showMedical = Boolean(version?.modalityRel || version?.bodyPartRel || version?.fda || version?.fdaUrl);

    return (
        <div className="my-5 w-100">
            <div className={`${classes["contact-col"]} flex-fill w-100`}>
                <div className="d-flex flex-column justify-content-center align-items-center w-100" style={{ gap: '20px' }}>

                    {showMedical && (
                        <div className="d-flex flex-column flex-md-row w-100 gap-md-4">
                            <div className={`${classes["form-control"]} d-flex flex-column align-items-start mb-4 flex-fill`}>
                                <h3 className="title_2 mb-2">Body Part</h3>
                                <div className="global-read-only-field" style={{ minHeight: 'auto', padding: '12px 15px', fontSize: '15px' }}>
                                    {marketing.bodyPart || 'N/A'}
                                </div>
                            </div>
                            <div className={`${classes["form-control"]} d-flex flex-column align-items-start mb-4 flex-fill`}>
                                <h3 className="title_2 mb-2">Modality</h3>
                                <div className="global-read-only-field" style={{ minHeight: 'auto', padding: '12px 15px', fontSize: '15px' }}>
                                    {marketing.modality || 'N/A'}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="d-flex flex-column flex-md-row w-100 gap-md-4">
                        <div className={`${classes["form-control"]} d-flex flex-column align-items-start mb-4 flex-fill`}>
                            <h3 className="title_2 mb-2">Use Cases</h3>
                            <div className="global-read-only-field" style={{ minHeight: 'auto', padding: '12px 15px', fontSize: '15px' }}>
                                {marketing.indications || marketing.useCases || 'N/A'}
                            </div>
                        </div>
                        {showMedical && (
                            <div className={`${classes["form-control"]} d-flex flex-column align-items-start mb-4 flex-fill`}>
                                <h3 className="title_2 mb-2">FDA Compliant</h3>
                                <div className="global-read-only-field" style={{ minHeight: 'auto', padding: '12px 15px', fontSize: '15px' }}>
                                    <div className="d-flex align-items-center gap-2">
                                        <span>{version?.fda ? 'Yes' : 'No'}</span>
                                        {version?.fdaUrl && (
                                            <a href={version.fdaUrl} target="_blank" rel="noreferrer" style={{ fontSize: '14px', textDecoration: 'underline', color: 'var(--primary)' }}>FDA documentation</a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-100">
                        <div className={`${classes["form-control"]} d-flex flex-column align-items-start mb-4 w-100`}>
                            <h3 className="title_2 mb-2">Model Description</h3>
                            <div className="global-read-only-field" style={{ minHeight: 'auto', padding: '12px 15px', fontSize: '15px' }}>
                                {marketing.desc || 'N/A'}
                            </div>
                        </div>
                    </div>

                    {marketing.tags.length > 0 && (
                        <div className="w-100">
                            <div className={`${classes["form-control"]} d-flex flex-column align-items-start w-100`}>
                                <h3 className="title_2 mb-2">Tags</h3>
                                <div className="d-flex flex-wrap gap-2 mt-2 w-100">
                                    {marketing.tags.map((tag, index) => (
                                        <span key={index} style={{ display: 'inline-block', background: 'transparent', border: '1px solid var(--primary)', padding: '6px 14px', borderRadius: '20px', color: 'var(--primary)', fontWeight: 600, letterSpacing: '0.5px', boxShadow: '0 0 10px rgba(34, 211, 238, 0.2)' }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {marketing.features.length > 0 && (
                        <div className="w-100 mt-4">
                            <div className={`${classes["form-control"]} d-flex flex-column align-items-start w-100`}>
                                <h3 className="title_2 mb-2">Key Features</h3>
                                <div className="global-read-only-field" style={{ minHeight: 'auto', padding: '12px 25px', fontSize: '15px' }}>
                                    <ul style={{ listStyleType: 'disc', margin: 0, paddingLeft: '20px', width: '100%' }}>
                                        {marketing.features.map((feat, index) => (
                                            <li key={index} style={{ marginBottom: '8px' }}>
                                                {typeof feat === 'string' ? feat : feat.feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {marketing.metrics.length > 0 && (
                        <div className="w-100 mt-4">
                            <div className={`${classes["form-control"]} d-flex flex-column align-items-start w-100`}>
                                <h3 className="title_2 mb-2">Performance Metrics</h3>
                                <div className="d-flex flex-wrap gap-3 mt-2 w-100">
                                    {marketing.metrics.map((metric, index) => (
                                        <div key={index} className="global-read-only-field" style={{ minHeight: 'auto', padding: '15px 20px', minWidth: '150px', flex: '0 1 auto', alignItems: 'flex-start' }}>
                                            <div style={{ fontSize: '0.95rem', color: 'var(--sonic-silver)', fontWeight: '600', marginBottom: '8px' }}>{metric.metric}</div>
                                            <div style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                                                {metric.value}%
                                            </div>
                                            {metric.metricsUrl && (
                                                <a href={metric.metricsUrl} target="_blank" rel="noreferrer" style={{ marginTop: '8px', fontSize: '13px', textDecoration: 'underline', color: 'var(--primary)' }}>Details</a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
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
                </div>
            </div>
        </div>
    );
};

export default ModelData;
