import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../logo.svg";
import { ButtonContainer } from "./Button";
import styled from "styled-components";

import {ProductConsumer} from './../context';

export default class Navbar extends Component {
	constructor (props) {
		super(props);

		console.log(this);
	}

	onSearchChange(event) {
		// console.log(event.currentTarget.value);
	}

  render() {
    return (
      <NavWrapper className="navbar navbar-expand-sm navbar px-sm-5">
        <Link to="/">
          <img src={logo} alt="store" className="navbar-brand" />
        </Link>
        <ul className="navbar-nav align-items-center">
          <li className="nav-item ml-5">
            <Link to="/" className="nav-link">
              products
            </Link>
          </li>
					<li className="nav-item ml-5">
						<ProductConsumer>
							{value => {
								return (
									<div className="input-group">
										<input onChange={(element) => {value.searchProduct(element)}} type="text" className="form-control" placeholder="Search" aria-label="Search" />
									</div>
								);
							}}

						</ProductConsumer>
					</li>
        </ul>
        <Link to="/cart" className="ml-auto">
          <ButtonContainer>
            <span className="mr-2">
              <i className="fas fa-cart-plus" />
            </span>
            My Cart
          </ButtonContainer>
        </Link>
      </NavWrapper>
    );
  }
}

const NavWrapper = styled.nav`
  background: var(--mainBlue);
  .nav-link {
    color: var(--mainWhite) !important;
    font-size: 1.3rem;
    text-transform: capitalize;
  }
`;
