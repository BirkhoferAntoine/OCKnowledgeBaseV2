import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, } from 'reactstrap';
import PropTypes from 'prop-types';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import { AppSidebarToggler } from '@coreui/react';
// import logo from '../../assets/img/brand/logo.svg'
// import sygnet from '../../assets/img/brand/sygnet.svg'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};
/*{<AppNavbarBrand

  /!* full={{ src: logo, width: 89, height: 25, alt: 'CoreUI Logo' }}
   minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}*!/
/>}*/
class DefaultHeader extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);
    this.onLogout = this.onLogout.bind(this);
  }

  onLogout() {
    const { cookies } = this.props;
    cookies.remove('token');
    window.location.replace("/#/knowledgebase");
    window.location.reload(true);
  }

  render() {

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none font-weight-bolder font-xl text-primary" display="md" mobile />
        <Nav className="d-md-down-none ml-2 mr-auto font-weight-bold p-2 font-2xl text-primary">
          <i className="icon-settings fa-spin p-2"/>
          <NavLink to="/knowledgebase" className="text-primary">
            KNOWLEDGE BASE
          </NavLink>
        </Nav>
        <Nav className="d-lg-none mr-auto font-weight-bold p-2">
          <NavLink to="/knowledgebase" className="nav-link text-primary">
            KNOWLEDGE BASE
          </NavLink>
        </Nav>
        <Nav className="ml-auto p-2" navbar>
          <AppSidebarToggler className="d-md-down-none font-weight-bolder font-xl text-primary" display="lg" />
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle caret className="px-2" nav>
              <i className="icon-user font-2xl p-2 pt-2 bg-dark text-primary"/>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
              <DropdownItem><i className="fa fa-bell-o"/> Updates<Badge color="info">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-envelope-o"/> Messages<Badge color="success">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-tasks"/> Tasks<Badge color="danger">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-comments"/> Comments<Badge color="warning">42</Badge></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
              <DropdownItem><i className="fa fa-user"/> Profile</DropdownItem>
              <DropdownItem><i className="fa fa-wrench"/> Settings</DropdownItem>
              <DropdownItem><i className="fa fa-usd"/> Payments<Badge color="secondary">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-file"/> Projects<Badge color="primary">42</Badge></DropdownItem>
              <DropdownItem divider />
              <DropdownItem><i className="fa fa-shield"/> Lock Account</DropdownItem>
              <DropdownItem onClick={this.onLogout}><i className="fa fa-lock"/> Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default withCookies(DefaultHeader);
