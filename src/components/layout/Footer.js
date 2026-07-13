// import img from '../../assets/LOGO_3.png' ;
import classes from './Footer.module.scss';
import { Link } from 'react-router-dom';
import aiFace from '../../assets/ai-face.png'
import headerClasses from './Header.module.scss';
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
const FooterNav = ({ title, links }) => {
  return (
    <ul className={classes["footer-nav-list"]}>
      <li className={classes["footer-nav-item"]}>
        <h2 className={classes["nav-title"]}>
          <span className={headerClasses["gradientText"]}>{title}</span>
        </h2>
      </li>
      {links.map((item, index) => {
        return (
          <li key={index} className={classes["footer-nav-item"]}>
            <Link to={item.to} className={classes["footer-nav-link"]} >{item.title}</Link>
          </li>
        )
      })}
    </ul>
  )
}
//-----------------------------------------------------------------------
function Footer({ footerCategoriesData, footerNavData }) {
  return (
    <footer className="global-section-spacing-top">
      {/* {=============================================} */}
      <div className={classes["footer-nav"]}>
        <div className={classes["container"]}>
          {/* {=============================================} */}
          {footerNavData.map((item, index) => {
            return (
              <FooterNav key={index} title={`${item.title}`} links={item.links} />
            )
          })}
          {/* {=============================================} */}
          <ul className={classes["footer-nav-list"]}>
            <li className={classes["footer-nav-item"]}>
              <h2 className={classes["nav-title"]}>
                <span className={headerClasses["gradientText"]}>Contact</span>
              </h2>
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
          <ul className={classes["footer-nav-list"]} style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
            <li>
              <h2 className={headerClasses["gradientText"]} style={{ fontSize: '24px', fontWeight: '800', lineHeight: '1.2' }}>
                Join the AI<br />Revolution
              </h2>
            </li>
            <li>
              <p style={{ color: 'var(--sonic-silver)', fontSize: '14px', lineHeight: '1.5' }}>
                Start building and scaling production-ready models today.
              </p>
            </li>
            <li style={{ marginTop: '10px' }}>
              <Link to="/auth?mode=signup" className="btn-glass-primary" style={{ display: 'inline-block', width: 'fit-content' }}>
                Create Account
              </Link>
            </li>
          </ul>
          {/* {=============================================} */}
          <div className={`${classes["footer-nav-list"]} ${classes.container} `}>
            <Link to='/models'>
              <img src={aiFace} alt='models' style={{ width: '250px', filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.2))', transform: 'translateX(-50px)' }} />
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
            Copyright &copy; {new Date().getFullYear()} <Link to="/">The ModelLink</Link> all rights reserved.
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                    </svg>
                  </Link>
                </li>
                <li className={classes["footer-nav-item"]}>
                  <Link to="/" className={classes["footer-nav-link"]}>
                    <ion-icon name="logo-instagram"></ion-icon>
                  </Link>
                </li>
                <li className={classes["footer-nav-item"]}>
                  <Link to="/" className={classes["footer-nav-link"]}>
                    <ion-icon name="logo-linkedin"></ion-icon>
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