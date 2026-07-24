import Header from '../components/layout/Header';
import Categories from '../components/Categories';
import PopularServices from '../components/PopularServices';
import Val from '../components/Val'
import Video from '../components/Video'
import marketingAboutUsImg from '../assets/marketing_about_us.png';
import marketingJoinUsImg from '../assets/marketing_join_us.png';
import { vals } from '../constants/marketingData';
import banner from '../assets/ai-face.png'
import { getData, getAllModelsReq, getPublicDevelopersReq, getFiltersReq, getCategoriesReq } from '../lib/loaders';
import { mapParentCategoriesToHomeCards } from '../lib/categoryHelpers';
import { useDispatch } from 'react-redux';
import { uiActions } from '../store/UI-slice';
import { useEffect, useState, useCallback } from 'react';
import TopDevelopersSlider from '../components/TopDevelopersSlider';
import { SiteSEO } from '../lib/seo';

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
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Error',
                message: err?.response?.data?.message || 'Failed to load category trending sections',
            }));
            dispatch(uiActions.showNotification(true));
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
            <SiteSEO
                title="AI Model Marketplace"
                description="ModelLink is a digital marketplace for production-ready AI models. Discover, purchase, and deploy AI solutions built by expert developers across computer vision, NLP, clinical AI, and more."
                keywords="AI marketplace, buy AI models, machine learning, deep learning, computer vision, NLP, clinical AI, generative AI, model deployment"
                path="/"
            />
            <Header
                // txt_1='The ModelLink'
                txt_2='A digital marketplace for production-ready AI models 🚀'
                txt_3='that facilitates the connection between AI developers'
                banner={banner}
                className="global-page-margin-top"
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
            <Header
                title_1={'Welcome to'}
                title_2={'ModelLink!'}
                txt_1={"A Vibrant Community for AI Developers"}
                txt_3={"We're on a mission to make production-ready AI models accessible to everyone. Whether you're a seasoned developer or a domain expert, ModelLink is your go-to hub for AI innovation."}
                banner={marketingAboutUsImg}
                action={true}
                actionTitle={"About Us"}
                actionTo={"/about"}
                reverse={true}
            />

            <TopDevelopersSlider developers={developers} />

            <Header
                title_1={'It’s Your'}
                title_2={'Time!'}
                txt_1={'Find a Real Opportunity for Your AI Model'}
                txt_3={"Showcase your AI model to developers, companies, and institutions actively seeking production-ready solutions. Join us as we empower AI practitioners and accelerate the path from model to market."}
                banner={marketingJoinUsImg}
                action={true}
                actionTitle={"Join Us Now"}
                actionTo={"/auth?mode=signup"}
            />
            <Val products={vals} title={'A growing collection of production-ready AI models at your fingertips'} />
            <Video />
        </>
    )
}

export default Home
