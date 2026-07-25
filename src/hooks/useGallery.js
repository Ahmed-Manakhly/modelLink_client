import { useState, useRef, useEffect } from 'react';
import { FILES_BASE_API_URL } from '../lib/api';
import imgHolder from '../assets/modelPlaceholder.png';

export const useGallery = (initialCover, initialGallery) => {
    const [file, setFile] = useState(null);
    const existingCover = initialCover;
    const [galleryImages, setGalleryImages] = useState(initialGallery);
    const [uploadedGalleryFiles, setUploadedGalleryFiles] = useState([]);

    // Stable blob URL for a newly selected cover file (revoke on replace/unmount)
    const [coverBlobUrl, setCoverBlobUrl] = useState(null);
    // Selection by slot key — avoids broken URL equality (createObjectURL returns new refs each call)
    const [selectedImageKey, setSelectedImageKey] = useState('cover');

    const coverBlobUrlRef = useRef(null);
    const uploadedGalleryFilesRef = useRef([]);

    useEffect(() => {
        coverBlobUrlRef.current = coverBlobUrl;
    }, [coverBlobUrl]);

    useEffect(() => {
        uploadedGalleryFilesRef.current = uploadedGalleryFiles;
    }, [uploadedGalleryFiles]);

    useEffect(() => {
        return () => {
            if (coverBlobUrlRef.current) URL.revokeObjectURL(coverBlobUrlRef.current);
            // Cleanup gallery previews only on unmount
            uploadedGalleryFilesRef.current.forEach(f => URL.revokeObjectURL(f.preview));
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
        if (key.startsWith('gallery-url-')) {
            const idx = Number(key.replace('gallery-url-', ''));
            const img = galleryImages[idx];
            if (!img) return imgHolder;
            return img.startsWith('http') ? img : FILES_BASE_API_URL + img;
        }
        if (key.startsWith('gallery-file-')) {
            const idx = Number(key.replace('gallery-file-', ''));
            return uploadedGalleryFiles[idx]?.preview || imgHolder;
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

    const removeGalleryImage = (index) => {
        const cloned = [...galleryImages];
        cloned.splice(index, 1);
        setGalleryImages(cloned);
        if (selectedImageKey === `gallery-url-${index}`) {
            setSelectedImageKey('cover');
        } else if (selectedImageKey.startsWith('gallery-url-')) {
            const selectedIdx = Number(selectedImageKey.replace('gallery-url-', ''));
            if (selectedIdx > index) {
                setSelectedImageKey(`gallery-url-${selectedIdx - 1}`);
            }
        }
    };

    const handleGalleryFiles = (e) => {
        const files = Array.from(e.target.files || []);
        const previews = files.map(f => ({ file: f, preview: URL.createObjectURL(f), name: f.name }));
        
        setUploadedGalleryFiles(prev => {
            return [...prev, ...previews];
        });
        
        if (previews.length > 0) {
            setSelectedImageKey(`gallery-file-${uploadedGalleryFiles.length}`);
        }
        
        e.target.value = '';
    };

    const removeUploadedGalleryFile = (index) => {
        const cloned = [...uploadedGalleryFiles];
        URL.revokeObjectURL(cloned[index].preview);
        cloned.splice(index, 1);
        setUploadedGalleryFiles(cloned);
        if (selectedImageKey === `gallery-file-${index}`) {
            setSelectedImageKey('cover');
        } else if (selectedImageKey.startsWith('gallery-file-')) {
            const selectedIdx = Number(selectedImageKey.replace('gallery-file-', ''));
            if (selectedIdx > index) {
                setSelectedImageKey(`gallery-file-${selectedIdx - 1}`);
            }
        }
    };

    return {
        file,
        existingCover,
        galleryImages,
        uploadedGalleryFiles,
        selectedImageKey,
        selectedGalleryImage,
        setSelectedImageKey,
        setCoverFile,
        removeGalleryImage,
        handleGalleryFiles,
        removeUploadedGalleryFile,
        setUploadedGalleryFiles,
        setGalleryImages,
        getCoverPreviewSrc
    };
};
