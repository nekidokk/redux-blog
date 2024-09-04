import { useDispatch } from "react-redux";
import { reactionAdded } from "./postsSlice";

export default function ReactionButtons({post}){

    const dispatch = useDispatch()
     
    const reactionEmoji = {
        thumbsUp: '👍',
        thumbsDown: '👎',
        heart: '❤️',
        crying: '😭',
        cute: '🥺'
     }

     

    const emojiButtons = Object.entries(reactionEmoji).map(([name, emoji])=>{
        return(
            <button
                key={name}
                className="reactionButton"
                type="button"
                onClick={()=>{dispatch(
                    reactionAdded({postId: post.id, reaction: name})
                )
               
            }
            }
            >   
                {emoji}
                {post.reactions[name]}
            </button>
        )
    })

    return(
        <div>
            {emojiButtons}
        </div>
    )
}