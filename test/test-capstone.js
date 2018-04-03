const {
    app,
    runServer,
    closeServer
} = require('../server');


var chai = require('chai');
var chaiHttp = require('chai-http');


var recipe = require('../models/recipe.js');
var list = require('../models/list.js');
var should = chai.should();

chai.use(chaiHttp);
describe('shopping-list-node-capstone', function () {
    //    it('Should ', function () {});
    it('should add a recipe on POST', function (done) {
        chai.request(app)
            .post('/add-recipe-db/')
            .send({
                'name': 'Homemade Fish Balls with Spicy Fish Ball Sauce',
                'rating': '4',
                'course': 'main',
                'id': 'Homemade-Fish-Balls-with-Spicy-Fish-Ball-Sauce-2272743',
                'shortList': '[\"1 pound fish flesh\",\"2 tablespoons cornstarch\",\"2 teaspoons salt\",\"1 teaspoon sugar\",\"¼ cup cold water\",\"2 cups water\",\"⅓ cup soy sauce\",\"1 head garlic, peeled and minced\",\"3 shallots, peeled and finely chopped\",\"4 to 5Thai chili peppers, stemmed and chopped\",\"1 cup brown sugar\",\"1 tablespoon flour\",\"1 tablespoon cornstarch\",\"1 teaspoon salt or to taste\",\"½ teaspoon pepper\",\"oil\"]',

            })
            .end(function (err, res) {
                //should.equal(err, null);
                res.should.have.status(201);

                done();
            });
    });
    it('Should Delete an ingredient', function () {
        chai.request(app)
            .delete('/deletering/')
            .then(function (res) {
                res.should.have.status(201);
            })
    });

    it('Should Delete all recipes', function () {

        chai.request(app)
            .delete('/deleterec/')
            .then(function (res) {
                res.should.have.status(201);
            })

    });
    it('Should Delete all ingredients', function () {
        const killmsg = {
            id: 'killAll'
        };

        chai.request(app)
            .delete('/deletering/')
            .then(function (res) {
                res.should.have.status(201);
            })

    });

});
