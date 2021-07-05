import React from 'react'
import '../styles/styles.css'
import '../styles/tailwind.css'
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';
import HomePage from '../pages/HomePage'
import ThreadPage from '../pages/ThreadPage'


import {
    BrowserRouter as Router,
    Route,
    Switch,
  } from 'react-router-dom';

const App = () => {
  return (
    <Router>
        <ToastContainer />
        <div className="w-screen min-h-screen text-gray-700 bg-gradient-to-tr from-gray-100 via-gray-200 to-gray-300 pt-4">
            <div className="container">
                <Switch>
                    <Route exact path="/">
                        <HomePage />
                    </Route>
                    <Route path="/thread/:id">
                        <ThreadPage />
                    </Route>
                </Switch>
            </div>
        </div>
    </Router>
  )
}

export default App
