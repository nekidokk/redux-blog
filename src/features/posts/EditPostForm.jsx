import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { selectPostById, editPost, deletePost } from "./postsSlice"
import { selectAllUsers } from "../users/usersSlice"

export default function EditPostForm(){


    const dispatch = useDispatch()
    const { postId } = useParams()
    const navigate = useNavigate()

    const post = useSelector(state => selectPostById(state, Number(postId)))
    const users = useSelector(selectAllUsers)


    const [title, setTitle] = useState(post?.title)
    const [content, setContent] = useState(post?.body)
    const [userId, setUserId] = useState(post?.userId)
    const [requestStatus, setRequestStatus] = useState('idle')
    const canSave = [title, content, userId].every(Boolean) && requestStatus === 'idle'

    
    if(!post){
        return <section><h2>Post not found!</h2></section>
    }




    const onSaveClicked = () =>{

        if(canSave){
            try{
                setRequestStatus('pending')
                dispatch(editPost({title: title, body: content, userId: userId, reactions: post.reactions, id: post.id})).unwrap()
                
                setTitle('')
                setContent('')
                setUserId('')
                navigate(`/post/${postId}`)
            }catch(err){
                console.error('failed to edit post',err)
            }finally{
                setRequestStatus('idle')
            }
            
    
        }

    }

    const onDeleteClicked = ()=>{
        try{
            setRequestStatus('pending')
            dispatch(deletePost(post)).unwrap()
            navigate('/')
        }catch(err){
            console.error('failed to delete post', err)
        }finally{
            setRequestStatus('idle')
        }
    }


    const onTitleChange = (e) => setTitle(e.target.value)   
    const onContentChange = (e) => setContent(e.target.value)

    const usersOptions = users.map((user)=>(
        <option key={user.id} value={user.id}>{user.name}</option>
    ))

    const onAuthorChange = (e) => setUserId(Number(e.target.value))

    return(
        <section>
            <h2>Edit post</h2>
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
                <select id="postAuthor" defaultValue={userId} onChange={onAuthorChange}>
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
                <button type="button" onClick={onSaveClicked} disabled ={!canSave}>Save</button>
                <button className="deleteButton" type="button" onClick={onDeleteClicked}>Delete</button>
            </form>
        </section>    
    )
}