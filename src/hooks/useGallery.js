import { useState, useRef, useEffect } from 'react';
import { FILES_BASE_API_URL } from '../lib/api';
import imgHolder from '../assets/modelPlaceholder.png';

export const useGallery = (initialCover, initialGallery) => {
    const [file, setFile] = useState(null);
    const existingCover = initialCover;
    const [galleryItems, setGalleryItems] = useState(
        initialGallery.map(url => ({ type: 'url', value: url }))
    );

    const initialGalleryStr = (initialGallery || []).join(',');

    // Stable blob URL for a newly selected cover file (revoke on replace/unmount)
    const [coverBlobUrl, setCoverBlobUrl] = useState(null);
    // Selection by slot key
    const [selectedImageKey, setSelectedImageKey] = useState('cover');

    const coverBlobUrlRef = useRef(null);
    const galleryItemsRef = useRef([]);

    useEffect(() => {
        coverBlobUrlRef.current = coverBlobUrl;
    }, [coverBlobUrl]);

    useEffect(() => {
        galleryItemsRef.current = galleryItems;
    }, [galleryItems]);

    useEffect(() => {
        // Reset state when backend data changes (e.g. after update)
        setFile(null);
        if (coverBlobUrl) {
            URL.revokeObjectURL(coverBlobUrl);
            setCoverBlobUrl(null);
        }
        galleryItemsRef.current.forEach(item => {
            if (item.type === 'file') URL.revokeObjectURL(item.preview);
        });
        setGalleryItems((initialGallery || []).map(url => ({ type: 'url', value: url })));
        setSelectedImageKey('cover');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialCover, initialGalleryStr]);

    useEffect(() => {
        return () => {
            if (coverBlobUrlRef.current) URL.revokeObjectURL(coverBlobUrlRef.current);
            galleryItemsRef.current.forEach(item => {
                if (item.type === 'file') URL.revokeObjectURL(item.preview);
            });
        };
    }, []);

    const getCoverPreviewSrc = () => {
        if (coverBlobUrl) return coverBlobUrl;
        if (existingCover) {
            return existingCover.startsWith('http') ? existingCover : FILES_BASE_API_URL + existingCover;
        }
        return imgHolder;
    };

    const getPreviewForKey = (key) => {
        if (key === 'cover') return getCoverPreviewSrc();
        if (key.startsWith('gallery-item-')) {
            const idx = Number(key.replace('gallery-item-', ''));
            const item = galleryItems[idx];
            if (!item) return imgHolder;
            if (item.type === 'url') {
                return item.value.startsWith('http') ? item.value : FILES_BASE_API_URL + item.value;
            }
            return item.preview;
        }
        return imgHolder;
    };

    const selectedGalleryImage = getPreviewForKey(selectedImageKey);

    const setCoverFile = (newFile) => {
        if (coverBlobUrl) URL.revokeObjectURL(coverBlobUrl);
        const nextUrl = newFile ? URL.createObjectURL(newFile) : null;
        setCoverBlobUrl(nextUrl);
        setFile(newFile);
        setSelectedImageKey('cover');
    };

    const removeGalleryItem = (index) => {
        const cloned = [...galleryItems];
        const removed = cloned.splice(index, 1)[0];
        if (removed && removed.type === 'file') {
            URL.revokeObjectURL(removed.preview);
        }
        setGalleryItems(cloned);
        if (selectedImageKey === `gallery-item-${index}`) {
            setSelectedImageKey('cover');
        } else if (selectedImageKey.startsWith('gallery-item-')) {
            const selectedIdx = Number(selectedImageKey.replace('gallery-item-', ''));
            if (selectedIdx > index) {
                setSelectedImageKey(`gallery-item-${selectedIdx - 1}`);
            }
        }
    };

    const handleGalleryFiles = (e) => {
        const files = Array.from(e.target.files || []);
        const previews = files.map(f => ({ type: 'file', file: f, preview: URL.createObjectURL(f), name: f.name }));
        
        setGalleryItems(prev => {
            return [...prev, ...previews];
        });
        
        if (previews.length > 0) {
            setSelectedImageKey(`gallery-item-${galleryItems.length}`);
        }
        
        e.target.value = '';
    };

    // Derived properties for backward compatibility with form submit logic
    const galleryImages = galleryItems.filter(item => item.type === 'url').map(item => item.value);
    const uploadedGalleryFiles = galleryItems.filter(item => item.type === 'file');

    return {
        file,
        existingCover,
        galleryItems,
        galleryImages,
        uploadedGalleryFiles,
        selectedImageKey,
        selectedGalleryImage,
        setSelectedImageKey,
        setCoverFile,
        setGalleryItems,
        removeGalleryItem,
        handleGalleryFiles,
        getCoverPreviewSrc
    };
};
