import {combineReducers} from 'redux'
import {
	SELECT_DATA,
	INVALIDATE_DATA,
	REQUEST_POSTS,
	RECEIVE_POSTS
} from '../actions'
// 选择项state
const selectedData=(state='reactjs',action)=>{
	switch(action.type){
		case SELECT_DATA:
			return action.data
		default:
			return state
	}
}

const posts=(state={
	isFetching:false,
	didInvalidate:false,
	items:[]
},action)=>{
	switch(action.type){
		case INVALIDATE_DATA:
			return {
				...state,
				didInvalidate:true
			}
		case REQUEST_POSTS:
			return {
				...state,
				isFetching:true,
				didInvalidate:false
			}
		case RECEIVE_POSTS:
			return {
				...state,
				isFetching:false,
				didInvalidate:false,
				items:action.posts,
				lastUpdated:action.receivedAt
			}
		default:
			return state
	}
}

//
const postsByData=(state={},action)=>{
	switch(action.type){
		case INVALIDATE_DATA:
		case RECEIVE_POSTS:
		case REQUEST_POSTS:
			return{
				...state,
				[action.data]:posts(state[action.data],action)
			}
		default:
			return state
	}
}




const rootReducer=combineReducers({
	postsByData,
	selectedData
})
export default rootReducer