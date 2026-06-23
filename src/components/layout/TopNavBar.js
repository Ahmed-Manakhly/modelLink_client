// import logo from '../../assets/logo-black-noSolgan.png'
// import logo from '../../assets/LOGO_3.png'
import { Link, useNavigate } from 'react-router-dom';
import classes from './TopNavBar.module.scss';
import { searchBy } from '../../utility/Consts';
import useInput from '../../hooks/Use-Input';
import { useState, useEffect, useRef, useCallback } from 'react';
import CustomSelect from '../ui/CustomSelect';
import { useDispatch } from 'react-redux';
import { getTagsReq, getAllModelsReq } from '../../lib/loaders';
import { uiActions } from '../../store/UI-slice';
import { getRecentSearches, saveRecentSearch } from '../../utility/recentSearches';


//------------------------------------
function TopNavBar({ getSearch }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchWrapRef = useRef(null);
  const debounceRef = useRef(null);
  const tagsScrollRef = useRef(null);
  const { hasError: categoryIsInvalid, valueIsValid: categoryIsValid, value: searchByVal,
    valueChangeHandler: categoryChangeHandler } = useInput(value => value.trim() !== '' && value.trim() !== "--Search By--");

  const { hasError: searchIsInvalid, valueIsValid: searchIsValid, value: searchVal,
    valueChangeHandler: searchChangeHandler, inputBlurHandler: searchBlurHandler, reset } = useInput(value => value.trim() !== '' && value.trim() !== "");

  const [dynamicTags, setDynamicTags] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    getTagsReq('', 1000)
      .then((res) => setDynamicTags(res.data?.data?.tags || []))
      .catch(() => { });
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const runSearch = useCallback((fieldName, keyword) => {
    const match = searchBy.find((item) => item.name === fieldName || item.field === fieldName);
    const field = match?.field || fieldName;
    if (!field || !keyword?.trim()) return;

    saveRecentSearch(field, keyword.trim());
    setRecentSearches(getRecentSearches());
    navigate(`/models?${field}=${encodeURIComponent(keyword.trim())}`);
    getSearch?.(match?.name || fieldName, keyword);
    reset();
    setShowDropdown(false);
    setSuggestions([]);
  }, [getSearch, navigate, reset]);

  const handleClick = (e) => {
    if (!searchVal || searchIsInvalid) {
      e.preventDefault();
      dispatch(uiActions.notificationDataChanged({ status: 'error', message: 'Please Enter Any Search Keyword', title: 'Invalid Search' }));
      dispatch(uiActions.showNotification(true));
      return;
    }

    // Default to 'Search Any' if no category is selected
    const selectedCategory = (categoryIsInvalid || !searchByVal || searchByVal === "--Please Choose An Option--") 
      ? "Search Any" 
      : searchByVal;

    const match = searchBy.find((item) => item.name === selectedCategory);
    runSearch(match?.name || selectedCategory, searchVal);
  };

  const handleSearchFocus = () => {
    setRecentSearches(getRecentSearches());
    setShowDropdown(true);
  };

  const handleSearchInput = (e) => {
    searchChangeHandler(e);
    const value = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await getAllModelsReq(`?search=${encodeURIComponent(value.trim())}&limit=5`);
        const models = res.data?.data?.models || res.data?.data || [];
        setSuggestions(models.map((model) => ({
          id: model.id,
          title: model.title,
          query: value.trim(),
        })));
      } catch {
        setSuggestions([]);
      }
    }, 300);
  };

  const scrollTags = (direction) => {
    if (tagsScrollRef.current) {
      const scrollAmount = 250;
      tagsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={classes["header-main"]}>
      <div className={classes["container"]}>
        <Link to='/' className="brand-logo-text">
          {/* <img src={logo} alt="ModelLink's logo" width='200'/> */}
          Model<span>Link</span>
        </Link>
        <div className={classes["search_container"]} ref={searchWrapRef}>

          {/* ======================================================= */}
          {/* <p htmlFor="category" >Search By</p> */}
          <div className={classes["select_container"]}>
            <CustomSelect
              options={searchBy.map(item => ({ label: item.name, value: item.name }))}
              value={searchByVal}
              onChange={(val) => categoryChangeHandler({ target: { value: val } })}
              placeholder="--Please Choose An Option--"
              isWeb={true}
              flatRight={true}
            />
          </div>
          {/* ======================================================= */}
          <div className={classes["header-search-container"]}>
            <input
              type="search"
              name="search"
              className={classes["search-field"]}
              placeholder={searchByVal?.startsWith('Exact') ? `Enter ${searchByVal.toLowerCase()}...` : "Search for any service or keyword..."}
              onChange={handleSearchInput}
              onFocus={handleSearchFocus}
              onBlur={searchBlurHandler}
              value={searchVal}
            />
            <button type="button" className={classes["search-btn"]} onClick={handleClick}>
              <ion-icon name="search-outline"></ion-icon>
            </button>
            {showDropdown && (recentSearches.length > 0 || suggestions.length > 0) && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                zIndex: 20,
                maxHeight: '240px',
                overflowY: 'auto',
              }}>
                {recentSearches.length > 0 && (
                  <div style={{ padding: '8px 12px', fontSize: '12px', color: '#666', borderBottom: '1px solid #eee' }}>
                    Recent searches
                  </div>
                )}
                {recentSearches.map((item, index) => (
                  <button
                    key={`recent-${index}`}
                    type="button"
                    onMouseDown={() => runSearch(item.field, item.value)}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                  >
                    {item.value}
                  </button>
                ))}
                {suggestions.length > 0 && (
                  <div style={{ padding: '8px 12px', fontSize: '12px', color: '#666', borderBottom: '1px solid #eee' }}>
                    Suggestions
                  </div>
                )}
                {suggestions.map((item) => (
                  <button
                    key={`suggest-${item.id}`}
                    type="button"
                    onMouseDown={() => navigate(`/models/view/${item.id}`)}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      <div className={classes.trendingBar}>
        <div className={`${classes.trendingInner}`}>
          <span className={classes.trendingLabel}>Trending:</span>
          
          <button type="button" className={classes.scrollBtn} onClick={() => scrollTags('left')}>
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>

          <div className={classes.trendingTagsScroll} ref={tagsScrollRef}>
            {dynamicTags.length === 0 && <span className={classes.trendingPlaceholder}>Waiting for data to be seeded...</span>}
            {dynamicTags.map((tag, i) => (
              <Link to={`/models?tags=${encodeURIComponent(tag)}`} key={i} className={classes.trendingLink}>
                {tag}
              </Link>
            ))}
          </div>

          <button type="button" className={classes.scrollBtn} onClick={() => scrollTags('right')}>
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TopNavBar
