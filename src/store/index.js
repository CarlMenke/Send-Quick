import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import MessageReducer from './reducers/MessageReducer'
import thunk from 'redux-thunk'

const store = createStore(
  combineReducers({
    state: MessageReducer
  }),
  composeWithDevTools(applyMiddleware(thunk))
)

export default store