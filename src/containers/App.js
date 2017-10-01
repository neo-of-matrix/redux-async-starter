import React, { Component } from 'react';
import {connect} from 'react-redux'
import { selectData, fetchPostsIfNeeded, invalidateData } from '../actions'
import Picker from '../components/Picker'
import Posts from '../components/Posts'
class App extends Component {
	render() {
		const {selectedData, posts, isFetching, lastUpdated}=this.props
		const isEmpty=posts.length===0
		return (
			<div>
				<Picker value={selectedData}
					onChange={this.handleChange.bind(this)}
					options={['reactjs','frontend']}/>
				<p>
				{
					lastUpdated&&
					<span>
						{new Date(lastUpdated).toLocaleTimeString()}
					</span>
				}
				{
					!isFetching&&
					<button onClick={this.handleRefreshClick.bind(this)}>
						Refresh
					</button>
				}
				</p>
				{
					isEmpty?
					(isFetching?<h2>Loading...</h2>:<h2>Empty</h2>):
					<div style={{opacity:isFetching?0.5:1}}>
						<Posts posts={posts} />
					</div>
				}
			</div>
		);
	}
	componentDidMount() {
		const {dispatch,selectedData}=this.props
		dispatch(fetchPostsIfNeeded(selectedData))
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.selectedData!==this.props.selectedData) {
			const {dispatch,selectedData}=nextProps
			dispatch(fetchPostsIfNeeded(selectedData))
		}
	}
	handleChange(nextData){
		this.props.dispatch(selectData(nextData))
	}
	handleRefreshClick(e){
		const {dispatch, selectedData}=this.props
		dispatch(invalidateData(selectedData))
		dispatch(fetchPostsIfNeeded(selectedData))
		e.preventDefault()
	}
}
const mapStateToProps=state=>{
	const {selectedData,postsByData} =state
	const {isFetching, lastUpdated, items:posts}=postsByData[selectedData] || {
		isFetching:true,
		items:[]
	}
	return {
		selectedData,
		posts,
		isFetching,
		lastUpdated
	}
}
export default connect(mapStateToProps)(App)