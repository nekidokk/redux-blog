import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import {sub} from 'date-fns'
import axios from 'axios'

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'
   
const postAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postAdapter.getInitialState({
    status: 'idle', //'idle', 'loading' , 'succeeded', 'failed'
    error: null,
    count: 0,
})

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async ()=>{
    try{
        const response = await axios.get(POSTS_URL)
        return response.data
    } catch(err){
        return err.message
    }
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async(initalPost)=>{
    try{
        const response = await axios.post(POSTS_URL, initalPost)
        
        return response.data
    } catch(err){
        return err.message
    }
})

export const editPost = createAsyncThunk('posts/editPost', async(initalPost)=>{
    const { id } = initalPost
    console.log(id)
    try{
        const response = await axios.put(`${POSTS_URL}/${id}`, initalPost)
        return response.data
    }catch(err){
        //return err.message
        return initalPost //this is for the posts that are not included in fake api
    }
})

export const deletePost = createAsyncThunk('posts/deletePost', async(initalPost)=>{
    const {id} = initalPost
    try{
        const response = await axios.delete(`${POSTS_URL}/${id}`)
        if(response?.status == 200) return initalPost
        return `${response?.status}: ${response?.statusText}`
    }catch(err){
        return err.message
    }
})

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers:{
        reactionAdded(state, action){
            const {postId, reaction} = action.payload
            const existingPost = state.entities[postId]
            if(existingPost){
                existingPost.reactions[reaction]++
            }
        },
        increaseCount(state, action){
            state.count = state.count + 1
        }

    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchPosts.pending, (state, action)=>{
            state.status = 'loading'
        })
        .addCase(fetchPosts.fulfilled, (state, action)=>{
            state.status = 'succeeded'
            let min = 1
            const loadedPosts = action.payload.map(post=>{
                post.date = sub(new Date(), {minutes: min++}).toISOString()
                post.reactions = {
                    thumbsUp: 0,
                    thumbsDown: 0,
                    heart: 0,
                    crying: 0,
                    cute: 0
                 }
                 return post
            })
            postAdapter.upsertMany(state, loadedPosts)
        })
        .addCase(fetchPosts.rejected, (state, action)=>{
            state.status = 'failed'
            state.error = action.error.message
        })
        .addCase(addNewPost.fulfilled, (state, action)=>{
            
            action.payload.userId = Number(action.payload.userId)
            action.payload.date = new Date().toISOString()
            action.payload.reactions = {
                thumbsUp: 0,
                thumbsDown: 0,
                heart: 0,
                crying: 0,
                cute: 0
             }
            
            postAdapter.addOne(state, action.payload)
        } )
        .addCase(editPost.fulfilled, (state, action)=>{
            if(!action.payload?.id){
                console.log("can't edit the post")
                console.log(action.payload)
                return;
            }
            action.payload.date = new Date().toISOString()      
            postAdapter.upsertOne(state, action.payload)
        })
        .addCase(deletePost.fulfilled, (state, action)=>{
            if(!action.payload?.id){
                console.log("delete could not complete")
                console.log(action.payload)
                return;
            }
            const { id } = action.payload
            postAdapter.removeOne(state, id)
        })
    }

})

export const {
    selectAll: selectAllPosts,
    selectById : selectPostById,
    selectIds: selectPostIds,
} = postAdapter.getSelectors(state => state.posts)

export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error
export const getCount = (state) => state.posts.count


export const {reactionAdded, increaseCount} = postsSlice.actions

export default postsSlice.reducer