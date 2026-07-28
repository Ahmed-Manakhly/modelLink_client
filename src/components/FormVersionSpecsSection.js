import React from 'react';
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
        <div className={`w-100 mb-4 glass-container p-4 ${classes.formSection}`}>
            <h4 className={`gradient-text ${classes.sectionTitle}`}>
                {thisModel ? 'Version specifications' : 'Initial version (v1.0.0)'}
                <span className={classes.subtitle}>
                    {thisModel
                        ? 'Select a version to edit its public specs. Use Add new version for v2+.'
                        : 'Public specs and delivery assets for your first version. After save you can add more versions on Edit.'}
                </span>
            </h4>
            {thisModel && modelVersions && modelVersions.length >= 1 && (
                <div className={`${classes.assetRow} align-items-end`}>
                    <div className={classes.flexFill}>
                        <div className={`${getClasses(false)} ${classes.statusWrapper}`}>
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
                        </div>
                    </div>
                    <div className={`${classes.flexFill} mb-3`}>
                        <button type="button" className="btn-glass-outline" onClick={() => {
                            setNewVersionCode('');
                            setNewVersionPrice(price || String(selectedVersion?.price || ''));
                            setAddVersionError('');
                            setShowAddVersionModal(true);
                        }}>
                            Add new version
                        </button>
                    </div>
                </div>
            )}
            <div className={classes.assetRow}>
                <div className={classes.flexFill}>
                    {!thisModel ? (
                        <div className={`${getClasses(false)} ${classes.statusWrapper}`}>
                            <label htmlFor="version">Version</label>
                            <p className={classes.versionLabel}>1.0.0</p>
                            <span className={classes.versionHint}>First version is always 1.0.0. Add v1.1.0, v2.0.0, etc. from Edit after save.</span>
                        </div>
                    ) : (
                        renderVersionInputRow('Version', 'version', selectedVersion?.version, version, versionChangeHandler, versionBlurHandler, versionIsInvalid, 'version', 'version', 'text', '1.0.0')
                    )}
                </div>
                <div className={classes.flexFill}>
                    {renderVersionInputRow(<span>Delivery Time (Days) <span style={{ color: 'var(--primary)', fontSize: '0.8em', fontWeight: 'bold' }}> (FOR VERSION {selectedVersion?.version || 'NEW'})</span></span>, 'deliveryTime', selectedVersion?.deliveryTime, deliveryTime, deliveryTimeChangeHandler, deliveryTimeBlurHandler, deliveryTimeIsInvalid, 'deliveryTime', 'deliveryTime', 'number', '3')}
                </div>
            </div>
            {showMedicalFields && (
                <p className={classes.sectionHint}>
                    Technical specs — optional fields for medical AI listings (modality, anatomy, regulatory).
                </p>
            )}
            <div className={classes.assetRow}>
                {showMedicalFields && (
                    <>
                        <div className={classes.flexFill}>
                            {renderVersionInputRow(<span>Modality <span style={{ color: 'var(--primary)', fontSize: '0.8em', fontWeight: 'bold' }}> (FOR VERSION {selectedVersion?.version || 'NEW'})</span></span>, 'modalityId', selectedVersion?.modalityRel?.name, modalityId, modalityChangeHandler, modalityBlurHandler, modalityIsInvalid, 'modalityId', 'modalityId', 'text', '', true, dbModalities || [])}
                        </div>
                        <div className={classes.flexFill}>
                            {renderVersionInputRow(<span>Body Part <span style={{ color: 'var(--primary)', fontSize: '0.8em', fontWeight: 'bold' }}> (FOR VERSION {selectedVersion?.version || 'NEW'})</span></span>, 'bodyPartId', selectedVersion?.bodyPartRel?.name, bodyPartId, bodyPartChangeHandler, bodyPartBlurHandler, bodyPartIsInvalid, 'bodyPartId', 'bodyPartId', 'text', '', true, dbBodyParts || [])}
                        </div>
                    </>
                )}
            </div>
            <div className={classes.assetRow}>
                <div className={classes.flexFill}>
                    {renderVersionInputRow(<span>Use Cases / Intended Application <span style={{ color: 'var(--primary)', fontSize: '0.8em', fontWeight: 'bold' }}> (FOR VERSION {selectedVersion?.version || 'NEW'})</span></span>, 'useCases', selectedVersion?.useCases || selectedVersion?.indications, useCases, handleUseCasesChange, handleUseCasesBlur, useCasesIsInvalid, 'useCases', 'useCases', 'textarea', 'Describe intended use cases...')}
                </div>
                <div className={classes.flexFill}>
                    {renderInputRow('Model Description', 'desc', desc, desc, descChangeHandler, descBlurHandler, descIsInvalid, 'desc', 'desc', 'textarea', 'Description...')}
                </div>
            </div>
            <div className={classes.assetRow}>
                {showMedicalFields && (
                    <div className={classes.flexFill}>
                        {renderVersionInputRow(<span>FDA URL <span style={{ color: 'var(--primary)', fontSize: '0.8em', fontWeight: 'bold' }}> (FOR VERSION {selectedVersion?.version || 'NEW'})</span></span>, 'fdaUrl', selectedVersion?.fdaUrl, fdaUrl, fdaUrlChangeHandler, fdaUrlBlurHandler, fdaUrlIsInvalid, 'fdaUrl', 'fdaUrl', 'url', 'https://fda.gov/...')}
                    </div>
                )}
                <div className={`${classes.flexFill} ${classes.toggleWrapper}`}>
                    {showMedicalFields && <ToggleSwitch type='checkbox' name='fda' value={fda} onChange={handelFdaChange} title='FDA Compliant' checked={fda} id='fda' />}
                    <ToggleSwitch type='checkbox' name='isActive' value={isActive} onChange={handelIsActiveChange} title='Is Active Version' checked={isActive} id='isActive' />
                    <ToggleSwitch type='checkbox' name='isPrimary' value={isPrimary} onChange={handelIsPrimaryChange} title='Is Primary Version' checked={isPrimary} id='isPrimary' />
                </div>
            </div>
        </div>
    );
};

export default FormVersionSpecsSection;
