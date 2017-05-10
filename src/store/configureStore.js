import { createStore, applyMiddleware } from 'redux';
import rootReducer  from '../reducers/rootReducer';
import { enableBatching } from 'redux-batched-actions';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

const createStoreWithMiddleware = applyMiddleware(thunk, composeWithDevTools)(createStore);

const configureStore = () => {
    return createStoreWithMiddleware(enableBatching(rootReducer));
};

// const configureStore = () => {
//     return createStore(
//         rootReducer,
//         applyMiddleware(thunk, composeWithDevTools)
//     )
// };
//

export default configureStore;
