// import img from '../../assets/LOGO_3.png' ;
import classes from './Footer.module.scss' ;
import {Link} from 'react-router-dom' ;
import robot from '../../assets/chat_bot.png'
//---------------------------------------------------------------------
// const FooterCat = ({title,links})=>{
//   return (
//     <div className={classes["footer-category-box"]}>
//       <h3 className={classes["category-box-title"]}>{title}</h3>
//       {links.map((item,index)=>{return(
//         <Link key={index} to={item.to} className={classes["footer-category-link"]}>{item.title}</Link>
//       )})}
//     </div>
//   )
// }
//-------------------------------------------------------------------------------
const FooterNav = ({title,links })=>{
  return (
    <ul className={classes["footer-nav-list"]}>
    <li className={classes["footer-nav-item"]}>
      <h2 className={classes["nav-title"]}>{title}</h2>
    </li>
    {links.map((item,index)=>{return(
        <li key={index} className={classes["footer-nav-item"]}>
          <Link  to={item.to} className={classes["footer-nav-link"]} >{item.title}</Link>
        </li>
      )})}
  </ul>
  )
}
//-----------------------------------------------------------------------
function Footer({footerCategoriesData , footerNavData }) {
    return (
        <footer>
        {/* {=============================================} */}
        <div className={classes["footer-nav"]}>
          <div className={classes["container"]}>
            {/* {=============================================} */}
            {footerNavData.map((item,index)=>{return(
                <FooterNav key={index}  title={`${item.title}`} links={item.links} />
            )})}
            {/* {=============================================} */}
            <ul className={classes["footer-nav-list"]}>
              <li className={classes["footer-nav-item"]}>
                <h2 className={classes["nav-title"]}>Contact</h2>
              </li>
              <li className={`${classes["footer-nav-item"]} ${classes.flex}`}>
                <div className={classes["icon-box"]}>
                  <ion-icon name="location-outline"></ion-icon>
                </div>
                <address className={`${classes["content"]} ${classes["footer-nav-link"]}`}>
                  419 State XXXX XXXXX XX, New York(NY), 14812, USA
                </address>
              </li>
              <li className={`${classes["footer-nav-item"]} ${classes.flex}`}>
                <div className={classes["icon-box"]}>
                  <ion-icon name="call-outline"></ion-icon>
                </div>
                <Link to="tel:+607936-8058" className={classes["footer-nav-link"]}>(607) 936-8058</Link>
              </li>
              <li className={`${classes["footer-nav-item"]} ${classes.flex}`}>
                <div className={classes["icon-box"]}>
                  <ion-icon name="mail-outline"></ion-icon>
                </div>
                <Link to="mailto:example@gmail.com" className={classes["footer-nav-link"]}>example@gmail.com</Link>
              </li>
            </ul>
          {/* {=============================================} */}
          <div className={`${classes["footer-nav-list"]} ${classes.container} `}>
              <Link to='/models'>
               <img src={robot} alt='models' />
              </Link>

          </div>
          {/* {=============================================} */}
          </div>
        </div>
        {/* {=============================================} */}
        <div className={classes["footer-bottom"]}>
          <div className={classes["container"]}>
            <div className="brand-logo-text" style={{ marginBottom: '15px' }}>
              {/* <img src={img} alt="payment method" className={classes["payment-img"]} /> */}
              Model<span>Link</span>
            </div>
            <p className={classes["copyright"]}>
              Copyright &copy; <Link to="/">The ModelLink</Link> all rights reserved.
            </p>
            <ul className={`${classes["footer-nav-list"]} ${classes.container} `}>
              <li>
                <ul className={classes["social-link"]}>
                  <li className={classes["footer-nav-item"]}>
                    <Link to="/" className={classes["footer-nav-link"]}>
                      <ion-icon name="logo-facebook"></ion-icon>
                    </Link>
                  </li>
                  <li className={classes["footer-nav-item"]}>
                    <Link to="/" className={classes["footer-nav-link"]}>
                      <ion-icon name="logo-twitter"></ion-icon>
                    </Link>
                  </li>
                  <li className={classes["footer-nav-item"]}>
                    <Link to="/" className={classes["footer-nav-link"]}>
                      <ion-icon name="logo-linkedin"></ion-icon>
                    </Link>
                  </li>
                  <li className={classes["footer-nav-item"]}>
                    <Link to="/" className={classes["footer-nav-link"]}>
                      <ion-icon name="logo-instagram"></ion-icon>
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        {/* {=============================================} */}
      </footer>
    )
}

export default Footer