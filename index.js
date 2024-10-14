import bodyParser from "body-parser";
import express from 'express';
import multer from "multer";
import path from 'path';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
}).single('image');

app.get('/', (req, res)=>{
    res.render('home.ejs', {blogs: blogsData, page:"home"});
})

app.get('/home', (req, res)=>{
    res.render('home.ejs', {blogs: blogsData, page:"home"});
})

app.get('/about', (req, res)=>{
    res.render('about.ejs', {page: 'about'});
})

app.get('/blogs', (req, res)=>{
    res.render('blogs.ejs', {blogs: blogsData, page:"blogs"});
})

app.get('/createBlog', (req, res)=>{
    res.render('blogChange.ejs', {page:"newBlog", blog:{}, todo: "Create", action: "/createBlog"});
})

app.get('/editBlog/:id', (req, res)=>{
    let blogId = req.params.id;
    res.render('blogChange.ejs', {blog: blogsData[blogId], page:"editBlog", todo: "Edit", action: `/editBlog/${blogId}`, id: blogId});
})

app.post('/createBlog', (req, res)=> {
    upload(req, res, (err) => {
        if (err) {
            console.log('Error:', err);
            res.send('Error: ' + err.message);
        } else {
            if (!req.file) {
                console.log('No file selected');
                res.send('No file selected');
            } else {
                req.body['blog-image'] = "/uploads/" + req.file['filename'];
                createBlog(req.body);
                res.redirect('/blogs');
            }
        }
    });
})

app.post('/editBlog/:id', (req, res)=>{
    let blogId = req.params.id;
    upload(req, res, (err) => {
        if(req.file) {
            req.body['blog-image'] = "/uploads/" + req.file['filename'];
        }
        editBlog(req.body, blogId);
        res.redirect('/blogs');
    });
})

app.post('/deleteBlog/:id', (req, res)=>{
    let blogId = req.params.id;
    upload(req, res, (err) => {
        deleteBlog(blogId);
        res.redirect('/blogs');
    });
})

app.listen(port, () => console.log(`app listening on port ${port}!`))

function createBlog(blog) {
    let newData = {};
    newData['title'] = blog['blog-title'];
    newData['content'] = blog['blog-content'];
    newData['image'] = blog['blog-image'];
    blogsData.push(newData);
}

function editBlog(blog, blogId) {
    blogsData[blogId]['title'] = blog['blog-title']
    blogsData[blogId]['content'] = blog['blog-content'];
    if(typeof blog['blog-image'] !== 'undefined') {
        blogsData[blogId]['image'] = blog['blog-image'];
    }
}

function deleteBlog(blogId) {
    blogsData[blogId] = {};
}

const blogsData = [
    {
        title: "Do Not Leave Tokyo Before Eating This Ramen",
        content: "Writing a blog is a great way to position yourself as an authority in your field and captivate your readers’ attention. Do you want to improve your site’s SEO ranking? Consider topics that focus on relevant keywords and relate back to your website or business. You can also add hashtags (#vacation #dream #summer) throughout your posts to reach more people, and help visitors search for relevant content. Blogging gives your site a voice, so let your business’ personality shine through. Choose a great image to feature in your post or add a video for extra engagement. Are you ready to get started? Simply create a new post now.",
        image: "https://static.wixstatic.com/media/c22c23_e3b5cb121db549fdbb1590f51d378b8c~mv2.png/v1/fill/w_454,h_255,fp_0.50_0.50,q_95,enc_auto/c22c23_e3b5cb121db549fdbb1590f51d378b8c~mv2.png",
    },
    {
        title: "5 Songs That Make Me REALLY Happy",
        content: "Writing a blog is a great way to position yourself as an authority in your field and captivate your readers’ attention. Do you want to improve your site’s SEO ranking? Consider topics that focus on relevant keywords and relate back to your website or business. You can also add hashtags (#vacation #dream #summer) throughout your posts to reach more people, and help visitors search for relevant content. Blogging gives your site a voice, so let your business’ personality shine through. Choose a great image to feature in your post or add a video for extra engagement. Are you ready to get started? Simply create a new post now.",
        image: "https://static.wixstatic.com/media/c22c23_5ab44dfe10f84b5e90e19db16bd06ae3~mv2.png/v1/fill/w_454,h_255,fp_0.50_0.50,q_95,enc_auto/c22c23_5ab44dfe10f84b5e90e19db16bd06ae3~mv2.png",
    },
    {
        title: "Amsterdam 101: Redefining The French Fries",
        content: "Writing a blog is a great way to position yourself as an authority in your field and captivate your readers’ attention. Do you want to improve your site’s SEO ranking? Consider topics that focus on relevant keywords and relate back to your website or business. You can also add hashtags (#vacation #dream #summer) throughout your posts to reach more people, and help visitors search for relevant content. Blogging gives your site a voice, so let your business’ personality shine through. Choose a great image to feature in your post or add a video for extra engagement. Are you ready to get started? Simply create a new post now.",
        image: "https://static.wixstatic.com/media/c22c23_5a6f262789ea450393f4b3c6bc3247df~mv2.jpg/v1/fill/w_454,h_264,fp_0.50_0.50,q_90,enc_auto/c22c23_5a6f262789ea450393f4b3c6bc3247df~mv2.jpg",
    },
    {
        title: "Paris: Secrets Only The Locals Can Tell You",
        content: "Writing a blog is a great way to position yourself as an authority in your field and captivate your readers’ attention. Do you want to improve your site’s SEO ranking? Consider topics that focus on relevant keywords and relate back to your website or business. You can also add hashtags (#vacation #dream #summer) throughout your posts to reach more people, and help visitors search for relevant content. Blogging gives your site a voice, so let your business’ personality shine through. Choose a great image to feature in your post or add a video for extra engagement. Are you ready to get started? Simply create a new post now.",
        image: "https://static.wixstatic.com/media/c22c23_ea4c50693f8f473b9ba056fc36032ae4~mv2.jpg/v1/fill/w_454,h_255,fp_0.50_0.50,q_90,enc_auto/c22c23_ea4c50693f8f473b9ba056fc36032ae4~mv2.jpg",
    },
    {
        title: "Best Podcasts to Listen to When Traveling",
        content: "Writing a blog is a great way to position yourself as an authority in your field and captivate your readers’ attention. Do you want to improve your site’s SEO ranking? Consider topics that focus on relevant keywords and relate back to your website or business. You can also add hashtags (#vacation #dream #summer) throughout your posts to reach more people, and help visitors search for relevant content. Blogging gives your site a voice, so let your business’ personality shine through. Choose a great image to feature in your post or add a video for extra engagement. Are you ready to get started? Simply create a new post now.",
        image: "https://static.wixstatic.com/media/c22c23_a31ea2b671fe4cddbbb5728c9310c756~mv2_d_5659_3773_s_4_2.jpg/v1/fill/w_454,h_303,fp_0.50_0.50,q_90,enc_auto/c22c23_a31ea2b671fe4cddbbb5728c9310c756~mv2_d_5659_3773_s_4_2.jpg",
    },
    {
        title: "Movies That Need to Be Seen on the Big Screen",
        content: "Writing a blog is a great way to position yourself as an authority in your field and captivate your readers’ attention. Do you want to improve your site’s SEO ranking? Consider topics that focus on relevant keywords and relate back to your website or business. You can also add hashtags (#vacation #dream #summer) throughout your posts to reach more people, and help visitors search for relevant content. Blogging gives your site a voice, so let your business’ personality shine through. Choose a great image to feature in your post or add a video for extra engagement. Are you ready to get started? Simply create a new post now.",
        image: "https://static.wixstatic.com/media/c22c23_b8eb71c2f20244a484c34e129f752983~mv2.png/v1/fill/w_454,h_255,fp_0.50_0.50,q_95,enc_auto/c22c23_b8eb71c2f20244a484c34e129f752983~mv2.png",
    },
    {
        title: "This Artist Will Blow Your Mind",
        content: "Writing a blog is a great way to position yourself as an authority in your field and captivate your readers’ attention. Do you want to improve your site’s SEO ranking? Consider topics that focus on relevant keywords and relate back to your website or business. You can also add hashtags (#vacation #dream #summer) throughout your posts to reach more people, and help visitors search for relevant content. Blogging gives your site a voice, so let your business’ personality shine through. Choose a great image to feature in your post or add a video for extra engagement. Are you ready to get started? Simply create a new post now.",
        image: "https://static.wixstatic.com/media/c22c23_8c2ddf514a534ed9ba6bfac87cd292ea~mv2_d_1920_1409_s_2.png/v1/fill/w_454,h_333,fp_0.50_0.50,q_95,enc_auto/c22c23_8c2ddf514a534ed9ba6bfac87cd292ea~mv2_d_1920_1409_s_2.png",
    }
]