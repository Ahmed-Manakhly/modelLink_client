import Classes from './Modal.module.scss';
import ReactDOM from 'react-dom';




const Backdrop = props => {
    return <div onClick={props.onClose} className={Classes.backdrop} />
};

const ModalOverlay = props => {
    return <div className={`${Classes.modal} ${props.className || ''}`} >
        {props.children}
    </div>
};

const portalElement = document.getElementById('overlays');

const Modal = props => {
    return <>
        {ReactDOM.createPortal(<Backdrop onClose={props.onClose} />, portalElement)}
        {ReactDOM.createPortal(<ModalOverlay className={props.className}>{props.children}</ModalOverlay>, portalElement)}
    </>
};

export default Modal;