import React from 'react'
import {Editor, convertFromRaw, EditorState} from 'draft-js';

const Comment = ({data: {upvotes, createdAt, username, message, comments}}) => {
    const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(message)))
    return (
        <div className="w-full p-4 border border-2">
            <Editor editorState={editorState} readOnly={true} />
            <div className="mt-2 p-2 bg-gray-300">{username}</div>
        </div>
    )
}

export default Comment