import classes from './Footer.module.scss';
import { RiRobot2Line } from "react-icons/ri";
import { Link } from 'react-router-dom';
import headerClasses from './Header.module.scss';
import { useState, useEffect } from 'react';
import { getCategoriesReq } from '../../lib/loaders';
import { buildCategoriesList } from '../../lib/categoryHelpers';
import GlobalWrapper from './GlobalWrapper';
import { FiShield } from 'react-icons/fi';
//---------------------------------------------------------------------
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
            {item.to.endsWith('.xml') ? (
              <a href={item.to} className={classes["footer-nav-link"]} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {item.icon && <span style={{ display: 'flex', fontSize: '1rem', color: 'var(--primary)' }}>{item.icon}</span>}
                {item.title}
              </a>
            ) : (
              <Link to={item.to} className={classes["footer-nav-link"]} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {item.icon && <span style={{ display: 'flex', fontSize: '1rem', color: 'var(--primary)' }}>{item.icon}</span>}
                {item.title}
              </Link>
            )}
          </li>
        )
      })}
    </ul>
  )
}
//-----------------------------------------------------------------------
function Footer({ footerNavData }) {
  const [categoriesList, setCategoriesList] = useState([]);
  useEffect(() => {
    getCategoriesReq('?parentId=null&limit=5')
      .then((res) => {
        const dbCategories = res.data?.data?.categories || [];
        setCategoriesList(buildCategoriesList(dbCategories));
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="global-section-spacing-top">
      {/* {=============================================} */}
      <div className={classes["footer-nav"]}>
        <GlobalWrapper>
          <div className={classes["footer-content"]}>
            {/* Dynamic Categories */}
            <ul className={classes["footer-nav-list"]}>
              <li className={classes["footer-nav-item"]}>
                <h2 className={classes["nav-title"]}>
                  <span className={headerClasses["gradientText"]}>Categories</span>
                </h2>
              </li>
              {categoriesList.slice(0, 12).map((cat, i) => {
                const linkUrl = cat.title === 'AI Models'
                  ? '/models'
                  : `/models?categoryParentSlug=${cat.slug || cat.title.toLowerCase().replace(/ /g, '-')}`;
                return (
                  <li key={i} className={classes["footer-nav-item"]}>
                    <Link to={linkUrl} className={classes["footer-nav-link"]} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {cat.title === 'AI Models' ? (
                        <span style={{ display: 'flex', fontSize: '1.2rem', color: 'var(--primary)' }}><RiRobot2Line /></span>
                      ) : cat.img ? (
                        <img src={cat.img} alt={cat.title} style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                      ) : null}
                      {cat.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
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
                  <span className={headerClasses["gradientText"]}>Support</span>
                </h2>
              </li>
              <li className={`${classes["footer-nav-item"]} ${classes.flex}`}>
                <div className={classes["icon-box"]}>
                  <ion-icon name="location-outline"></ion-icon>
                </div>
                <address className={`${classes["content"]} ${classes["footer-nav-link"]}`}>
                  100 Innovation Drive, Tech Park,<br /> San Francisco, CA 94105, USA
                </address>
              </li>
              <li className={`${classes["footer-nav-item"]} ${classes.flex}`}>
                <div className={classes["icon-box"]}>
                  <ion-icon name="call-outline"></ion-icon>
                </div>
                <Link to="tel:+14155550198" className={classes["footer-nav-link"]}>+1 (415) 555-0198</Link>
              </li>
              <li className={`${classes["footer-nav-item"]} ${classes.flex}`}>
                <div className={classes["icon-box"]}>
                  <ion-icon name="mail-outline"></ion-icon>
                </div>
                <Link to="mailto:support@modellink.com" className={classes["footer-nav-link"]}>support@modellink.com</Link>
              </li>
            </ul>
            {/* {=============================================} */}
            <ul className={classes["footer-nav-list"]} style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <li>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                  <RiRobot2Line style={{ fontSize: '60px', color: 'var(--primary)', marginBottom: '10px', filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.4))' }} />
                </div>
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
          </div>
        </GlobalWrapper>
      </div>
      {/* {=============================================} */}
      <div className={classes["footer-bottom"]}>
        <GlobalWrapper>
          <div className={classes["footer-content"]} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div className="brand-logo-text" style={{ marginBottom: 0 }}>
                Model<span>Link</span>
              </div>
              <span style={{ color: 'var(--sonic-silver)', fontSize: '0.9rem' }}>Copyright &copy; {new Date().getFullYear()} The ModelLink all rights reserved.</span>
            </div>

            <div className={classes["copyright"]} style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/policy" className="legal-link" style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>
                <FiShield style={{ marginRight: '5px', fontSize: '1rem' }} />
                Policies
              </Link>
            </div>
            <ul className={`${classes["footer-nav-list"]} `} style={{ margin: 0, padding: 0 }}>
              <li>
                <ul className={classes["social-link"]} style={{ margin: 0 }}>
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
        </GlobalWrapper>
      </div>
      {/* {=============================================} */}
    </footer>
  )
}

export default Footer