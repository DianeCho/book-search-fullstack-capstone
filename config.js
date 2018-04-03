exports.DATABASE_URL = process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    (process.env.NODE_ENV === 'production' ?
        'mongodb://addme:addme@ds233739.mlab.com:33739/book-search-fullstack-capstone' :
        'mongodb://addme:addme@ds233739.mlab.com:33739/book-search-fullstack-capstone');
exports.PORT = process.env.PORT || 5001;
