/* eslint-disable react/prop-types */
import Classes from './Modal.module.scss';
import ReactDOM from 'react-dom' ;




const Backdrop = props => {
    return <div onClick={props.onClose} className={Classes.backdrop} />
};

const ModalOverlay = props => {
    return <div className={Classes.modal} >
        {props.children}
    </div>
};

const portalElement = document.getElementById('overlays') ;

const Modal = props => {
    return <>
        {ReactDOM.createPortal(<Backdrop onClose={props.onClose} /> , portalElement)}
        {ReactDOM.createPortal(<ModalOverlay>{props.children}</ModalOverlay> , portalElement)}
    </>
};

export default Modal ;