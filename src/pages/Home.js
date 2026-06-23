import Header from '../components/layout/Header';
import Categories from '../components/Categories';
import PopularServices from '../components/PopularServices';
import Val from '../components/Val'
import Video from '../components/Video'
import Box from '../components/Box'
import img from '../assets/about.jpg'
import { vals } from '../constants/marketingData';
import banner from '../assets/banner_2.png'
import img_2 from '../assets/instructor-1x-v3.jpg'
import { getData, getAllModelsReq, getPublicDevelopersReq, getFiltersReq, getCategoriesReq } from '../lib/loaders';
import { mapParentCategoriesToHomeCards } from '../lib/categoryHelpers';
import { useDispatch } from 'react-redux';
import { uiActions } from '../store/UI-slice';
import { useEffect, useState, useCallback } from 'react';
import TopDevelopersSlider from '../components/TopDevelopersSlider';

const OVERALL_TRENDING_QUERY = '?status=PUBLISHED&sort=-sales,-views&limit=10&';
const FEATURED_MODELS_QUERY = '?status=PUBLISHED&featured=true&sort=-avgRating,-sales&limit=6&';
const PUBLISHED_MODELS_QUERY = '?status=PUBLISHED&limit=500&';
const TOP_CATEGORY_SECTION_COUNT = 4;

const buildCategoryTrendingQuery = (slug) =>
    `?status=PUBLISHED&categoryRel.slug=${encodeURIComponent(slug)}&sort=-sales,-avgRating&limit=6&`;

function Home({ modelsUpdated, onModelsUpdated }) {
    const [models, setModels] = useState([]);
    const [featuredModels, setFeaturedModels] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const [categoryTrendingSections, setCategoryTrendingSections] = useState([]);
    const [topCategoryCards, setTopCategoryCards] = useState([]);
    const dispatch = useDispatch();

    const loadCategoryMarketplaceData = useCallback(async () => {
        try {
            const [filtersRes, parentsRes, publishedRes] = await Promise.all([
                getFiltersReq(),
                getCategoriesReq('?parentId=null&limit=100'),
                getAllModelsReq(PUBLISHED_MODELS_QUERY),
            ]);

            const subcategories = filtersRes.data?.data?.categories || [];
            const parents = parentsRes.data?.data?.categories || [];
            const publishedModels = publishedRes.data?.data?.models || [];

            const countBySlug = {};
            publishedModels.forEach((model) => {
                const slug = model?.categoryRel?.slug;
                if (slug) countBySlug[slug] = (countBySlug[slug] || 0) + 1;
            });

            const topSubcategories = subcategories
                .map((category) => ({
                    slug: category.slug,
                    name: category.name,
                    count: countBySlug[category.slug] || 0,
                }))
                .filter((category) => category.slug && category.count > 0)
                .sort((a, b) => b.count - a.count)
                .slice(0, TOP_CATEGORY_SECTION_COUNT);

            const parentCount = {};
            subcategories.forEach((category) => {
                const parentSlug = category.parent?.slug;
                if (parentSlug) {
                    parentCount[parentSlug] = (parentCount[parentSlug] || 0) + (countBySlug[category.slug] || 0);
                }
            });

            const sortedParentCards = mapParentCategoriesToHomeCards(parents)
                .map((parent) => ({ ...parent, modelCount: parentCount[parent.slug] || 0 }))
                .filter((parent) => parent.modelCount > 0)
                .sort((a, b) => b.modelCount - a.modelCount);

            setTopCategoryCards(sortedParentCards);

            const sectionResults = await Promise.all(
                topSubcategories.map(async ({ slug, name }) => {
                    try {
                        const res = await getAllModelsReq(buildCategoryTrendingQuery(slug));
                        const sectionModels = res.data?.data?.models || [];
                        return sectionModels.length ? { slug, name, models: sectionModels } : null;
                    } catch {
                        return null;
                    }
                })
            );

            setCategoryTrendingSections(sectionResults.filter(Boolean));
        } catch (err) {
            console.error('Failed to load category trending sections:', err);
            setCategoryTrendingSections([]);
            setTopCategoryCards([]);
        }
    }, []);

    const loadHomeData = useCallback((showLoading = true) => {
        const toastHandler = (toast) => {
            dispatch(uiActions.notificationDataChanged(toast))
        }
        const loadingState = showLoading
            ? (state) => dispatch(uiActions.showLoading(state))
            : () => { };
        const notificationState = (state) => {
            dispatch(uiActions.showNotification(state))
        }
        const gettingData = (data) => {
            setModels(data ? data : [])
        }

        getData(() => getAllModelsReq(OVERALL_TRENDING_QUERY), toastHandler, loadingState, notificationState, gettingData, 'list of models!')
        getData(() => getAllModelsReq(FEATURED_MODELS_QUERY), toastHandler, () => { }, () => { }, (data) => setFeaturedModels(data || []), 'featured models!')
        getData(() => getPublicDevelopersReq('limit=12&sort=-createdAt'), toastHandler, () => { }, () => { }, (data) => setDevelopers(data?.users || []), 'top developers!')
        loadCategoryMarketplaceData();
        dispatch(uiActions.showNotification(false))
    }, [dispatch, loadCategoryMarketplaceData]);

    useEffect(() => {
        loadHomeData(true);
    }, [loadHomeData]);

    useEffect(() => {
        if (modelsUpdated) {
            loadHomeData(true);
            onModelsUpdated(false)
        }
    }, [modelsUpdated, loadHomeData, onModelsUpdated])

    return (
        <>
            <Header
                // txt_1='The ModelLink'
                txt_2='A digital marketplace for production-ready AI models'
                txt_3='that facilitates the connection between AI developers'
                banner={banner}
            />
            <Categories categoryCards={topCategoryCards} />
            {featuredModels.length > 0 && (
                <PopularServices
                    models={featuredModels.map((model) => ({ ...model, featured: true }))}
                    title="Featured Models"
                    viewAllLink="/models?featured=true&sort=-avgRating"
                />
            )}
            <PopularServices 
                models={models} 
                title="Top Trending Overall" 
                viewAllLink="/models?sort=-sales"
            />
            {categoryTrendingSections.map(({ slug, name, models: sectionModels }) => (
                <PopularServices
                    key={slug}
                    models={sectionModels}
                    title={`Trending in ${name}`}
                    viewAllLink={`/models?categoryRel.slug=${encodeURIComponent(slug)}`}
                />
            ))}
            <TopDevelopersSlider developers={developers} />

            <Box title={'Welcome to ModelLink!'}
                text_1={"At ModelLink, we're more than just a marketplace. We're a vibrant community where AI developers, researchers, and practitioners converge to build and deploy real-world AI solutions."}
                text_2={"We're on a mission to make production-ready AI models accessible to everyone. Whether you're a seasoned developer or a domain expert, ModelLink is your go-to hub for AI innovation."}
                img={img}
            />
            <Video />
            <Box title={`It’s Your Time!`}
                text_1={'Are you an AI developer with a groundbreaking model? Look no further! Our platform is your gateway to making a difference\n, Find a Real Opportunity for Your AI Model:'}
                title_2={'Domain Expertise:'}
                content_1={"Your AI model can drive real-world impact. Whether it's computer vision, NLP, predictive analytics, or specialized domain models, there's a global market of buyers ready for your solution."}
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

export default Home
