# Create React App + KOA + MongoDB

## Prerequisites
- NodeJS v16.4.1
- MongoDB database instance
- Yarn (optional)


## Instructions
- Use `yarn` to install the dependencies
- Create a `.env` file with the following vars
  - ``` MONGODB_URI=mongodb://127.0.0.1:27017/reddit
        MONGODB_URI_TEST=mongodb://127.0.0.1:27017/reddit_test
        PORT=8000 ```
- Start front-end dev server `yarn start`
- Start back-end server `yarn server`


## Todo
- Add nested Comments
- Add Passport for auth
- Save upvote state per thread
- Configure ESLint