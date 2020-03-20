// jshint esversion:6

const express = require('express');
const app = express();
const _ = require('lodash');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));

mongoose.connect("mongodb+srv://admin-choton:9804750147@cluster0-j7z2c.mongodb.net/blog_app", { useNewUrlParser: true, useUnifiedTopology: true });

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        max: 100,
        required: true,
    },
    post: {
        type: String,
        required: true,
    },
});

const Blog = mongoose.model("Blog", blogSchema);

const Day1 = new Blog({
    title: 'Day1',
    post: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
});

// Day1.save();
const Day2 = new Blog({
    title: 'Day2',
    post: 'Integer suscipit tortor nulla, id convallis leo maximus ac.'
});
// Day2.save();

const blog = [Day1, Day2];



app.get('/', (req, res) => {

    Blog.find({}, (err, data) => {
        if (!err) {
            if (data.length === 0) {
                Blog.create(blog, (err, blogs) => {
                    if (err) {
                        console.log(err);
                    } else {
                        // console.log('Successfully created ' + blogs);
                        res.redirect('/');
                    }
                });
            } else {
                res.render('index', { blog: data });
            }
        }
    });

});

app.get('/compose', (req, res) => {
    res.render('compose');
});

app.get('/about', (req, res) => {

    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
})

app.post('/', (req, res) => {

    const doc = {
        title: req.body.title,
        post: req.body.post,
    };
    Blog.create(doc, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            // console.log('Successfully created ' + doc);
            res.redirect('/');
        }
    });
});

app.get('/:id', (req, res) => {

    const paramID = req.params.id;
    // console.log(paramID);

    Blog.findById(paramID, (err, data) => {

        if (err) {
            console.log(err);

        } else {
            res.render('show', { title: data.title, post: data.post, id: data._id });
        }


    });
});

app.get("/:id/update", (req, res) => {
    Blog.findById(req.params.id, (err, data) => {
        // console.log(data);

        if (err) {
            res.redirect('back');

        } else {
            res.render('update', { title: data.title, post: data.post, id: data._id });
        }
    });
});


app.post('/:id', (req, res) => {

    Blog.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        post: req.body.post
    }, (err, data) => {
        if (err) {
            console.log(err);

        } else {
            res.redirect("/" + req.params.id);
        }
    });
});

app.delete('/:id', (req, res) => {

    Blog.findByIdAndRemove(req.params.id, (err, data) => {
        if (!err) {

            res.redirect('/');
        }
    });
});




app.listen(port, () => console.log('Server is running'));