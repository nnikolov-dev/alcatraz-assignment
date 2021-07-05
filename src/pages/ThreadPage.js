import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import AddComment from '../forms/AddComment';
import Thread from '../components/Thread'

const ThreadPage = () => {
    let { id } = useParams();

    const [threadData, setThreadData] = useState()

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`/thread/${id}`)
            const data = await response.json()
            setThreadData(data)
        }
        fetchData();  
    }, [id])

    const commentCallback = (data) => {
        console.log(data)
        setThreadData(data)
    }
    
    return (
        <>
        {threadData ? (
            <>
                <Thread data={threadData} expanded />
                <div className="shadow-lg hover:border-grey rounded bg-white cursor-pointer mt-4 p-4">
                    <AddComment threadId={id} cb={commentCallback} />
                </div>
            </>
        ) : (
            <b>Not Found</b>
        )}
        </>
    )
}

export default ThreadPage