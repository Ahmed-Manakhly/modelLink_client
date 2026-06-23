/* eslint-disable */
import Controls from '../components/Controls';
import FilterChips from '../components/FilterChips';
import Val from '../components/Val'
import Services from '../components/Services'
import img_2 from '../assets/instructor-1x-v3.jpg'
import Box from '../components/Box'
import { vals } from '../constants/marketingData';
// import banner from '../assets/banner_2.png'
import { useDispatch } from 'react-redux';
import { uiActions } from '../store/UI-slice';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getData, getAllModelsReq, getFiltersReq, getCategoriesReq } from '../lib/loaders';
import { searchBy } from '../utility/Consts';
import { buildModelsApiPath } from '../utility/marketplaceFilters';
import TopDevelopers from './TopDevelopers';


function Models({ modelsUpdated, onModelsUpdated, searchByVal, searchVal }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [models, setModels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterOptions, setFilterOptions] = useState({
        modalities: [],
        bodyParts: [],
        features: [],
        metrics: [],
        parentCategories: [],
    });
    const [pagination, setPagination] = useState({
        page: 1,
        total_pages: 1,
        next_page: false,
        prev_page: false,
        page_data_count: 0,
    });

    const dispatch = useDispatch();
    const setModelsLoading = (state) => setIsLoading(state);
    const goUpHandler = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }
    useEffect(() => {
        goUpHandler()
    }, [models])

    useEffect(() => {
        getFiltersReq()
            .then((res) => {
                const data = res.data?.data || {};
                setFilterOptions((prev) => ({
                    ...prev,
                    modalities: data.modalities || [],
                    bodyParts: data.bodyParts || [],
                    features: data.features || [],
                    metrics: data.metrics || [],
                }));
            })
            .catch((err) => console.error('Failed to load marketplace filters:', err));

        getCategoriesReq('?parentId=null&limit=100')
            .then((res) => {
                const cats = res.data?.data?.categories || [];
                setFilterOptions((prev) => ({
                    ...prev,
                    parentCategories: cats.map((c) => ({ name: c.name, slug: c.slug })),
                }));
            })
            .catch((err) => console.error('Failed to load parent categories:', err));
    }, []);

    const fetchModels = useCallback((page = 1) => {
        const path = buildModelsApiPath(searchParams, page);
        const toastHandler = (toast) => {
            dispatch(uiActions.notificationDataChanged(toast))
        }
        const loadingState = setModelsLoading
        const notificationState = (state) => {
            dispatch(uiActions.showNotification(state))
        }
        const gettingData = (data, res) => {
            setModels(data ? data : [])
            const p = res?.pagination || {};
            setPagination({
                page: p.page || 1,
                total_pages: p.total_pages || 1,
                next_page: Boolean(p.next_Page),
                prev_page: (p.page || 1) > 1,
                page_data_count: p.page_data_count ?? (data?.length || 0),
            });
        }
        getData(() => getAllModelsReq(path), toastHandler, loadingState, notificationState, gettingData, 'list of models!')
        dispatch(uiActions.showNotification(false))
    }, [searchParams, dispatch]);

    useEffect(() => {
        fetchModels(1);
    }, [fetchModels]);

    useEffect(() => {
        if (modelsUpdated) {
            const next = new URLSearchParams();
            if (searchByVal && searchVal) {
                const match = searchBy.find((s) => s.name === searchByVal);
                const field = match?.field || 'search';
                next.set(field, searchVal.trim());
            }
            setSearchParams(next);
            onModelsUpdated(false)
        }
    }, [modelsUpdated, searchByVal, searchVal, setSearchParams, onModelsUpdated])


    const handlePageNumberChange = (page) => {
        if (page !== pagination.page) {
            fetchModels(page);
        }
    };

    const handlePageNext = () => {
        if (pagination.next_page) {
            fetchModels(pagination.page + 1);
        }
    };

    const handlePagePrevious = () => {
        if (pagination.prev_page) {
            fetchModels(pagination.page - 1);
        }
    };

    let activeSearchField = null;
    let activeSearchValue = null;
    for (const option of searchBy) {
        const val = searchParams.get(option.field);
        if (val) {
            activeSearchField = option.name;
            activeSearchValue = val;
            break;
        }
    }

    const isFiltered = Array.from(searchParams.keys()).some(k => k !== 'page' && k !== 'sort');

    let emptyStateTitle = isFiltered ? "No models match your current filters." : "No Available Models Yet..";
    let availableTitle = isFiltered ? "Available Models (Filtered)" : "Available Models..";

    return (
        <>
            {/* <Header
                txt_1='The ModelLink'
                txt_2='Find the right AI models, right away'
                txt_3='You can search ,or filter based on your interests'
                banner={banner}
            /> */}
            <Controls filterOptions={filterOptions} />
            <Services
                models={models}
                isLoading={isLoading}
                title={isLoading ? 'Loading models...' : (models.length === 0 ? emptyStateTitle : availableTitle)}
                pagination={pagination}
                onPageChange={handlePageNumberChange}
                onPageNext={handlePageNext}
                onPagePrevious={handlePagePrevious}
            />

            <TopDevelopers />

            <Box title={`It’s Your Time!`}
                text_1={'Are you an AI developer with a groundbreaking medical solution? Look no further! Our platform is your gateway to making a difference\n, Find a Real Opportunity for Your AI Model:'}
                title_2={'Medical Expertise:'}
                content_1={"Your AI model can drive real-world value across industries. Whether it's computer vision, NLP, predictive ML, or specialized domain models, there's a global buyer market ready for your innovation."}
                title_3={'Monetize Your Expertise:'}
                content_2={"Don't just create — commercialize. Showcase your AI model to developers, companies, and institutions actively seeking production-ready solutions."}
                closure={"Join us as we empower AI practitioners and accelerate the path from model to market."}
                img={img_2}
                action={true}
                actionTo={'/auth?mode=signup'}
                actionTitle={'Join Us Now'}
            />
            <Val products={vals} title={'A growing collection of production-ready AI models at your fingertips'} />
        </>
    )
}

export default Models
