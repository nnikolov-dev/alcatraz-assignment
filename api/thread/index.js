const Router = require('koa-router')
const yup = require('yup')
const ThreadModel = require('../../models/thread')
const CommentModel = require('../../models/comment')
const {EditorState, convertToRaw, convertFromRaw} = require('draft-js');
const { StatusCodes } = require('http-status-codes');

const router = new Router();

// Schemas
const threadSchema = yup.object().shape({
    title: yup.string()
        .required('Required!'),
    username: yup.string()
        .required('Required!'),
    editorState: yup.object()
        .test('has-content', 'Required!', 
            (value) => {
                return value.getCurrentContent().hasText()
            })
});

const commentSchema = yup.object().shape({
    username: yup.string()
        .required('Required!'),
    editorState: yup.object()
        .test('has-content', 'Required!', 
            (value) => {
                return value.getCurrentContent().hasText()
            })
});

// Routes

// Get all Threads
router.get('/', async (ctx, next) => {
    const threads = await ThreadModel.find({})
    ctx.body = threads
});

// Get a specific thread
router.get('/:id', async (ctx, next) => {
    try {
        const thread = await ThreadModel.findById(ctx.params.id).populate('comments')
        if (!thread) {
            throw new Error()
        }
        ctx.body = thread
    } catch (e) {
        ctx.status = StatusCodes.BAD_REQUEST
        ctx.body = {message: 'Not Found'}
    }
});

// Create a new comment
router.post('/:id/comment', async (ctx, next) => {
    const {username, editorState} =  ctx.request.body;
    try {
        const parsedEditorState = EditorState.createWithContent(convertFromRaw(JSON.parse(editorState)))
        await commentSchema.validate({username, editorState: parsedEditorState})
        const message = JSON.stringify(convertToRaw(parsedEditorState.getCurrentContent()))
        const thread = await ThreadModel.findById(ctx.params.id)
        const newComment = new CommentModel({username, message})
        await newComment.save()
        thread.comments = [...thread.comments, newComment]
        await thread.save()
        await CommentModel.populate(thread, {path: 'comments'})
        ctx.body = thread
    } catch (e) {
        ctx.status = StatusCodes.BAD_REQUEST
        ctx.body = {message: 'Invalid Parameters'}
    }
});

// Create a new thread
router.post('/', async (ctx, next) => {
    const {title, username, editorState} =  ctx.request.body;
    try {
        const parsedEditorState = EditorState.createWithContent(convertFromRaw(JSON.parse(editorState)))
        await threadSchema.validate({title, username, editorState: parsedEditorState})
        const message = JSON.stringify(convertToRaw(parsedEditorState.getCurrentContent()))
        const thread = await ThreadModel.create({ title, username, message });
        ctx.body = thread;
    } catch (e) {
        ctx.status = StatusCodes.BAD_REQUEST
        ctx.body = {message: 'Invalid Parameters'}
    }
})

router.post('/', async (ctx, next) => {
    const {title, username, editorState} =  ctx.request.body;
    try {
        const parsedEditorState = EditorState.createWithContent(convertFromRaw(JSON.parse(editorState)))
        await threadSchema.validate({title, username, editorState: parsedEditorState})
        const message = JSON.stringify(convertToRaw(parsedEditorState.getCurrentContent()))
        const thread = await ThreadModel.create({ title, username, message });
        ctx.body = thread;
    } catch (e) {
        ctx.status = StatusCodes.BAD_REQUEST
        ctx.body = {message: 'Invalid Parameters'}
    }
})

// Upvote
router.get('/:id/upvote', async (ctx, next) => {
    try {
        const thread = await ThreadModel.findById(ctx.params.id)
        thread.upvotes += 1
        await thread.save()
        await CommentModel.populate(thread, {path: 'comments'})
        ctx.body = thread
    } catch (e) {
        ctx.status = StatusCodes.BAD_REQUEST
        ctx.body = {message: 'Invalid Parameters'}
    }
});

// Downvote
router.get('/:id/downvote', async (ctx, next) => {
    try {
        const thread = await ThreadModel.findById(ctx.params.id)
        thread.upvotes -= 1
        await thread.save()
        await CommentModel.populate(thread, {path: 'comments'})
        ctx.body = thread
    } catch (e) {
        ctx.status = StatusCodes.BAD_REQUEST
        ctx.body = {message: 'Invalid Parameters'}
    }
});

module.exports = router