import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import suscessReducer from './reducers/suscessReducer'
import errorReducer from './reducers/errorReducer'

const reducers = combineReducers({
  suscessMess: suscessReducer,
  errorMess: errorReducer
})

const store = createStore(
  reducers,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

export default store