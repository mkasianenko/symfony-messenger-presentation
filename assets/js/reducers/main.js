import GlobalMessages from './GlobalMessages';
import Products from './Products';
import ProductForm from './ProductForm';

const globalMessages = new GlobalMessages();
const products = new Products();
const productForm = new ProductForm();

export const main = (state = {}, action) => {
    return Object.assign(
        {},
        state,
        products.reduce(state, action),
        globalMessages.reduce(state, action),
        productForm.reduce(state, action)
    );
};
