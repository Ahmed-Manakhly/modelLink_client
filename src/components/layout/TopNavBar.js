// import logo from '../../assets/logo-black-noSolgan.png'
import logo from '../../assets/LOGO_3.png'
import {Link} from 'react-router-dom';
import classes from './TopNavBar.module.scss' ;
import {searchBy} from '../../utility/Consts' ;
import useInput from '../../hooks/Use-Input';
import {useState , useEffect} from 'react'


//------------------------------------
function TopNavBar({getSearch}) {
  const {hasError : categoryIsInvalid , valueIsValid : categoryIsValid ,value: searchByVal,
    valueChangeHandler : categoryChangeHandler , inputBlurHandler : categoryBlurHandler} = useInput(value => value.trim() !=='' && value.trim() !== "--Search By--") ;

  const {hasError : searchIsInvalid , valueIsValid : searchIsValid ,value: searchVal,
    valueChangeHandler : searchChangeHandler , inputBlurHandler : searchBlurHandler,reset } = useInput(value => value.trim() !=='' && value.trim() !== "") ;

  const categoryClasses = categoryIsInvalid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
  const [show, setShow] = useState(false);
  useEffect(()=>{
    if(searchIsValid && categoryIsValid ) {
      setShow(false)
    }
  } , [searchByVal ,searchVal ,categoryIsValid , searchIsValid])
  const handleClick = ()=>{
    if(categoryIsInvalid || searchIsInvalid ||!searchByVal || !searchVal){
      setShow(true)
    }else if (searchIsValid && categoryIsValid ){
      getSearch(searchByVal , searchVal)
      reset()
    }
  }
  return (
    <div className={classes["header-main"]}>
      <div className={classes["container"]}>
        <Link to='/' className={classes["header-logo"]}>
          <img src={logo} alt="ModelLink's logo" width='200'/>
        </Link>
        <div className={classes["search_container"]} >
          
            {/* ======================================================= */}
            {/* <p htmlFor="category" >Search By</p> */}
            <div className={`${categoryClasses}`} >
                <select  defaultValue={"--Please Choose An Option--"}  id='category' name="category" required
                      onChange={categoryChangeHandler} onBlur={categoryBlurHandler}  className={categoryIsValid?classes.done:null}>
                      {searchBy.map(item => {return <option value={item.name} key={item.code} >{item.name}</option>})}
                </select>
            </div>
            {/* ======================================================= */}
            <div className={classes["header-search-container"]}>
                <input type="search" name="search" className={classes["search-field"]} placeholder="Search for any service..."
                onChange={searchChangeHandler} onBlur={searchBlurHandler} value={searchVal} />
                <Link className={classes["search-btn"]} onClick={handleClick} to={`${(searchByVal && searchVal) ? '/models' : window.location.pathname}`}>
                    <ion-icon name="search-outline"></ion-icon>
                </Link>
            </div>

        </div>
    </div>
        {<p className={`${classes['error-text']}  ${show && classes['vis']}`}>
          {(categoryIsInvalid||!searchByVal)? 'Kindly Choose Any Field to Search in':(searchIsInvalid||!searchVal) ?'Please Enter Any Search Keyword':
          'Kindly Choose Any Field to Search in' }  
        </p>}
  </div>
  )
}

export default TopNavBar