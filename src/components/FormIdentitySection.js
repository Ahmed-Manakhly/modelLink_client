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
        <Row className={`w-100 mb-4 glass-container p-4 ${classes.formSection} ${classes.elevatedSection}`}>
            {/* LEFT: GALLERY UX */}
            <Col xs={12} lg={5} className={classes.layoutCol}>
                <h4 className={`gradient-text ${classes.sectionTitle}`}>Model Gallery</h4>
                <div className={`${classes.img_cover} ${classes.coverWrapper}`}>
                    <input name='cover' type="file" onChange={handleEditMainViewerImage} ref={imgRef} className="d-none" accept="image/*" />
                    <span className={classes.editCoverBtn}>
                        <EditOutlinedIcon className={classes.editCoverIcon} titleAccess="Upload Main Cover" onClick={() => imgRef.current.click()} />
                    </span>
                    <img className={classes.mainViewer} src={selectedGalleryImage} alt="Model Main Viewer" />
                </div>

                <div className={`w-100 ${classes.thumbnailContainer}`}>
                    <div onClick={() => setSelectedImageKey('cover')}
                        className={`${classes.thumbnailBox} ${selectedImageKey === 'cover' ? classes.active : ''}`}>
                        <img src={getCoverPreviewSrc()} alt="cover thumb" />
                    </div>
                    {galleryItems.map((item, idx) => {
                        const isUrl = item.type === 'url';
                        const src = isUrl 
                            ? (item.value.startsWith('http') ? item.value : FILES_BASE_API_URL + item.value)
                            : item.preview;
                        return (
                            <div key={`gal-item-${idx}`} className={`${classes.thumbnailBox} ${selectedImageKey === `gallery-item-${idx}` ? classes.active : ''}`}>
                                <img src={src} onClick={() => setSelectedImageKey(`gallery-item-${idx}`)} alt="thumb" />
                                <div onClick={(e) => { e.stopPropagation(); removeGalleryItem(idx); }} className={classes.removeThumbBtn}>&times;</div>
                            </div>
                        );
                    })}
                    <div onClick={() => galleryInputRef.current?.click()} className={classes.addThumbBtn}>
                        <AddPhotoAlternateIcon />
                    </div>
                </div>

                <div className={classes.fileInputWrapper}>
                    <input ref={galleryInputRef} type="file" multiple accept="image/*" className="d-none" onChange={handleGalleryFiles} />
                </div>
            </Col>

            {/* RIGHT: CORE DETAILS */}
            <Col xs={12} lg={6} className={classes.layoutCol}>
                <h4 className={`gradient-text ${classes.sectionTitle}`}>Core Identity</h4>
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
                        <div className={`${getClasses(false)} ${classes.statusWrapper}`}>
                            <label htmlFor='status'>Status</label>
                            <div className={classes.selectWrapper}>
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
