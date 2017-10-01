const REQUEST_POSTS = 'REQUEST_POSTS'
const RECEIVE_POSTS = 'RECEIVE_POSTS'
const SELECT_DATA = 'SELECT_DATA'
const INVALIDATE_DATA = 'INVALIDATE_DATA'
//action creator
const selectData = data => ({
  type: SELECT_DATA,
  data
})

const invalidateData = data => ({
  type: INVALIDATE_DATA,
  data
})

const requestPosts = data => ({
  type: REQUEST_POSTS,
  data
})
//得到数据后处理数据
/*数据结构：
{"kind":"Listing",
 "data":{
    "children":[
      {"kind":"t3",
       "data":{...}
      }
    ]
  }
}
*/
const receivePosts = (data, json) => ({
  type: RECEIVE_POSTS,
  data,
  posts: json.data.children.map(child => child.data),
  receivedAt: Date.now()
})
//异步请求action creator
const fetchPosts = data => dispatch => {
  dispatch(requestPosts(data))
  return fetch(`https://www.reddit.com/r/${data}.json`)
    .then(response => response.json())
    .then(json => dispatch(receivePosts(data, json)))
}
//请求数据判断条件
const shouldFetchPosts = (state, data) => {
  const posts = state.postsByData[data]
  if (!posts) {
    return true
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate
}
//是否请求数据
const fetchPostsIfNeeded = data => (dispatch, getState) => {
  if (shouldFetchPosts(getState(), data)) {
    return dispatch(fetchPosts(data))
  }
}
export { REQUEST_POSTS, RECEIVE_POSTS, SELECT_DATA, INVALIDATE_DATA, selectData, invalidateData, requestPosts, receivePosts, fetchPostsIfNeeded }