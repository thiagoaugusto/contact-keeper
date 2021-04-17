import React, { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import AlertContext from '../../context/alert/alertContext';

const Alerts = () => {
  const alertContext = useContext(AlertContext);
  const { alerts } = alertContext;

  return (
    <TransitionGroup>
      {alerts.length > 0 &&
        alerts.map((alert) => (
          <CSSTransition key={alert.id} timeout={1000} classNames='item'>
            <div className={`alert alert-${alert.type}`}>
              <i className='fas fa-info-circle' /> {alert.msg}
            </div>
          </CSSTransition>
        ))}
    </TransitionGroup>
  );
};

export default Alerts;
