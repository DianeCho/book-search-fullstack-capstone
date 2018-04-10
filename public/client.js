let loggedInUser = undefined;


function buildBookList(dataOutput, username) {
    //builds recipe html for user selection
    console.log(dataOutput);
    var buildHtml = '';

    //    $.each(dataOutput.matches,
    //        function (key, value) {

    buildHtml += '<li>';
    buildHtml += '<div class="booktitle">';
    buildHtml += '<label for="title">' + dataOutput.title + '</label>';
    buildHtml += '</div>';
    buildHtml += '<img src="' + dataOutput.image_url + '" class="bookimg" alt="">';
    buildHtml += '<div class="books">';
    buildHtml += '<ul class="bookslist">';
    buildHtml += '<li>' + dataOutput.author + '</li>';
    buildHtml += '</ul>';
    buildHtml += '</div>';
    buildHtml += '<button type="button" class="addbtn">Add to list</button>';
    buildHtml += '</li>';
    //        });
    buildHtml += "<form class='storeToDb'>";
    buildHtml += "<input type='hidden' class='storeToDbUserName' value='" + username + "'>";
    buildHtml += "<input type='hidden' class='storeToDbAuthor' value='" + dataOutput.author + "'>";
    buildHtml += "<input type='hidden' class='storeToDbTitle' value='" + dataOutput.title + "'>";
    buildHtml += '<button type="button" class="addbtn">Add to list</button>';
    buildHtml += "</form>";
    $('.goodreads-search-results').html(buildHtml);

};


$(document).ready(function () {
    //    when the page loads
    $('.js-search-page').hide();
    $('.js-books-page').hide();
    $('.js-booklist-page').hide();
    $('.js-login-page').hide();
    $('.js-newuser-page').hide();
    //    $("#messageBox").hide();
});

//button triggers

$(document).on('click', '.signinlink', function (event) {
    event.preventDefault();
    $('.js-login-page').show();
    $('.js-newuser-page').hide();
});


$(document).on('click', '.enter', function (event) {
    event.preventDefault();
    $('.js-login-page').show();
    $('.js-main-page').hide();
});


//trigger for the register form
$(document).on('click', '.newuser', function (event) {
    event.preventDefault();
    $('.js-newuser-page').show();
    $('.js-login-page').hide();
});

//trigger to register a new user
$(document).on('submit', '.js-newuser-form', function (event) {
    event.preventDefault();

    let fname = $('#fname').val();
    let lname = $('#lname').val();
    let email = $('#email').val();
    let pw = $('#npassword').val();
    let confirmPw = $('#cpassword').val();
    console.log(fname, lname, email, pw, confirmPw);
    if (email == "") {
        displayError('Please add an email');
    } else if (pw !== confirmPw) {
        displayError('Passwords must match!');
    } else {
        const newUserObject = {
            fname: fname,
            lname: lname,
            email: email,
            password: pw
        };
        // will assign a value to variable 'user' in signin step below
        // AJAX call to send form data up to server/DB and create new user
        $.ajax({
                type: 'POST',
                url: '/users/create',
                dataType: 'json',
                data: JSON.stringify(newUserObject),
                contentType: 'application/json'
            })
            .done(function (result) {
                console.log(result);
                displayError('Thanks for signing up! You may now sign in with your username and password.');
                $('.js-login-page').show();
                $('.js-newuser-page').hide();
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    };
});



$(document).on('click', '.login', function (event) {
    event.preventDefault();
    let email = $('#sign-in-username').val();
    let password = $('#sign-in-password').val();

    if ((!email) || (email.length < 1) || (email.indexOf(' ') > 0)) {
        displayError('Invalid username');
    } else if ((!password) || (password.length < 1) || (password.indexOf(' ') > 0)) {
        displayError('Invalid password');
    } else {
        const unamePwObject = {
            email: email,
            password: password
        };
        $.ajax({
                type: "POST",
                url: "/users/signin",
                dataType: 'json',
                data: JSON.stringify(unamePwObject),
                contentType: 'application/json'
            })
            .done(function (result) {
                console.log(result);
                loggedInUser = result.email;
                // show the signout link in header as soon as user is signed in

                $('.js-search-page').show();
                $('.js-query-username').val(result.email);
                $('.js-login-page').hide();
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                displayError('Invalid username and password combination. Please check your username and password and try again.');
            });
    }
});

$(document).on('click', '.searchbtn', function (event) {
    event.preventDefault();

    let searchString = $('.js-query').val();
    let searchUserName = $('.js-query-username').val();
    console.log(searchString, searchUserName);

    if ((!searchString) || (searchString.length < 1)) {
        displayError('Invalid search string');
    } else {

        $.ajax({
                type: "GET",
                url: '/book-search-title/' + searchString,
                dataType: 'json',
            })
            .done(function (dataOutput) {
                //                console.log(dataOutput);
                buildBookList(dataOutput, searchUserName);

            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    }

    $('.js-books-page').show();
    $('.js-search-page').hide();
});


function buildBookReview(result) {
    //builds ingredient list for ingredients page
    console.log(result);
    let aggregateList = [];
  //    let aggregateLower = '';
  //    let currentBook = '';
  //    let oldBook = '';
  //    let bookHtml = '';
  //    for (let e = 0; e < result.length; e++) {
  //        if (result[e].title !== undefined) {
  //            var resultconvert = result[e].title;
  //            //console.log(resultconvert);
  //            var resultLower = resultconvert.toLowerCase();
  //            currentBook = resultLower;
  //
  //            if (currentBook !== oldBook) {
  //                bookHtml += '<li>';
  //                bookHtml += '<div class="book-box">';
  //                bookHtml += '<label for="book">' + result[e].title + '</label>';
  //                bookHtml += '<img src="' + result[e].image_url + '" class="bookimg" alt="">';
  //                bookHtml += '<ul class="bookreviewlist">';
  //                bookHtml += '<textarea class="reviewbookbox" rows="4" cols="50">' + result[e].review + '';
  //                bookHtml += '</textarea>';
  //                bookHtml += '</ul>';
  //                bookHtml += '<button type="button" class="reviewbtn">Review</button>';
  //                bookHtml += '<button type="button" class="savebtn">Save</button>';
  //                bookHtml += '</div>';
  //                bookHtml += '</li class ="ingredientslist">';
  //
  //            }
  //            //            if (currentBook !== oldBook) {
  //            //                ingredientHtml += '<li id="' + result[e].title + '">';
  //            //                ingredientHtml += '<div class="ingredients-box">';
  //            //                ingredientHtml += '<label for="ingredients">' + result[e].title + '</label>';
  //            //                ingredientHtml += '<ol class ="ingredientslist">';
  //            //
  //            //            }
  //
  //            bookHtml += '<li> ' + result[e].author;
  //            bookHtml += '<form class="deleteDb">';
  //            bookHtml += '<input type="hidden" class = "deleteFromDBName" value=' + result[e].title + ">";
  //            bookHtml += '<input type="hidden" class = "deleteFromDB" value=' + result[e]._id + ">";
  //
  //            bookHtml += '<button class ="deletebtn" type="button">';
  //            bookHtml += '<i class="fa fa-trash" aria-hidden="true"></i> ';
  //            bookHtml += '</button>  ';
  //            bookHtml += '</form> ';
  //            bookHtml += '</li> ';
  //            let a = e;
  //            a++;
  //            if (a < result.length) {
  //                resultconvert = result[a].title;
  //                resultLower = resultconvert.toLowerCase();
  //            }
  //
  //            //console.log(currentIngredient, oldIngredient);
  //            if (currentBook !== resultLower) {
  //                //console.log('!', currentIngredient, oldIngredient);
  //                //console.log('!', currentIngredient, oldIngredient);
  //                bookHtml += '</ol></div></li>';
  //
  //            }
  //            oldBook = currentBook;
  //        }
//          $('.js-booklist-page .container ul').html(bookHtml);
 //          }
    console.log('aggregate', aggregateList);
  //    build output
};


$(document).on('click', '.continuebtn', function (event) {
    event.preventDefault();
    let username = $('.js-query-username').val();
    $.ajax({
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            url: '/get-book-db/' + username,
        })
        .done(function (result) {
            console.log(result);
            buildBookReview(result);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });

    $('.js-booklist-page').show();
    $('.js-books-page').hide();
});


$(document).on('submit', '.savebtn', function (event) {
    event.preventDefault();

    $.ajax({
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            url: '/retrieve-sList/',
        })
        .done(function (result) {
            buildBookReview(result);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
    $('.js-booklist-page').show();
    $('.js-books-page').hide();
});


$(document).on('click', '#returnbtn', function (event) {

    event.preventDefault();
    $('.js-search-page').show();
    $('.js-booklist-page').hide();
});

$(document).on('click', '#returnmain', function (event) {

    event.preventDefault();
    $('.js-main-page').show();
    $('.js-booklist-page').hide();
});


$(document).on('click', '.deletebtn', function (event) {
    event.preventDefault();
    console.log('removed button');

    $(this).closest('.ingredientslist li').hide();

    var idValue = $(this).parent().find('.deleteFromDB').val();
    var nameValue = $(this).parent().find('.deleteFromDBName').val();

    //console.log(deleteObject);

    console.log(idValue);
    $.ajax({
            method: 'DELETE',
            dataType: 'json',
            contentType: 'application/json',
            url: '/delete/' + idValue,
        })
        .done(function (result) {
            displayError("Deleted");
            //if the last quantity of an ingredient is deleted delete the parent ingredient too
            $.ajax({
                    method: 'DELETE',
                    dataType: 'json',
                    contentType: 'application/json',
                    url: '/delete-empty-ingredients/'
                })
                .done(function (result) {
                    console.log(result);
                    $('#' + nameValue).remove();
                })
                .fail(function (jqXHR, error, errorThrown) {
                    console.log(jqXHR);
                    console.log(error);
                    console.log(errorThrown);
                });

            //refresh the container with all the ingredients
            $.ajax({
                    method: 'GET',
                    dataType: 'json',
                    contentType: 'application/json',
                    url: '/retrieve-sList/',
                })
                .done(function (result) {
                    buildBookList(result);
                })
                .fail(function (jqXHR, error, errorThrown) {
                    console.log(jqXHR);
                    console.log(error);
                    console.log(errorThrown);
                });

        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
});

function addToList(title, author) {
    //Populates Menu section of Search.html
    var buildMenuHtml = '';
    //buildMenuHtml += '<li><h3>' + $('#recipeDay').val() + '</h3></li>';
    buildMenuHtml += '<li><a href="https://www.yummly.com/#recipe/' + id + '" target="_blank" alt="Link to Yummly Recipe" title="Link to Yummly Recipe">' + recipeName + ' </a></li>';
    var dayId = '#' + $('#recipeDay').val();
    $(dayId).append(buildMenuHtml);
    //    menu += '<li><h3>' + dayId + '</h3></li>';
    //    menu += buildMenuHtml;
    //    console.log(menu);

};
$(document).on('click', '.addbtn', function (event) {
    //Stores a recipe selected to Mongo.
    event.preventDefault();
    console.log('add books to list');

    var recipeNameValue = $(this).parent().find('.storeToDbName').val();
    var bookUserName = $(this).parent().find('.storeToDbUserName').val();
    var bookAuthor = $(this).parent().find('.storeToDbAuthor').val();
    var bookTitle = $(this).parent().find('.storeToDbTitle').val();

    //    alert(bookUserName);
    //    alert(bookAuthor);
    //    alert(bookTitle);


    var bookObject = {
        'username': bookUserName,
        'author': bookAuthor,
        'title': bookTitle

    };

    console.log(bookObject);
    $.ajax({
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(bookObject),
            url: '/add-book-db/',
        })
        .done(function (result) {
            console.log(result);
            //            displayError("Added to list");
            //             addToList(bookObject.name, bookObject.id);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
});

$(document).on('click', '#addbutton', function (event) {
    event.preventDefault();
    console.log('add more ingredients to shopping list');

    let ingredientName = $('.js-query-ingredient-name').val();
    let ingredientQty = $('.js-query-ingredient-qty').val();

    if ((!ingredientName) || (ingredientName.length < 1)) {
        displayError('Invalid ingredient name');
    } else if ((!ingredientQty) || (ingredientQty.length < 1)) {
        displayError('Invalid ingredient Quantity');
    } else {

        const newIngredientObject = {
            ingredient: ingredientName,
            qty: ingredientQty
        };
        // will assign a value to variable 'user' in signin step below
        // AJAX call to send form data up to server/DB and create new user
        $.ajax({
                type: 'POST',
                url: '/ingredients/create',
                dataType: 'json',
                data: JSON.stringify(newIngredientObject),
                contentType: 'application/json'
            })
            .done(function (result) {
                console.log(result);
                displayError('Ingredients added');
                $.ajax({
                        method: 'GET',
                        dataType: 'json',
                        contentType: 'application/json',
                        url: '/retrieve-sList/',
                    })
                    .done(function (result) {
                        buildBookList(result);
                    })
                    .fail(function (jqXHR, error, errorThrown) {
                        console.log(jqXHR);
                        console.log(error);
                        console.log(errorThrown);
                    });
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    }
});


///////////////////////////////Live code above/////////////////////////////////




///////////////////////////////Example code below/////////////////////////////////


//function displayError(message) {
//    $("#messageBox span").html(message);
//    $("#messageBox").fadeIn();
//    $("#messageBox").fadeOut(10000);
//};

//function buildRecipeList(dataOutput, username) {
//    //builds recipe html for user selection
//    //console.log(dataOutput);
//    var buildHtml = '';
//
//    $.each(dataOutput.matches,
//        function (key, value) {
//
//            //ours
//            buildHtml += '<li>';
//            buildHtml += '<div class="recipetitle">';
//            buildHtml += '<label for="title">' + value.recipeName + '</label>';
//            buildHtml += '<a href="https://www.yummly.com/#recipe/ ' + value.id + '" target="_blank" alt="Link to Yummly Recipe" title="Link to Yummly Recipe">';
//            buildHtml += '<i class="fa fa-info-circle" aria-hidden="true"></i>';
//            buildHtml += '</a>';
//            buildHtml += '</div>';
//            buildHtml += '<img src="' + value.smallImageUrls[0] + '" class="recipe" alt="">';
//            buildHtml += '<div class="recipes">';
//            buildHtml += '<ul class="recipeslist">';
//            buildHtml += '<li class="rating">';
//            buildHtml += 'Rating: ' + value.rating;
//            buildHtml += '</li>';
//            buildHtml += '<li class="course">';
//            buildHtml += 'Course: ' + value.attributes.course;
//            buildHtml += '</li>';
//            buildHtml += '<li class="title">';
//            buildHtml += 'Ingredients:';
//            buildHtml += '</li>';
//            buildHtml += '<li>';
//
//
//            buildHtml += '<ol class="ingredientBox">';
//            let shortList = "";
//            $.each(value.ingredients, function (subkey, subvalue) {
//
//                buildHtml += '<li class="ingredientlistfromrecipe">';
//                buildHtml += subvalue;
//                buildHtml += '</li>';
//
//                shortList += subvalue + ",";
//
//            });
//            buildHtml += '</ol>'
//
//            buildHtml += '</li>';
//            buildHtml += '<li>';
//            buildHtml += "<form class='storeToDb'>";
//            buildHtml += "<input type='hidden' class='storeToDbName' value='" + value.recipeName + "'>";
//            buildHtml += "<input type='hidden' class='storeToDbRating' value='" + value.rating + "'>";
//            buildHtml += "<input type='hidden' class='storeToDbCourse' value='" + value.attributes.course + "'>";
//            buildHtml += "<input type='hidden' class='storeToDbId' value='" + value.id + "'>";
//            buildHtml += "<input type='hidden' class='storeToShortList' value='" + shortList + "'>";
//            buildHtml += "<input type='hidden' class='storeToUserName' value='" + username + "'>";
//            buildHtml += '<button type="button" class="addbtn">Add to list</button>';
//            buildHtml += "</form>";
//
//            buildHtml += '</li>';
//            buildHtml += '</ul>';
//            buildHtml += '</div>';
//
//            buildHtml += '</li>';
//            //    console.log(buildHtml);
//        });
//    $('.goodreads-search-results').html(buildHtml);
//
//};



//$(document).ready(function () {
//    //    when the page loads
//    $('.js-search-page').hide();
//    $('.js-books-page').hide();
//    $('.js-booklist-page').hide();
//    $('.js-login-page').hide();
//    $('.js-newuser-page').hide();
//    $("#messageBox").hide();
//});

//button triggers

//$(document).on('click', '.signinlink', function (event) {
//    event.preventDefault();
//    $('.js-login-page').show();
//    $('.js-newuser-page').hide();
//});
//
//
//$(document).on('click', '.enter', function (event) {
//    event.preventDefault();
//    $('.js-login-page').show();
//    $('.js-main-page').hide();
//});
//
//
////trigger for the register form
//$(document).on('click', '.newuser', function (event) {
//    event.preventDefault();
//    $('.js-newuser-page').show();
//    $('.js-login-page').hide();
//});
//
////trigger to register a new user
//$(document).on('submit', '.js-newuser-form', function (event) {
//    event.preventDefault();
//
//    let fname = $('#fname').val();
//    let lname = $('#lname').val();
//    let email = $('#email').val();
//    let pw = $('#npassword').val();
//    let confirmPw = $('#cpassword').val();
//    console.log(fname, lname, email, pw, confirmPw);
//    if (email == "") {
//        displayError('Please add an email');
//    } else if (pw !== confirmPw) {
//        displayError('Passwords must match!');
//    } else {
//        const newUserObject = {
//            fname: fname,
//            lname: lname,
//            email: email,
//            password: pw
//        };
//        // will assign a value to variable 'user' in signin step below
//        // AJAX call to send form data up to server/DB and create new user
//        $.ajax({
//                type: 'POST',
//                url: '/users/create',
//                dataType: 'json',
//                data: JSON.stringify(newUserObject),
//                contentType: 'application/json'
//            })
//            .done(function (result) {
//                console.log(result);
//                displayError('Thanks for signing up! You may now sign in with your username and password.');
//                $('.js-login-page').show();
//                $('.js-newuser-page').hide();
//            })
//            .fail(function (jqXHR, error, errorThrown) {
//                console.log(jqXHR);
//                console.log(error);
//                console.log(errorThrown);
//            });
//    };
//});
//
//
//
//$(document).on('click', '.login', function (event) {
//    event.preventDefault();
//    let email = $('#sign-in-username').val();
//    let password = $('#sign-in-password').val();
//
//    if ((!email) || (email.length < 1) || (email.indexOf(' ') > 0)) {
//        displayError('Invalid username');
//    } else if ((!password) || (password.length < 1) || (password.indexOf(' ') > 0)) {
//        displayError('Invalid password');
//    } else {
//        const unamePwObject = {
//            email: email,
//            password: password
//        };
//        $.ajax({
//                type: "POST",
//                url: "/users/signin",
//                dataType: 'json',
//                data: JSON.stringify(unamePwObject),
//                contentType: 'application/json'
//            })
//            .done(function (result) {
//                console.log(result);
//                loggedInUser = result.email;
//                // show the signout link in header as soon as user is signed in
//
//                $('.js-search-page').show();
//                $('.js-query-username').val(result.email);
//                $('.js-login-page').hide();
//            })
//            .fail(function (jqXHR, error, errorThrown) {
//                console.log(jqXHR);
//                console.log(error);
//                console.log(errorThrown);
//                displayError('Invalid username and password combination. Please check your username and password and try again.');
//            });
//    }
//});


//$(document).on('click', '.searchbtn', function (event) {
//    event.preventDefault();
//
//    let searchString = $('.js-query').val();
//    let searchUserName = $('.js-query-username').val();
//
//    if ((!searchString) || (searchString.length < 1)) {
//        displayError('Invalid search string');
//    } else {
//
//        $.ajax({
//                type: "GET",
//                url: '/search-recipes/' + searchString,
//                dataType: 'json',
//            })
//            .done(function (dataOutput) {
//                console.log(dataOutput);
//                buildRecipeList(dataOutput, searchUserName);
//
//            })
//            .fail(function (jqXHR, error, errorThrown) {
//                console.log(jqXHR);
//                console.log(error);
//                console.log(errorThrown);
//            });
//    }
//
//    $('.js-books-page').show();
//    $('.js-search-page').hide();
//});


//function buildBookList(result) {
//    //builds ingredient list for ingredients page
//    console.log(result);
//    let aggregateList = [];
//    let aggregateLower = '';
//    let currentIngredient = '';
//    let oldIngredient = '';
//    let ingredientHtml = '';
//    for (let e = 0; e < result.length; e++) {
//        if (result[e].ingredient !== undefined) {
//            var resultconvert = result[e].ingredient;
//            //console.log(resultconvert);
//            var resultLower = resultconvert.toLowerCase();
//            currentIngredient = resultLower;
//
//            if (currentIngredient !== oldIngredient) {
//                ingredientHtml += '<li id="' + result[e].ingredient + '">';
//                ingredientHtml += '<div class="ingredients-box">';
//                ingredientHtml += '<label for="ingredients">' + result[e].ingredient + '</label>';
//                ingredientHtml += '<ol class ="ingredientslist">';
//
//            }
//
//            ingredientHtml += '<li> ' + result[e].qty;
//            ingredientHtml += '<form class="deleteDb">';
//            ingredientHtml += '<input type="hidden" class = "deleteFromDBName" value=' + result[e].ingredient + ">";
//            ingredientHtml += '<input type="hidden" class = "deleteFromDB" value=' + result[e]._id + ">";
//
//            ingredientHtml += '<button class ="deletebtn" type="button">';
//            ingredientHtml += '<i class="fa fa-trash" aria-hidden="true"></i> ';
//            ingredientHtml += '</button>  ';
//            ingredientHtml += '</form> ';
//            ingredientHtml += '</li> ';
//            let a = e;
//            a++;
//            if (a < result.length) {
//                resultconvert = result[a].ingredient;
//                resultLower = resultconvert.toLowerCase();
//            }
//
//            //console.log(currentIngredient, oldIngredient);
//            if (currentIngredient !== resultLower) {
//                //console.log('!', currentIngredient, oldIngredient);
//                //console.log('!', currentIngredient, oldIngredient);
//                ingredientHtml += '</ol></div></li>';
//
//            }
//            oldIngredient = currentIngredient;
//        }
//        $('.js-booklist-page .container ul').html(ingredientHtml);
//    }
//    //console.log('aggregate', aggregateList);
//    //build output
//};

//$(document).on('click', '.continuebtn', function (event) {
//    event.preventDefault();
//
//    $.ajax({
//            method: 'GET',
//            dataType: 'json',
//            contentType: 'application/json',
//            url: '/retrieve-sList/',
//        })
//        .done(function (result) {
//            buildBookList(result);
//        })
//        .fail(function (jqXHR, error, errorThrown) {
//            console.log(jqXHR);
//            console.log(error);
//            console.log(errorThrown);
//        });
//
//    $('.js-booklist-page').show();
//    $('.js-books-page').hide();
//});
//
//$(document).on('click', '#returnbtn', function (event) {
//
//    event.preventDefault();
//    $('.js-search-page').show();
//    $('.js-booklist-page').hide();
//});
//
//$(document).on('click', '#returnmain', function (event) {
//
//    event.preventDefault();
//    $('.js-main-page').show();
//    $('.js-booklist-page').hide();
//});

//$(document).on('click', '#print', function (event) {
//
//    event.preventDefault();
//    window.print();
//
//});

//$(document).on('click', '.deletebtn', function (event) {
//    event.preventDefault();
//    console.log('removed button');
//
//    $(this).closest('.ingredientslist li').hide();
//
//    var idValue = $(this).parent().find('.deleteFromDB').val();
//    var nameValue = $(this).parent().find('.deleteFromDBName').val();
//
//    //console.log(deleteObject);
//
//    console.log(idValue);
//    $.ajax({
//            method: 'DELETE',
//            dataType: 'json',
//            contentType: 'application/json',
//            url: '/delete/' + idValue,
//        })
//        .done(function (result) {
//            displayError("Deleted");
//            //if the last quantity of an ingredient is deleted delete the parent ingredient too
//            $.ajax({
//                    method: 'DELETE',
//                    dataType: 'json',
//                    contentType: 'application/json',
//                    url: '/delete-empty-ingredients/'
//                })
//                .done(function (result) {
//                    console.log(result);
//                    $('#' + nameValue).remove();
//                })
//                .fail(function (jqXHR, error, errorThrown) {
//                    console.log(jqXHR);
//                    console.log(error);
//                    console.log(errorThrown);
//                });
//
//            //refresh the container with all the ingredients
//            $.ajax({
//                    method: 'GET',
//                    dataType: 'json',
//                    contentType: 'application/json',
//                    url: '/retrieve-sList/',
//                })
//                .done(function (result) {
//                    buildBookList(result);
//                })
//                .fail(function (jqXHR, error, errorThrown) {
//                    console.log(jqXHR);
//                    console.log(error);
//                    console.log(errorThrown);
//                });
//
//        })
//        .fail(function (jqXHR, error, errorThrown) {
//            console.log(jqXHR);
//            console.log(error);
//            console.log(errorThrown);
//        });
//});
//
//function addToMenu(recipeName, id, menu) {
//    //Populates Menu section of Search.html
//    var buildMenuHtml = '';
//    //buildMenuHtml += '<li><h3>' + $('#recipeDay').val() + '</h3></li>';
//    buildMenuHtml += '<li><a href="https://www.yummly.com/#recipe/' + id + '" target="_blank" alt="Link to Yummly Recipe" title="Link to Yummly Recipe">' + recipeName + ' </a></li>';
//    var dayId = '#' + $('#recipeDay').val();
//    $(dayId).append(buildMenuHtml);
//    //    menu += '<li><h3>' + dayId + '</h3></li>';
//    //    menu += buildMenuHtml;
//    //    console.log(menu);
//
//};
//$(document).on('click', '.addbtn', function (event) {
//    //Stores a recipe selected to Mongo.
//    event.preventDefault();
//    console.log('add recipes to list');
//    var recipeNameValue = $(this).parent().find('.storeToDbName').val();
//    var recipeRatingValue = $(this).parent().find('.storeToDbRating').val();
//    var recipeCourseValue = $(this).parent().find('.storeToDbCourse').val();
//    var recipeIdValue = $(this).parent().find('.storeToDbId').val();
//    //var recipeDayValue = $(this).parent().find('.storeToDay').val();
//    var recipeDayValue = $('#recipeDay').val();
//    var recipeStoreToShortList = $(this).parent().find('.storeToShortList').val();
//    var recipeUserName = $(this).parent().find('.storeToUserName').val();
//
//    var recipeObject = {
//        'name': recipeNameValue,
//        'rating': recipeRatingValue,
//        'course': recipeCourseValue,
//        'id': recipeIdValue,
//        'day': recipeDayValue,
//        'shortList': recipeStoreToShortList,
//        'username': recipeUserName,
//
//    };
//
//    //console.log(recipeObject);
//    $.ajax({
//            method: 'POST',
//            dataType: 'json',
//            contentType: 'application/json',
//            data: JSON.stringify(recipeObject),
//            url: '/add-recipe-db/',
//        })
//        .done(function (result) {
//            console.log(result);
//            displayError("Added to list");
//            addToMenu(recipeObject.name, recipeObject.id);
//        })
//        .fail(function (jqXHR, error, errorThrown) {
//            console.log(jqXHR);
//            console.log(error);
//            console.log(errorThrown);
//        });
//});
//
//
//$(document).on('click', '#addbutton', function (event) {
//    event.preventDefault();
//    console.log('add more ingredients to shopping list');
//
//    let ingredientName = $('.js-query-ingredient-name').val();
//    let ingredientQty = $('.js-query-ingredient-qty').val();
//
//    if ((!ingredientName) || (ingredientName.length < 1)) {
//        displayError('Invalid ingredient name');
//    } else if ((!ingredientQty) || (ingredientQty.length < 1)) {
//        displayError('Invalid ingredient Quantity');
//    } else {
//
//        const newIngredientObject = {
//            ingredient: ingredientName,
//            qty: ingredientQty
//        };
//        // will assign a value to variable 'user' in signin step below
//        // AJAX call to send form data up to server/DB and create new user
//        $.ajax({
//                type: 'POST',
//                url: '/ingredients/create',
//                dataType: 'json',
//                data: JSON.stringify(newIngredientObject),
//                contentType: 'application/json'
//            })
//            .done(function (result) {
//                console.log(result);
//                displayError('Ingredients added');
//                $.ajax({
//                        method: 'GET',
//                        dataType: 'json',
//                        contentType: 'application/json',
//                        url: '/retrieve-sList/',
//                    })
//                    .done(function (result) {
//                        buildBookList(result);
//                    })
//                    .fail(function (jqXHR, error, errorThrown) {
//                        console.log(jqXHR);
//                        console.log(error);
//                        console.log(errorThrown);
//                    });
//            })
//            .fail(function (jqXHR, error, errorThrown) {
//                console.log(jqXHR);
//                console.log(error);
//                console.log(errorThrown);
//            });
//    }
//});
