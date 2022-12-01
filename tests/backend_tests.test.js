const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})


test('getting blog', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 100000)


test('verify identifier name', async () => {
    const response = await api.get('/api/blogs')
    if(response.body.length > 0) {
        const firstBlog = response.body[[0]]
        expect(firstBlog.id).toBeDefined()
    }
})

test('blog creation', async () => {
    const newBlog = {
        title: 'Test blog',
        author: 'Jane Doe',
        url: '/test/blog/url',
        likes: 100000
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContainEqual(
        newBlog.title
    )
})

test('default likes', async () => {
    const newBlog = {
        title: 'Test blog',
        author: 'Jane Doe',
        url: '/test/blog/url'
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const likes = response.body.filter(blog => blog.title === newBlog.title)[[0]].likes
    expect(likes).toEqual(0)
})


test('title or url missing', async () => {
    const blogWithNoTitle = {
        author: 'Jane Doe',
        url: '/test/blog/url',
        likes: 100
    }
    const blogWithNoUrl = {
        title: 'Test blog',
        author: 'Jane Doe',
        likes: 100
    }

    await api
        .post('/api/blogs')
        .send(blogWithNoTitle)
        .expect(400)
})


test('delete blog with valid id', async () => {
    
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]
    await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

    const blogsAtEnd = await Blog.find({})

    expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
    )
    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).not.toContain(blogToDelete.title)
})

test('modify blog with valid id', async () => {
    
    const blogsAtStart = await Blog.find({})
    const blogToModify = blogsAtStart[0]
    const modifiedBlog = {
        title: blogToModify.title,
        url: blogToModify.url,
        author: blogToModify.author,
        likes: blogToModify.likes + 1,
        id: blogToModify.id
    }
    await api
    .put(`/api/blogs/${blogToModify.id}`)
    .send(modifiedBlog)
    .expect(200)

    const blogsAtEnd = await Blog.find({})

    expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length
    )
    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).toContain(blogToModify.title)
})

afterAll(() => {
    mongoose.connection.close()
  })

