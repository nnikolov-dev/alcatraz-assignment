/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import Thread from '../components/Thread'
import AddThread from '../forms/AddThread'

const Home = () => {
    
    const [threadsData, setThreadsData] = useState([])

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/thread')
            const data = await response.json()
            setThreadsData(data)
            console.log(data)
        }
        fetchData();
    }, [])

    const threadCallback = (data) => {
        setThreadsData([...threadsData, data])
    }

    return (
        <div className="flex flex-col space-y-2">
            {threadsData.map((threadData) => (
                <Link to={`/thread/${threadData._id}`} key={threadData._id}>
                    <Thread data={threadData} />
                </Link>
            ))}
            <h1 className="text-2xl pt-4">New Thread</h1>
            <AddThread cb={threadCallback} />
        </div>
    )
}

export default Home