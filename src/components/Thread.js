import React, {useState} from 'react'
import commentIcon from '../assets/images/icons/comment.svg'
import Comment from './Comment'
import {Editor, convertFromRaw, EditorState} from 'draft-js';
import {toast} from 'react-toastify';
import {StatusCodes} from 'http-status-codes';

const Thread = ({data: {_id: threadId, title, username, upvotes, message, comments}, expanded}) => {
    const [upvoteCount, setUpvoteCount] = useState(upvotes)
    const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(message)))

    const handleUpvote = async () => {
        const response = await fetch(`/thread/${threadId}/upvote`)
        const {status} = response
        if (status === StatusCodes.OK) {
            toast('Upvoted');
            setUpvoteCount(upvoteCount + 1)
        } else {
            toast.error('Error');
        }
    }

    const handleDownvote = async () => {
        const response = await fetch(`/thread/${threadId}/downvote`)
        const {status} = response
        if (status === StatusCodes.OK) {
            toast('Downvoted');
            setUpvoteCount(upvoteCount - 1)
        } else {
            toast.error('Error');
        }
    }
    
    return (
        <div className="flex shadow-lg hover:border-grey rounded bg-white p-4">
            <div className="w-1/12 flex flex-col text-center pt-2">
                <button className="text-xs" onClick={handleUpvote}>
                    <svg className="w-5 fill-current text-grey" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7 10v8h6v-8h5l-8-8-8 8h5z"></path></svg>
                </button>
                <span className="text-xs font-semibold my-1">{upvoteCount}</span>
                <button className="text-xs" onClick={handleDownvote}>
                    <svg className="w-5 fill-current text-grey" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7 10V2h6v8h5l-8 8-8-8h5z"></path></svg>
                </button>
            </div>
            <div className="w-11/12 pt-2">
                <div className="flex items-center text-xs mb-2">
                    <span className="text-grey-light mx-1 text-xxs">•</span>
                    <span className="text-grey">Posted by</span>
                    <a href="#!" alt={username} className="text-grey mx-1 no-underline hover:underline">{username}</a>
                </div>
                <div>
                    <h2 className="text-lg font-medium mb-1">{title}</h2>
                </div>
                <div className="inline-flex items-center my-1">
                    <div className="flex hover:bg-grey-lighter p-1">
                        <img src={commentIcon} className="w-4 fill-current text-grey" alt="Comments Icon" />
                        <span className="ml-2 text-xs font-semibold text-grey">{comments.length} Comments</span>
                    </div>
                </div>
                {expanded && (
                    <>
                    <div className="readonly-editor">
                        <Editor editorState={editorState} readOnly={true} /> 
                    </div>
                    <div className="mt-5 space-y-2">
                        {comments.map((comment) => (
                            <Comment
                                key={comment._id}
                                data={comment}
                            />
                        ))}
                    </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Thread