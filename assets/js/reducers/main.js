import GlobalMessages from './GlobalMessages';
import Products from './Products';
import Forms from './Forms';

const globalMessages = new GlobalMessages();
const products = new Products();
const forms = new Forms();

export const main = (state = {}, action) => {
    console.info(action);

    return Object.assign(
        {},
        state,
        products.reduce(state, action),
        globalMessages.reduce(state, action),
        forms.reduce(state, action)
    );
};
