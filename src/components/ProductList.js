import React, { Component } from "react";
import Product from "./Product";
import Title from "./Title";
import { ProductConsumer } from "../context";

export default class ProductList extends Component {
	handleCompanyCheck(event, value) {
		event.persist();
		// console.log(event.target.id);
		// console.log(event.target.checked);

		let id = event.target.id;
		let selected = event.target.checked;

		value.filterByCompany(id, selected);
	}

  render() {
    return (
      <React.Fragment>
        <div className="py-5">
          <div className="container">
            <Title name="our" title="products" />
            <div className="row">
							<div className="col-2 mt-3">
								<ProductConsumer>

									{value => {
										let companies = [];

										let selectedCompanies = [];


										return value.productsAll.map(product => {
											if (!companies.includes(product.company)) {
												companies.push(product.company);

												return (
													<div key={product.company} className="form-check">
														<input defaultChecked={true} onChange={(event) => {this.handleCompanyCheck(event, value)}} className="form-check-input" type="checkbox" id={product.company} value={product.company + "_Check"}/>
														<label className="form-check-label" htmlFor="samsung">{product.company.toUpperCase()}</label>
													</div>
												);
											} else {
												return null;
											}
										});
									}}
								</ProductConsumer>

							</div>
							<div className="col-10 d-flex flex-wrap">
								<ProductConsumer>
									{value => {
										return value.products.map(product => {
											return <Product key={product.id} product={product} />;
										});
									}}
								</ProductConsumer>
							</div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
