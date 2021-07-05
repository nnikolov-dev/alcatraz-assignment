process.env.NODE_ENV = 'TEST';

const {describe, it, after, before} = require('mocha');
const {StatusCodes} = require('http-status-codes');
const chai = require('chai');
const chaiHttp = require('chai-http');
const ThreadModel = require('../models/thread')
const CommentModel = require('../models/comment')
const server = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

// Mocks

// Thread
const mockThread = {
    title: 'Test Threat',
    username: 'Test User',
    editorState: '{"blocks":[{"key":"1lugi","text":"qweqweqwe","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}'
}

// Comment
const mockComment = {
    username: 'Test User',
    editorState: '{"blocks":[{"key":"1lugi","text":"qweqweqwe","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}'
}

describe('Routes', () => {

    let savedThread

    before(async () => {
        ThreadModel.collection.drop()
        CommentModel.collection.drop()
        savedThread = await new ThreadModel({...mockThread, message: mockThread.editorState}).save()
    })

    after(() => {
        server.close();
    });

    describe('Threads', () => {
        it('should get all threads', done => {
            chai
                .request(server)
                .get('/thread')
                .end((err, res) => {
                    expect(res).to.have.status(StatusCodes.OK);
                    expect(res.body).to.have.lengthOf(1)
                    done();
                });
        });

        it('should post a valid thread', done => {
            chai
                .request(server)
                .post('/thread')
                .send(mockThread)
                .set('Accept', 'application/json')
                .end((err, res)  => {
                    expect(res).to.have.status(StatusCodes.OK);
                    expect(res.body.title).to.equal(mockThread.title)
                    expect(res.body.username).to.equal(mockThread.username)
                    expect(res.body.message).to.equal(mockThread.editorState)
                    done()
                })
        });
    
        it('should not post an empty thread', done => {
            chai
                .request(server)
                .post('/thread')
                .send({})
                .set('Accept', 'application/json')
                .end((err, res)  => {
                    expect(res).to.have.status(StatusCodes.BAD_REQUEST);
                    done()
                })
        });

        it('should not post a thread with no username', done => {
            chai
                .request(server)
                .post('/thread')
                .send({...mockThread, username: ''})
                .set('Accept', 'application/json')
                .end((err, res)  => {
                    expect(res).to.have.status(StatusCodes.BAD_REQUEST);
                    done()
                })
        });

        it('should not post a thread with no title', done => {
            chai
                .request(server)
                .post('/thread')
                .send({...mockThread, title: ''})
                .set('Accept', 'application/json')
                .end((err, res)  => {
                    expect(res).to.have.status(StatusCodes.BAD_REQUEST);
                    done()
                })
        });

        it('should not post a thread with no message', done => {
            chai
                .request(server)
                .post('/thread')
                .send({...mockThread, editorState: ''})
                .set('Accept', 'application/json')
                .end((err, res)  => {
                    expect(res).to.have.status(StatusCodes.BAD_REQUEST);
                    done()
                })
        });

        it('should not post a thread with invalid message', done => {
            chai
                .request(server)
                .post('/thread')
                .send({...mockThread, editorState: '{"invalid": true}'})
                .set('Accept', 'application/json')
                .end((err, res)  => {
                    expect(res).to.have.status(StatusCodes.BAD_REQUEST);
                    done()
                })
        });

        it('should get all threads with new', done => {
            chai
                .request(server)
                .get('/thread')
                .end((err, res) => {
                    expect(res).to.have.status(StatusCodes.OK);
                    expect(res.body).to.have.lengthOf(2)
                    done();
                });
        });

        it('should get a valid thread', done => {
            chai
                .request(server)
                .get(`/thread/${savedThread._id}`)
                .end((err, res) => {
                    expect(res).to.have.status(StatusCodes.OK);
                    expect(res.body.title).to.equal(mockThread.title)
                    expect(res.body.username).to.equal(mockThread.username)
                    expect(res.body.message).to.equal(mockThread.editorState)
                    done();
                });
        });

        it('should not get an invalid thread', done => {
            chai
                .request(server)
                .get(`/thread/${savedThread._id}1`)
                .end((err, res) => {
                    expect(res).to.have.status(StatusCodes.BAD_REQUEST);
                    done();
                });
        });

        it('should upvote thread', done => {
            chai
                .request(server)
                .get(`/thread/${savedThread._id}/upvote`)
                .end((err, res) => {
                    expect(res).to.have.status(StatusCodes.OK);
                    expect(res.body.upvotes).to.equal(1)
                    done();
                });
        });

        it('should downvote thread', done => {
            chai
                .request(server)
                .get(`/thread/${savedThread._id}/downvote`)
                .end((err, res) => {
                    expect(res).to.have.status(StatusCodes.OK);
                    expect(res.body.upvotes).to.equal(0)
                    done();
                });
        });
    })

    it('should not upvote invalid thread', done => {
        chai
            .request(server)
            .get(`/thread/${savedThread._id}1/upvote`)
            .end((err, res) => {
                expect(res).to.have.status(StatusCodes.BAD_REQUEST);
                done();
            });
    });

    it('should not downvote invalid thread', done => {
        chai
            .request(server)
            .get(`/thread/${savedThread._id}1/downvote`)
            .end((err, res) => {
                expect(res).to.have.status(StatusCodes.BAD_REQUEST);
                done();
            });
    });

    describe('Comments', () => {
        it('should post a valid comment', done => {
            chai
                .request(server)
                .post(`/thread/${savedThread._id}/comment`)
                .send(mockComment)
                .set('Accept', 'application/json')
                .end((err, res)  => {
                    const [comment] = res.body.comments
                    expect(res).to.have.status(StatusCodes.OK);
                    expect(res.body.title).to.equal(mockThread.title)
                    expect(res.body.username).to.equal(mockThread.username)
                    expect(res.body.message).to.equal(mockThread.editorState)
                    expect(res.body.comments.length).to.equal(1)
                    expect(comment.username).to.equal(mockComment.username)
                    expect(comment.message).to.equal(mockComment.editorState)
                    done()
                })
        });

        it('should not post an invalid comment with no username', done => {
            chai
                .request(server)
                .post(`/thread/${savedThread._id}/comment`)
                .send({mockComment, username: ''})
                .set('Accept', 'application/json')
                .end((err, res)  => {
                    expect(res).to.have.status(StatusCodes.BAD_REQUEST);
                    done()
                })
        });

        it('should not post an invalid comment with no message', done => {
            chai
                .request(server)
                .post(`/thread/${savedThread._id}/comment`)
                .send({mockComment, editorState: ''})
                .set('Accept', 'application/json')
                .end((err, res)  => {
                    expect(res).to.have.status(StatusCodes.BAD_REQUEST);
                    done()
                })
        });

        it('should not post an invalid comment with invalid message', done => {
            chai
                .request(server)
                .post(`/thread/${savedThread._id}/comment`)
                .send({mockComment, editorState: '{"invalid": true}'})
                .set('Accept', 'application/json')
                .end((err, res)  => {
                    expect(res).to.have.status(StatusCodes.BAD_REQUEST);
                    done()
                })
        });
    })

});