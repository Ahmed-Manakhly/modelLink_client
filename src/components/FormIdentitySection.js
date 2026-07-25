import React, { useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CustomSelect from './ui/CustomSelect';
import { FILES_BASE_API_URL } from '../lib/api';

const FormIdentitySection = ({ classes, thisModel, form, gallery, renderInputRow, renderVersionInputRow, getClasses, handelStatusChange }) => {
    const {
        title, modelNameChangeHandler, modelNameBlurHandler, modelNameIsInvalid,
        categoryId, categoryChangeHandler, categoryBlurHandler, categoryIsInvalid,
        price, priceChangeHandler, priceBlurHandler, priceIsInvalid,
        status, selectedVersion, setIsChanged
    } = form;

    const {
        selectedGalleryImage, setSelectedImageKey,
        getCoverPreviewSrc, galleryItems, removeGalleryItem, handleGalleryFiles, selectedImageKey,
        setCoverFile, setGalleryItems
    } = gallery;

    const imgRef = useRef(null);
    const galleryInputRef = useRef(null);

    const handleEditMainViewerImage = (e) => {
        const newFile = e.target.files[0];
        if (!newFile) return;

        if (selectedImageKey === 'cover') {
            setCoverFile(newFile);
        } else if (selectedImageKey.startsWith('gallery-item-')) {
            const idx = Number(selectedImageKey.replace('gallery-item-', ''));
            
            const newPreview = {
                type: 'file',
                file: newFile,
                preview: URL.createObjectURL(newFile),
                name: newFile.name,
            };
            
            setGalleryItems(prev => {
                const newItems = [...prev];
                const oldItem = newItems[idx];
                if (oldItem && oldItem.type === 'file') {
                    URL.revokeObjectURL(oldItem.preview);
                }
                newItems[idx] = newPreview;
                return newItems;
            });
            // The index stays exactly the same, so selectedImageKey remains `gallery-item-${idx}`
        }
        if (setIsChanged) setIsChanged(true);
        e.target.value = '';
    };

    const dbCategories = form.dbCategories || []; // Or pass via props if not in form

    return (
        <Row className="w-100 mb-4 glass-container p-4" style={{ gap: '20px' }}>
            {/* LEFT: GALLERY UX */}
            <Col xs={12} lg={5} className="d-flex flex-column gap-3">
                <h4 className="gradient-text" style={{ textAlign: 'left', marginBottom: '15px' }}>Model Gallery</h4>
                <div className={`${classes.img_cover} d-flex flex-column align-items-center w-100`} style={{ minHeight: '300px', background: 'var(--gradient-marketing)', border: '1px solid var(--border-glass)', borderRadius: '15px', position: 'relative', overflow: 'hidden', padding: '0' }} >
                    <input name='cover' type="file" onChange={handleEditMainViewerImage} ref={imgRef} style={{ display: 'none' }} accept="image/*" />
                    <span style={{ position: 'absolute', top: 10, right: 10, background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', padding: '5px', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                        <EditOutlinedIcon style={{ color: 'var(--primary)', cursor: 'pointer' }} titleAccess="Upload Main Cover" onClick={() => imgRef.current.click()} />
                    </span>
                    <img src={selectedGalleryImage} alt="Model Main Viewer" style={{ width: '100%', height: '400px', objectFit: 'contain' }} />
                </div>

                <div className="w-100" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px 0' }}>
                    <div onClick={() => setSelectedImageKey('cover')}
                        style={{ width: '80px', height: '80px', flexShrink: 0, cursor: 'pointer', border: selectedImageKey === 'cover' ? '2px solid var(--primary)' : '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                        <img src={getCoverPreviewSrc()} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="cover thumb" />
                    </div>
                    {galleryItems.map((item, idx) => {
                        const isUrl = item.type === 'url';
                        const src = isUrl 
                            ? (item.value.startsWith('http') ? item.value : FILES_BASE_API_URL + item.value)
                            : item.preview;
                        return (
                            <div key={`gal-item-${idx}`} style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0, cursor: 'pointer', border: selectedImageKey === `gallery-item-${idx}` ? '2px solid var(--primary)' : '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                                <img src={src} onClick={() => setSelectedImageKey(`gallery-item-${idx}`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="thumb" />
                                <div onClick={(e) => { e.stopPropagation(); removeGalleryItem(idx); }} style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '0 0 0 5px' }}>&times;</div>
                            </div>
                        );
                    })}
                    <div onClick={() => galleryInputRef.current?.click()} style={{ width: '80px', height: '80px', flexShrink: 0, cursor: 'pointer', border: '2px dashed #ccc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-surface-variant)' }}>
                        <AddPhotoAlternateIcon />
                    </div>
                </div>

                <div className="w-100 d-flex gap-2">
                    <input ref={galleryInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleGalleryFiles} />
                </div>
            </Col>

            {/* RIGHT: CORE DETAILS */}
            <Col xs={12} lg={6} className="d-flex flex-column gap-3">
                <h4 className="gradient-text" style={{ textAlign: 'left', marginBottom: '15px' }}>Core Identity</h4>
                <Row>
                    <Col xs={12}>
                        {renderInputRow('Model Name', 'title', title, title, modelNameChangeHandler, modelNameBlurHandler, modelNameIsInvalid, 'title', 'title', 'text', 'e.g. Advanced Brain Tumor Segmentation')}
                    </Col>
                    <Col xs={12}>
                        {renderInputRow('Model Category (subcategory)', 'categoryId', categoryId, categoryId, categoryChangeHandler, categoryBlurHandler, categoryIsInvalid, 'categoryId', 'categoryId', 'text', '', true, dbCategories)}
                    </Col>
                    <Col xs={12}>
                        {renderVersionInputRow('Model Price (USD)', 'price', selectedVersion?.price, price, priceChangeHandler, priceBlurHandler, priceIsInvalid, 'price', 'price', 'number', '10.00')}
                    </Col>
                    <Col xs={12}>
                        <div className={`${getClasses(false)} d-flex flex-column align-items-left w-100 mb-3`} >
                            <label htmlFor='status'>Status</label>
                            <div style={{ width: '100%', marginTop: '5px' }}>
                                <CustomSelect
                                    options={[{ label: 'DRAFT', value: 'DRAFT' }, { label: 'PUBLISHED', value: 'PUBLISHED' }, { label: 'SUSPENDED', value: 'SUSPENDED' }]}
                                    value={status}
                                    onChange={(val) => handelStatusChange({ target: { value: val } })}
                                    placeholder="Select Status"
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default FormIdentitySection;
