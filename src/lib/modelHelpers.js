/** Primary active version — marketing & pricing live on the version row */
export function getPrimaryVersion(model) {
    if (!model?.versions?.length) return {};
    return model.versions.find((v) => v.isPrimary) || model.versions[0];
}

/** Modality name from the primary (or first) version */
export function getPrimaryVersionModality(model) {
    const version = getPrimaryVersion(model);
    return version.modalityRel?.name || null;
}

/** Canonical indications text; accepts legacy useCases alias */
export function getVersionIndications(version) {
    if (!version) return '';
    return version.indications ?? version.useCases ?? '';
}

/** Resolve a specific version by id, falling back to primary */
export function getVersionById(model, versionId) {
    if (!model?.versions?.length) return {};
    if (versionId == null) return getPrimaryVersion(model);
    const id = Number(versionId);
    return model.versions.find((v) => v.id === id) || getPrimaryVersion(model);
}

/** Public marketing fields shared by product cards and model view summary */
export function getModelMarketingFields(model, versionId = null) {
    const version = versionId != null ? getVersionById(model, versionId) : getPrimaryVersion(model);
    const price = version.price ?? model?.price;
    return {
        category: model?.categoryRel?.name || model?.category || '',
        categorySlug: model?.categoryRel?.slug || '',
        title: model?.title || '',
        desc: model?.desc || '',
        price: price != null ? price : 0,
        deliveryTime: version.deliveryTime ?? model?.deliveryTime,
        version: version.version,
        isPrimary: version.isPrimary,
        useCases: getVersionIndications(version),
        indications: getVersionIndications(version),
        modality: version.modalityRel?.name || null,
        bodyPart: version.bodyPartRel?.name || null,
        fda: version.fda,
        fdaUrl: version.fdaUrl,
        tags: model?.tags || [],
        features: version.features || [],
        metrics: version.metrics || [],
        starFrequency: model?.starFrequency,
        totalStars: model?.totalStars,
        reviewCount: Math.max(model?.reviewCount || 0, model?.starFrequency || 0),
        sales: model?.sales,
        galleryImages: model?.galleryImages || [],
    };
}

export function getModelRating(model) {
    const { totalStars, starFrequency, reviewCount, avgRating } = model || {};
    if (avgRating > 0) return avgRating;
    const count = Math.max(starFrequency || 0, reviewCount || 0);
    if (totalStars > 0 && count > 0) {
        return totalStars / count;
    }
    return 0;
}
