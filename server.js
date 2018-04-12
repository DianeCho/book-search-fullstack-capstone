//import external resources
const express = require('express');
const morgan = require('morgan');
const unirest = require('unirest');
const events = require('events');
const SimpleGoodreads = require('simple-goodreads');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./config');
const bodyParser = require('body-parser');


//connection mongoose schemas
var book = require('./models/book');
const User = require('./models/user');
var list = require('./models/list');

//creating app object, add multiple endpoints
const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

var shoppingList = new Array('');
var shopListItem = new Object();



//setting up the server to run as a module
var runServer = function (callback) {
    mongoose.connect(config.DATABASE_URL, function (err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function () {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};
if (require.main === module) {
    runServer(function (err) {
        if (err) {
            console.error(err);
        }
    });
};



// external api function, connect to yummly api
//var getRecepiesFromYum = function (searchTerm) {
//    var emitter = new events.EventEmitter();
//    //console.log("inside getFromActive function");
//    unirest.get("http://api.yummly.com/v1/api/recipes?_app_id=35372e2c&_app_key=971c769d4bab882dc3281f0dc6131324&q=" + searchTerm + '&maxResult=12')
//        .header("Accept", "application/json")
//        .end(function (result) {
//            // //console.log(result.status, result.headers, result.body);
//            //success scenario
//            if (result.ok) {
//                emitter.emit('end', result.body);
//            }
//            //failure scenario
//            else {
//                emitter.emit('error', result.code);
//            }
//        });
//
//    return emitter;
//};



//get single recipes from yummly
//var getSingleFromYum = function (recipeId) {
//    console.log(recipeId);
//    var emitter = new events.EventEmitter();
//    //console.log("inside getFromActive function");
//    //console.log("http://api.yummly.com/v1/api/recipe/" + recipeId + "?_app_id=35372e2c&_app_key=971c769d4bab882dc3281f0dc6131324");
//    unirest.get("http://api.yummly.com/v1/api/recipe/" + recipeId + "?_app_id=35372e2c&_app_key=971c769d4bab882dc3281f0dc6131324")
//        .header("Accept", "application/json")
//        .end(function (result) {
//            //console.log(result.status, result.headers, result.body);
//            //success scenario
//            if (result.ok) {
//                emitter.emit('end', result.body);
//            }
//            //failure scenario
//            else {
//                emitter.emit('error', result.code);
//            }
//        });
//
//    return emitter;
//};

//external api call to goodreads (search by title)
//testing url http://localhost:5001/book-search-title/shogun
app.get('/book-search-title/:titleName', function (req, res) {
    console.log(req.params.titleName);
    var goodreads = new SimpleGoodreads();
    goodreads.searchBook(req.params.titleName, function (err, book) {
        // book is retrieved
        console.log(book.id); // 3
        console.log(book.title); // Harry Potter and the Sorcerer\'s Stone (Harry Potter, #1)
        console.log(book.author); // J.K. Rowling
        console.log(book.publication_year); // 1997
        console.log(book.rating); // 4.40
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        if (book) {
            return res.json(book);
        }
    });
});


//external api call to goodreads (search by author)
//testing url http://localhost:5001/book-search-author/george
app.get('/book-search-author/:authorName', function (req, res) {
    console.log(req.params.authorName);
    var goodreads = new SimpleGoodreads();
    goodreads.authorInfo(req.params.authorName, function (err, author) {
        // author is retrieved
        console.log(author.id); // 3706
        console.log(author.name); // George Orwell
        console.log(author.link); // https://www.goodreads.com/author/show/3706.George_Orwell
        console.log(author.gender); // male
        console.log(author.hometown); // Motihari, Bihar
        console.log(author.born_at); // 1903/06/25
        console.log(author.died_at); // 1950/01/21
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        if (author) {
            return res.json(author);
        }
    })
});


//local api endpoints


// creating a new user
app.post('/users/create', (req, res) => {


    //get first and last name as well as email and password from request
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    let password = req.body.password;


    //exclude spaces from email and password
    email = email.trim();
    password = password.trim();

    //generate encrption key for password
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }

        //using encrytption key above encrpyt the password
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }

            //with encrpted password add user to db
            User.create({
                fname,
                lname,
                email,
                password: hash,
            }, (err, item) => {

                //if adding user to db return errors display it
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error'
                    });
                }

                //if adding user to db is successful, then create
                if (item) {
                    //console.log(`User \`${fname}\` created.`);
                    return res.json(item);
                }
            });
        });
    });
});



// api point to sign in users
app.post('/users/signin', function (req, res) {

    //search db for user with email provided
    User
        .findOne({
        email: req.body.email
    }, function (err, items) {


        //if db connection does not work, show message
        if (err) {
            return res.status(500).json({
                message: "Internal server error"
            });
        }


        //if user not found return error
        if (!items) {
            // bad username
            return res.status(401).json({
                message: "Not found!"
            });
        } else {


            //if user is found, validate password
            items.validatePassword(req.body.password, function (err, isValid) {


                //if db connection does not work, show message
                if (err) {
                    //console.log('There was an error validating the password.');
                }


                //invalid password
                if (!isValid) {
                    return res.status(401).json({
                        message: "Not found"
                    });
                }


                //login and password successful
                else {
                    return res.json(items);
                }
            });
        };
    });
});



//function takes two arrays from a recipe.  It ensure that the short list item is present in the qty item.
//If so, it checks the shoppingList array to see if the shortlist item is present.
//If so it adds the qty to the shortlist qty.
//if its not present, it adds the shortlist item and qty to shopping list.

//function storeIngredient(shortList, qtyList) {
//
//    //looping through qtylist array
//    for (let x = 0; x < qtyList.length; x++) {
//        if (shortList[x] !== undefined) {
//            let shortListLower = shortList[x].toLowerCase();
//        }
//        //        let listCounter = 0;
//        let found = 0;
//
//
//        //loops through qtylist array in order to match to short list array
//        for (let listCounter = 0; listCounter < qtyList.length; listCounter++) {
//            if (found < 1) {
//                let qtylistLower = qtyList[x].toLowerCase();
//
//                //if no match do nothing
//                if ((shortList[x] == '') && (qtyList[x] == '') && (shortList[x] == undefined) && (qtyList[x] == undefined)) {
//                    //console.log("inside if -->", listCounter);
//                }
//
//                //if there is match...
//                else {
//
//                    //add match to db
//                    list.create({
//                        ingredient: shortList[x],
//                        qty: qtyList[x]
//
//                    });
//                    found = 1;
//                }
//            }
//        }
//        found = 0;
//    }
//}




//create ingredients api endpoint
//app.post('/ingredients/create', function (req, res) {
//    list.create({
//        ingredient: req.body.ingredient,
//        qty: req.body.qty,
//
//    }, function (err, item) {
//        if (err) {
//            return res.status(500).json({
//                message: 'Internal Server Error'
//            });
//        }
//        res.status(201).json(item);
//    });
//});



//get all recipes api endpoint
app.get('/c/', function (req, res) {
    recipe.find(function (err, item) {
        //        //console.log(item);
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(200).json(item);
    });
});



////search recipes by name api endpoint
//app.get('/search-recipes/:name', (req, res) => {
//    //console.log(req);
//    //    external api function call and response
//
//    var searchReq = getRecepiesFromYum(req.params.name);
//
//    //get the data from the first api call
//    searchReq.on('end', function (item) {
//        res.json(item);
//    });
//
//    //error handling
//    searchReq.on('error', function (code) {
//        res.sendStatus(code);
//    });
//
//});


//search book by title api endpoint
app.get('/book-search-title/:titleName', (req, res) => {
    //console.log(req);
    //    external api function call and response

    var searchReq = getBooksFromGood(req.params.titleName);

    //get the data from the first api call
    searchReq.on('end', function (item) {
        res.json(item);
    });

    //error handling
    searchReq.on('error', function (code) {
        res.sendStatus(code);
    });

});

//search recipes by ID api endpoint
//app.get('/get-recipe/:id', (req, res) => {
//
//    //console.log(req.params.id);
//    //    external api function call and response
//
//    var aRecipe = getSingleFromYum(req.params.id);
//
//    //get the data from the first api call
//    aRecipe.on('end', function (item) {
//        res.json(item);
//
//        //????
//        //        res.json(item.ingredientLines[0]);
//    });
//
//    //error handling
//    aRecipe.on('error', function (code) {
//        res.sendStatus(code);
//    });
//
//});


////search books by ID api endpoint
//app.get('/book-search/:id', (req, res) => {
//
//    //console.log(req.params.id);
//    //    external api function call and response
//
//    var aBook = getSingleFromGood(req.params.id);
//
//    //get the data from the first api call
//    aBook.on('end', function (item) {
//        res.json(item);
//
//        //????
//        //        res.json(item.ingredientLines[0]);
//    });
//
//    //error handling
//    aBook.on('error', function (code) {
//        res.sendStatus(code);
//    });
//
//});


////get shortlist api endpoint
//app.get('/retrieve-sList/', function (req, res) {
//    list.find({}).sort({
//        ingredient: 1
//    }).exec(function (err, item) {
//        //console.log(item);
//        if (err) {
//            return res.status(500).json({
//                message: 'Internal Server Error'
//            });
//        }
//        //console.log(item);
//        res.status(200).json(item);
//    })
//})


//add recipe api endpoint to db
app.post('/add-book-db/', function (req, res) {
    //    console.log(req.body.username);
    book.create({

        author: req.body.author,
        image_url: req.body.image_url,
        title: req.body.title,
        username: req.body.username,
        review: '',
    },
                function (err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
    });
    //    list.create({
    //        ingredients: JSON.stringify(item.ingredientLines)
    //
    //    }, function (err, item) {
    //  stor  if (err) {
    //            return res.status(500).json({
    //                message: 'Internal Server Error'
    //            });
    //        }
    //        //            res.status(201).json(item);
    //    });
    //
    //
    //    res.json(item);
    //});
    //error handling
    //aRecipe.on('error', function (code) {
    //console.log('getSingleFromYum from api not working');
    //res.sendStatus(code);
    //});
});

app.get('/get-book-db/:username', function (req, res) {
    console.log(req.params.username);
    book.find({
        username: req.params.username,
    },
              function (err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(200).json(item);
    });
});


app.put('/update-review/:id', function (req, res) {
    var toUpdate = {};
    var updateableFields = ['review'];
    updateableFields.forEach(function (field) {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    book.findByIdAndUpdate(req.params.id, {
        $set: toUpdate
    }).exec().then(function (book) {
        return res.status(204).json({
            book: book
        });
    }).catch(function (err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
});

//storeIngredient(req.body.shortList.split(","), item.ingredientLines);
//console.log(item.ingredientLines);
//db connection and data queries
//    recipe.create({
//        name: req.body.name,
//        rating: req.body.rating,
//        course: req.body.course,
//        id: req.body.id,
//        day: req.body.day,
//        shortList: req.body.shortList,
//        username: req.body.username,
//        ingredients: JSON.stringify(item.ingredientLines)
//
//    }, function (err, item) {
//        if (err) {
//            return res.status(500).json({
//                message: 'Internal Server Error'
//            });
//        }
//        res.status(201).json(item);
//    });
//
//    list.create({
//        ingredients: JSON.stringify(item.ingredientLines)
//
//    }, function (err, item) {
//        if (err) {
//            return res.status(500).json({
//                message: 'Internal Server Error'
//            });
//        }
//        //            res.status(201).json(item);
//    });
//
//
//    res.json(item);
//});
//error handling
//aRecipe.on('error', function (code) {
//console.log('getSingleFromYum from api not working');
//res.sendStatus(code);
//});


//});


//delete ingredient api endpoint by id
app.delete('/delete/', function (req, res) {
    //console.log(req.params.id);
    book.findByIdAndRemove(req.params.id, function (err, items) {
        if (err)
            return res.status(404).json({
                message: 'Item not found.'
            });

        res.status(201).json(items);
    });
});



//delete ingredients wihtout quantity api endpoint
app.delete('/delete-empty-books/', function (req, res) {
    //find ingredients without the "qty" field and remove them
    list
        .find({
            qty: {
                $exists: false
            }
        }).remove().exec().then(function (items) {
            return res.status(204).json({
                message: 'removed'
            }).end();
        }).catch(function (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        });
});



//delete recipe api endpoint by id
app.delete('/deleterec/:id', function (req, res) {
    //console.log(req.params.id);
    if (req.params.id = 'killAll') {

        book.remove({}, function (err, items) {
            if (err)
                return res.status(404).json({
                    message: 'Item not found.'
                });

            res.status(201).json(items);
        });


    };
});



//delete all recipes
app.delete('/deletering/:id', function (req, res) {
    //console.log(req.params.id);
    if (req.params.id = 'killAll') {

        book.remove({}, function (err, items) {
            if (err)
                return res.status(404).json({
                    message: 'Item not found.'
                });

            res.status(201).json(items);
        });
    };
});



//export and run
exports.app = app;
exports.runServer = runServer;
//app.listen(process.env.PORT || 8080);
