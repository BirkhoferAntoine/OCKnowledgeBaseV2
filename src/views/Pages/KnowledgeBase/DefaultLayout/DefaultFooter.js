import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
          <div className={"d-flex m-auto align-items-baseline justify-content-center"}>
              <NavLink href="/" to=""><i className="fa fa-linkedin-square fa-lg mx-2 socialBar"></i></NavLink>
              <NavLink href="/" to=""><i className="fa fa-whatsapp fa-lg mx-2 socialBar"></i></NavLink>
              <NavLink href="/" to=""><i className="fa fa-stack-overflow fa-lg mx-2 socialBar"></i></NavLink>
          </div>
          <div className="m-auto">Réalisé par Antoine Birkhofer avec CoreUI for React</div>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
