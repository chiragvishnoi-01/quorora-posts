const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Sample post data
let posts = [
  {
    id: uuidv4(),
    username: "chirag vishnoi",
    content: "i love coding",
  },
  {
    id: uuidv4(),
    username: "tiktok",
    content: "video share app",
  },
  {
    id: uuidv4(),
    username: "instagram",
    content: "photo share app",
  },
];

// Route: Show all posts
app.get('/posts', (req, res) => {
  res.render("index.ejs", { posts });
});

// Route: Form to create new post
app.get('/posts/new', (req, res) => {
  res.render("new.ejs");
});

// Route: Create new post
app.post('/posts', (req, res) => {
  const { username, content } = req.body;
  const id = uuidv4();
  posts.push({ id, username, content });
  res.redirect('/posts');
});

// Route: Show a single post
app.get('/posts/:id', (req, res) => {
  const { id } = req.params;
  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).send("Post not found");
  }
  res.render("show.ejs", { post });
});

// Route: Edit form
app.get('/posts/:id/edit', (req, res) => {
  const { id } = req.params;
  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).send("Post not found");
  }
  res.render("edit.ejs", { post });
});

// Route: Update post
app.patch('/posts/:id', (req, res) => {
  const { id } = req.params;
  const newContent = req.body.content;
  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).send("Post not found");
  }
  post.content = newContent;
  res.redirect('/posts'); // ✅ Redirect to main page after editing
});

app.delete('/posts/:id', (req, res) => {
 let { id } = req.params;
   posts = posts.filter(p => p.id !== id);
res.redirect('/posts');
});
// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
