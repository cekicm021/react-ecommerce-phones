import React, { Component } from "react";
import { storeProducts, detailProduct } from "./data";
const ProductContext = React.createContext();

class ProductProvider extends Component {
	constructor (props) {
		super(props);

		this.state = {
			products: [],
			productsAll: [],
			productsChecked: [],
			detailProduct: detailProduct,
			cart: [],
			modalOpen: false,
			modalProduct: detailProduct,
			cartSubTotal: 0,
			cartTax: 0,
			cartTotal: 0
		};
	}

	componentDidMount() {
    this.setProducts();
  }

	filterByCompany = (id, selected) => {
		// console.log(this.state.productsAll);
		// console.log(this.state.products);

		let allProducts = JSON.parse(JSON.stringify(this.state.productsAll));
		let currentProducts = JSON.parse(JSON.stringify(this.state.products));

		// console.log(currentProducts[0].company === "GOOGLE");
		console.log(currentProducts);

		let indexesToRemove = [];

		if (!selected) {
			for (let i = currentProducts.length - 1; i >= 0; i--) {
				if ( currentProducts[i].company.toLowerCase() === id.toLowerCase() ) {
					currentProducts.splice(i, 1);
				}
			}
		} else {
			for (let product of allProducts) {
				if (product.company.toLowerCase() === id.toLowerCase()) {
					currentProducts.push(product);
				}
			}
		}
		this.sortProducts(currentProducts);
		this.setState({products: currentProducts, productsChecked: currentProducts});
	};

	sortProducts(array) {
		return array.sort((a, b) => (a.company.toLowerCase() > b.company.toLowerCase()) ? 1 : ((b.company.toLowerCase() > a.company.toLowerCase()) ? -1 : 0));
	}

	clearSearch = () => {
		this.setState({products: this.state.productsChecked});
	};

	filterBySearch = (searchText) => {
		console.log(this.state);

		searchText = searchText.currentTarget.value;

		let searchedProducts = [];

		this.setState({products: this.state.productsChecked}, () => {
			searchedProducts = JSON.parse(JSON.stringify(this.state.products));

			searchedProducts = searchedProducts.filter((element) => {
				let elTitle = element.title.toLowerCase();
				let searchTitle = searchText.toLowerCase();

				return elTitle.includes(searchTitle);
			});

			console.log(searchedProducts);
			this.setState({
				products: searchedProducts
			});
		});
	};

  setProducts = () => {
    let products = [];

    storeProducts.forEach(item => {
      const singleItem = { ...item };
      products = [...products, singleItem];
    });

    products = this.sortProducts(products);

    this.setState({
			products: products,
			productsAll: products,
			productsChecked: products
		}, () => {console.log(this.state.products)});
  };

  getItem = id => {
    const product = this.state.products.find(item => item.id === id);
    return product;
  };
  handleDetail = id => {
    const product = this.getItem(id);
    this.setState(() => {
      return { detailProduct: product };
    });
  };
  addToCart = id => {
    let tempProducts = [...this.state.products];
    const index = tempProducts.indexOf(this.getItem(id));
    const product = tempProducts[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;

    this.setState(() => {
      return {
        products: [...tempProducts],
        cart: [...this.state.cart, product],
        detailProduct: { ...product }
      };
    }, this.addTotals);
  };
  openModal = id => {
    const product = this.getItem(id);
    this.setState(() => {
      return { modalProduct: product, modalOpen: true };
    });
  };
  closeModal = () => {
    this.setState(() => {
      return { modalOpen: false };
    });
  };
  increment = id => {
    let tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find(item => {
      return item.id === id;
    });
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    product.count = product.count + 1;
    product.total = product.count * product.price;
    this.setState(() => {
      return {
        cart: [...tempCart]
      };
    }, this.addTotals);
  };
  decrement = id => {
    let tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find(item => {
      return item.id === id;
    });
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    product.count = product.count - 1;
    if (product.count === 0) {
      this.removeItem(id);
    } else {
      product.total = product.count * product.price;
      this.setState(() => {
        return { cart: [...tempCart] };
      }, this.addTotals);
    }
  };
  getTotals = () => {
    // const subTotal = this.state.cart
    //   .map(item => item.total)
    //   .reduce((acc, curr) => {
    //     acc = acc + curr;
    //     return acc;
    //   }, 0);
    let subTotal = 0;
    this.state.cart.map(item => (subTotal += item.total));
    const tempTax = subTotal * 0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    return {
      subTotal,
      tax,
      total
    };
  };
  addTotals = () => {
    const totals = this.getTotals();
    this.setState(
      () => {
        return {
          cartSubTotal: totals.subTotal,
          cartTax: totals.tax,
          cartTotal: totals.total
        };
      },
      () => {
        // console.log(this.state);
      }
    );
  };
  removeItem = id => {
    let tempProducts = [...this.state.products];
    let tempCart = [...this.state.cart];

    const index = tempProducts.indexOf(this.getItem(id));
    let removedProduct = tempProducts[index];
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;

    tempCart = tempCart.filter(item => {
      return item.id !== id;
    });

    this.setState(() => {
      return {
        cart: [...tempCart],
        products: [...tempProducts]
      };
    }, this.addTotals);
  };
  clearCart = () => {
    this.setState(
      () => {
        return { cart: [] };
      },
      () => {
        this.setProducts();
        this.addTotals();
      }
    );
  };
  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart,
					filterByCompany: this.filterByCompany,
					searchProduct: this.filterBySearch,
					clearSearch: this.clearSearch
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
