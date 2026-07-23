import svg1 from '../assets/svg_1.svg'
import svg2 from '../assets/svg_2.svg'
import svg3 from '../assets/svg_3.svg'
import svg4 from '../assets/svg_4.svg'
import svg5 from '../assets/svg_5.svg'
import svg6 from '../assets/svg_6.svg'
import svg7 from '../assets/svg_7.svg'
import svg8 from '../assets/svg_8.svg'

import { FiFileText, FiShield, FiDollarSign, FiHelpCircle, FiInfo, FiUser, FiPackage, FiStar, FiSettings, FiGrid, FiCreditCard, FiMail, FiBriefcase, FiUsers, FiGlobe, FiMap } from 'react-icons/fi';
//--------------------

export const vals = [
  {
    title: 'Access to Advanced Technologies',
    img: svg1,
    description:
      `ModelLink platforms bridge the gap between data providers and seekers. They offer access to cutting-edge AI models, algorithms, and solutions. For your users, this means having a wealth of AI capabilities at their fingertips.`,
  },
  {
    title: 'Efficiency and Process Automation',
    img: svg2,
    description:
      `AI simplifies tasks. Your users—whether developers, researchers, or domain experts—can focus on critical work while basic functions are seamlessly handled by AI. Efficiency gains lead to better outcomes.`,
  },
  {
    title: 'Cost Savings',
    img: svg3,
    description:
      `Implementing AI solutions through exchange platforms can be cost-effective. Users avoid reinventing the wheel and can leverage existing models, reducing development costs across various domains.`,
  },
  {
    title: 'Accelerated Innovation',
    img: svg4,
    description:
      `By democratizing access to diverse datasets and AI models, these platforms fuel innovation across industries. Think of it as a melting pot where ideas collide, leading to breakthroughs and novel applications.`,
  },
  {
    title: 'Scalability and Flexibility',
    img: svg5,
    description:
      `ModelLink platforms allow rapid deployment of solutions. Users can scale their projects without starting from scratch. Flexibility is key in a dynamic field like AI, ensuring rapid adaptation.`,
  },
  {
    title: 'Collaboration and Knowledge Sharing',
    img: svg6,
    description:
      `These platforms foster a collaborative environment. Developers, companies, and domain experts share insights, code, and best practices. Collective learning accelerates overall progress.`,
  },
  {
    title: 'Production-Ready Inference',
    img: svg7,
    description:
      `Deploy sophisticated AI pipelines directly into your existing infrastructure. Our tested models ensure robust performance, eliminating the guesswork from integration and scaling.`,
  },
  {
    title: 'Global AI Talent Network',
    img: svg8,
    description:
      `Connect with verified machine learning engineers and researchers. ModelLink provides the marketplace infrastructure to safely commission bespoke models tailored to your exact business needs.`,
  }
]

export const footerNavData = [
  {
    title: 'For Clients', links: [
      { title: 'How ModelLink Works', to: '/about', icon: <FiInfo /> },
      { title: 'Client Access', to: '/auth?mode=signup&role=client', icon: <FiUser /> },
      { title: 'My Orders', to: '/orders-client', icon: <FiPackage /> },
      { title: 'My Reviews', to: '/reviews-client', icon: <FiStar /> },
      { title: 'Profile Settings', to: '/profileSettings', icon: <FiSettings /> },
      { title: 'Support', to: '/contact', icon: <FiHelpCircle /> },
    ]
  },
  {
    title: 'For Developers', links: [
      { title: 'Developer Portal', to: '/auth?mode=signup&role=developer', icon: <FiGrid /> },
      { title: 'My Dashboard', to: '/dashboard-dev', icon: <FiGrid /> },
      { title: 'My Wallet', to: '/wallet', icon: <FiCreditCard /> },
      { title: 'My Reviews', to: '/reviews-dev', icon: <FiStar /> },
      { title: 'Profile Settings', to: '/profileSettings', icon: <FiSettings /> },
    ]
  },
  {
    title: 'Legal & Policies', links: [
      { title: 'Terms & Conditions', to: '/policy?tab=terms', icon: <FiFileText /> },
      { title: 'Privacy Policy', to: '/policy?tab=privacy', icon: <FiShield /> },
      { title: 'Refund Policy', to: '/policy?tab=refunds', icon: <FiDollarSign /> },
      { title: 'How to Approach', to: '/policy?tab=approach', icon: <FiHelpCircle /> },
    ]
  },
  {
    title: 'Company', links: [
      { title: 'About Us', to: '/about', icon: <FiInfo /> },
      { title: 'Contact Us', to: '/contact', icon: <FiMail /> },
      { title: 'Careers', to: '/about', icon: <FiBriefcase /> },
      { title: 'Partnerships', to: '/contact', icon: <FiUsers /> },
    ]
  },
  {
    title: 'Resources', links: [
      { title: 'Site Directory', to: '/directory', icon: <FiGlobe /> },
      { title: 'XML Sitemap', to: '/sitemap.xml', icon: <FiMap /> },
    ]
  },
]

export const menuList = [
  {
    title: 'Join Us',
    items: [
      { title: 'developer', to: '/auth?role=developer&step=1' },
      { title: 'organization', to: '/auth?role=client&step=1' },
    ]
  }
]

