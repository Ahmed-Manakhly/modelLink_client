import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CustomSelect from './ui/CustomSelect';
import ToggleSwitch from './ToggleSwitch';

const FormVersionSpecsSection = ({
    classes, thisModel, form,
    renderInputRow, renderVersionInputRow, getClasses,
    setNewVersionCode, setNewVersionPrice, setAddVersionError, setShowAddVersionModal,
    handelFdaChange, handelIsActiveChange, handelIsPrimaryChange, handleVersionSelect
}) => {
    const {
        modelVersions, selectedVersionId, price, selectedVersion,
        version, versionChangeHandler, versionBlurHandler, versionIsInvalid,
        deliveryTime, deliveryTimeChangeHandler, deliveryTimeBlurHandler, deliveryTimeIsInvalid,
        showMedicalFields,
        modalityId, modalityChangeHandler, modalityBlurHandler, modalityIsInvalid,
        bodyPartId, bodyPartChangeHandler, bodyPartBlurHandler, bodyPartIsInvalid,
        useCases, handleUseCasesChange, handleUseCasesBlur, useCasesIsInvalid,
        desc, descChangeHandler, descBlurHandler, descIsInvalid,
        fdaUrl, fdaUrlChangeHandler, fdaUrlBlurHandler, fdaUrlIsInvalid,
        fda, isActive, isPrimary, dbModalities, dbBodyParts
    } = form;

    return (
        <Row className="w-100 mb-4 glass-container p-4 d-flex flex-column gap-3">
            <h4 className="gradient-text" style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                {thisModel ? 'Version specifications' : 'Initial version (v1.0.0)'}
                <span style={{ fontSize: '14px', color: 'var(--on-surface-variant)', fontWeight: 'normal', display: 'block', marginTop: '6px' }}>
                    {thisModel
                        ? 'Select a version to edit its public specs. Use Add new version for v2+.'
                        : 'Public specs and delivery assets for your first version. After save you can add more versions on Edit.'}
                </span>
            </h4>
            {thisModel && modelVersions && modelVersions.length >= 1 && (
                <Row className="align-items-end">
                    <Col xs={12} md={6}>
                        <Row className={`${getClasses(false)} d-flex flex-column align-items-left w-100`}>
                            <label htmlFor="versionSelect">Editing Version</label>
                            <CustomSelect
                                options={modelVersions.map((v) => ({
                                    label: `${v.version}${v.isPrimary ? ' (primary)' : ''}${v.isActive === false ? ' [inactive]' : ''}`,
                                    value: String(v.id),
                                }))}
                                value={selectedVersionId != null ? String(selectedVersionId) : ''}
                                onChange={handleVersionSelect}
                                placeholder="Select version to edit"
                            />
                        </Row>
                    </Col>
                    <Col xs={12} md={6} className="mb-3">
                        <button type="button" className="btn-glass-outline" onClick={() => {
                            setNewVersionCode('');
                            setNewVersionPrice(price || String(selectedVersion?.price || ''));
                            setAddVersionError('');
                            setShowAddVersionModal(true);
                        }}>
                            Add new version
                        </button>
                    </Col>
                </Row>
            )}
            <Row>
                <Col xs={12} md={6}>
                    {!thisModel ? (
                        <Row className={`${getClasses(false)} d-flex flex-column align-items-left w-100`}>
                            <label htmlFor="version">Version</label>
                            <p style={{ margin: 0, fontWeight: 600 }}>1.0.0</p>
                            <span style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}>First version is always 1.0.0. Add v1.1.0, v2.0.0, etc. from Edit after save.</span>
                        </Row>
                    ) : (
                        renderVersionInputRow('Version', 'version', selectedVersion?.version, version, versionChangeHandler, versionBlurHandler, versionIsInvalid, 'version', 'version', 'text', '1.0.0')
                    )}
                </Col>
                <Col xs={12} md={6}>
                    {renderVersionInputRow('Delivery Time (Days)', 'deliveryTime', selectedVersion?.deliveryTime, deliveryTime, deliveryTimeChangeHandler, deliveryTimeBlurHandler, deliveryTimeIsInvalid, 'deliveryTime', 'deliveryTime', 'number', '3')}
                </Col>
            </Row>
            {showMedicalFields && (
                <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', marginBottom: '8px' }}>
                    Technical specs — optional fields for medical AI listings (modality, anatomy, regulatory).
                </p>
            )}
            <Row>
                {showMedicalFields && (
                    <>
                        <Col xs={12} md={6}>
                            {renderVersionInputRow('Modality', 'modalityId', selectedVersion?.modalityRel?.name, modalityId, modalityChangeHandler, modalityBlurHandler, modalityIsInvalid, 'modalityId', 'modalityId', 'text', '', true, dbModalities || [])}
                        </Col>
                        <Col xs={12} md={6}>
                            {renderVersionInputRow('Body Part', 'bodyPartId', selectedVersion?.bodyPartRel?.name, bodyPartId, bodyPartChangeHandler, bodyPartBlurHandler, bodyPartIsInvalid, 'bodyPartId', 'bodyPartId', 'text', '', true, dbBodyParts || [])}
                        </Col>
                    </>
                )}
            </Row>
            <Row>
                <Col xs={12} md={6}>
                    {renderVersionInputRow('Use Cases / Intended Application', 'useCases', selectedVersion?.useCases || selectedVersion?.indications, useCases, handleUseCasesChange, handleUseCasesBlur, useCasesIsInvalid, 'useCases', 'useCases', 'textarea', 'Describe intended use cases...')}
                </Col>
                <Col xs={12} md={6}>
                    {renderInputRow('Model Description', 'desc', desc, desc, descChangeHandler, descBlurHandler, descIsInvalid, 'desc', 'desc', 'textarea', 'Description...')}
                </Col>
            </Row>
            <Row>
                {showMedicalFields && (
                    <Col xs={12} md={6}>
                        {renderVersionInputRow('FDA URL', 'fdaUrl', selectedVersion?.fdaUrl, fdaUrl, fdaUrlChangeHandler, fdaUrlBlurHandler, fdaUrlIsInvalid, 'fdaUrl', 'fdaUrl', 'url', 'https://fda.gov/...')}
                    </Col>
                )}
                <Col xs={12} md={6} className="d-flex align-items-center gap-4">
                    {showMedicalFields && <ToggleSwitch type='checkbox' name='fda' value={fda} onChange={handelFdaChange} title='FDA Compliant' checked={fda} id='fda' />}
                    <ToggleSwitch type='checkbox' name='isActive' value={isActive} onChange={handelIsActiveChange} title='Is Active Version' checked={isActive} id='isActive' />
                    <ToggleSwitch type='checkbox' name='isPrimary' value={isPrimary} onChange={handelIsPrimaryChange} title='Is Primary Version' checked={isPrimary} id='isPrimary' />
                </Col>
            </Row>
        </Row>
    );
};

export default FormVersionSpecsSection;
