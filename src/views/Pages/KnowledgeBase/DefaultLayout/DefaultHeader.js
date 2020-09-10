import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, Input, Form } from 'reactstrap';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};
/*{<AppNavbarBrand

  /!* full={{ src: logo, width: 89, height: 25, alt: 'CoreUI Logo' }}
   minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}*!/
/>}*/
class DefaultHeader extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false,
        };
    }

    toggle(toggle = null) {
        toggle === null && this.state.dropdownOpen === true ? toggle = false : toggle = true;
        this.setState({
            dropdownOpen: toggle,
        });
    }
  render() {

    // eslint-disable-next-line
    //const { children, ...attributes } = this.props;

    return (
        <React.Fragment>
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
            <Nav className="d-md-down" navbar>
                <Nav pills>
                    <NavItem className="d-md-down-none px-3">
                        <NavLink to="/knowledgebase" className="nav-link"><i className="icon-home font-weight-bolder font-xl text-primary"/></NavLink>
                    </NavItem>
                    <NavItem className="px-3">
                        <NavLink to="/login" className="nav-link"><i className="icon-user font-weight-bolder font-xl text-primary"/></NavLink>
                    </NavItem>
                    <Dropdown nav isOpen={this.state.dropdownOpen} toggle={() => {}} >
                        <DropdownToggle nav caret onClick={() => this.toggle()}>
                            <i className="icon-folder-alt font-weight-bolder font-xl text-primary"/>
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>
                                <NavLink to="/" className="nav-link">
                                    HTML
                                </NavLink>
                            </DropdownItem>
                            <DropdownItem>
                                <NavLink to="/" className="nav-link">
                                    CSS
                                </NavLink>
                            </DropdownItem>
                            <DropdownItem>
                                <NavLink to="/" className="nav-link">
                                    JavaScript
                                </NavLink>
                            </DropdownItem>
                            <DropdownItem>
                                <NavLink to="/" className="nav-link">
                                    Php
                                </NavLink>
                            </DropdownItem>
                            <DropdownItem>
                                <NavItem className="searchBox">
                                    <Form>
                                        <Input type={'text'} placeholder={'Rechercher'}
                                               onFocus={() => {this.toggle(true)}}
                                        />
                                    </Form>
                                </NavItem>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </Nav>
            </Nav>
        </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
