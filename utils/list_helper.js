
const dummy = (blogs) => {
    return(1)
}

const totalLikes = (listOfBlogs) => {
    const total = listOfBlogs.reduce(
        (previous, current)=> previous + current.likes, 0)
    return(total)
}

const favouriteBlog = (listOfBlogs) => {
    const likes = listOfBlogs.map(blog => blog.likes)
    const maxIndex = likes.indexOf(Math.max(...likes))
    favourite = listOfBlogs[[maxIndex]]
    return({
        title: favourite.title,
        author: favourite.author,
        likes: favourite.likes
    })
}

const mostBlogs = (listOfBlogs) => {
    let max = 0
    let mostProlific = ''
    let checked = []
    for (const i in listOfBlogs) {
        const author = listOfBlogs[[i]].author
        if (!checked.includes(author)) {
            checked = checked.concat(author)
            numAuthorBlogs = listOfBlogs.filter(blog => blog.author === author).length
            if (numAuthorBlogs > max) {
                max = numAuthorBlogs
                mostProlific = author
            }
        }
    }
    return {
        author: mostProlific,
        blogs: max
    }
}

const mostLikes = (listOfBlogs) => {
    let max = 0
    let mostLiked = ''
    let checked = []
    for (const i in listOfBlogs) {
        const author = listOfBlogs[[i]].author
        if (!checked.includes(author)) {
            checked = checked.concat(author)
            const authorBlogs = listOfBlogs.filter(blog => blog.author === author)
            const authorLikes = authorBlogs.map(blog => blog.likes).reduce((a, b) => a + b, 0)
            if (authorLikes > max) {
                max = authorLikes
                mostLiked = author
            }
        }
    }
    console.log(mostLiked)
    return {
        author: mostLiked,
        likes: max
    }
}
 
module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}