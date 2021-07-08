const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0;

  if (blogs.length === 1) return blogs[0].likes;

  return blogs.reduce(
    (totalAmount, currentAmount) => totalAmount + currentAmount.likes,
    0
  );
};

const favouriteBlog = (blogs) => {
  const topLiked = blogs.reduce((prevBlog, currentBlog) =>
    prevBlog.likes > currentBlog.likes ? prevBlog : currentBlog
  );

  const likedBlog = {
    title: topLiked.title,
    author: topLiked.author,
    likes: topLiked.likes,
  };

  return likedBlog;
};

const mostBlogs = (blogs) => {
  const countEachAuthor = {};

  blogs.forEach((blog) => {
    countEachAuthor[blog.author]
      ? countEachAuthor[blog.author]++
      : (countEachAuthor[blog.author] = 1);
  });

  //console.log(countEachAuthor);
  // { 'Michael Chan': 1, 'Edsger W. Dijkstra': 2, 'Robert C. Martin': 3 }

  const authorMostBlogs = Object.entries(countEachAuthor).reduce((a, b) =>
    countEachAuthor[a[0]] > countEachAuthor[b[0]] ? a : b
  );
  //console.log(authorMostBlogs);
  // ["Robert C. Martin", 3];

  const authorReturn = {
    author: authorMostBlogs[0],
    blogs: authorMostBlogs[1],
  };

  return authorReturn;
};

const mostLikes = (blogs) => {
  const countEachAuthor = {};

  blogs.forEach((blog) => {
    countEachAuthor[blog.author]
      ? (countEachAuthor[blog.author] += blog.likes)
      : (countEachAuthor[blog.author] = blog.likes);
  });

  //console.log(countEachAuthor);
  // { 'Michael Chan': 7, 'Edsger W. Dijkstra': 17, 'Robert C. Martin': 12 }

  const authorMostLikes = Object.entries(countEachAuthor).reduce((a, b) =>
    countEachAuthor[a[0]] > countEachAuthor[b[0]] ? a : b
  );
  //console.log(authorMostLikes);
  // ["Edsger W. Dijkstra", 17];

  const authorReturn = {
    author: authorMostLikes[0],
    likes: authorMostLikes[1],
  };

  return authorReturn;
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
