import Modal from './Modal';
import classes from './WarningModal.module.scss'


function WarningModal({ warning, onClose, onAction }) {

  return (
    <Modal onClose={onClose} className={classes.warningModalOverlay}>
      <div className={classes.con}>
        <div className={classes.msg}>{warning.message}</div>
        <div className={classes.actionBox}>
          <button onClick={onClose} className="btn-glass-outline">
            {warning.type === 'missing' ? 'Ok' : 'Close'}
          </button>
          {warning.type === 'action' &&
            <button onClick={onAction?.bind(null, warning.id)} className={warning.action.toLowerCase() === 'delete' ? "btn-glass-danger" : "btn-glass-primary"}>
              {warning.action}
            </button >
          }
        </div>
      </div>
    </Modal>
  );
}

export default WarningModal;