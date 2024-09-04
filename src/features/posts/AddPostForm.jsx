import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  addNewPost } from "./postsSlice";
import { selectAllUsers } from "../users/usersSlice";
import { useNavigate } from "react-router-dom";

export default function AddPostForm(){

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')
    const [addRequestStatus, setAddRequestStatus] = useState('idle')
    const onTitleChange = (e) => setTitle(e.target.value)
    const onContentChange = (e) => setContent(e.target.value)
    
    

    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onSaveClicked = ()=>{
        if (canSave){
            try{
                setAddRequestStatus('pending')
                dispatch(addNewPost({title, body: content, userId})).unwrap()

                setTitle('')
                setContent('')
                setUserId('')
                navigate('/')
            }catch(err){
                console.error('failed to add the post', err)
            }finally{
                setAddRequestStatus('idle')
            }
        }
    }

    const users = useSelector(selectAllUsers)

    const usersOptions = users.map((user)=>(
        <option key={user.id} value={user.id}>{user.name}</option>
    ))

    const onAuthorChange = (e) =>{
        setUserId(e.target.value)
        
    }



    return(
        <section>
            <h2>Add a new post</h2>
            <form>
                <label htmlFor="postTitle">Post Title: </label>
                <input 
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChange}
                />

                <label htmlFor="postAuthor">Author: </label>
                <select id="postAuthor" value={userId} onChange={onAuthorChange}>
                    <option value=""></option>
                    {usersOptions}
                </select>

                <label htmlFor="postContent">Content: </label>
                <textarea 
                    name="postContent"
                    id="postContent"
                    value={content}
                    onChange={onContentChange}
                ></textarea>
                <button type="button" onClick={onSaveClicked} disabled ={!canSave}>Save Post</button>
            </form>
        </section>    
    )
}