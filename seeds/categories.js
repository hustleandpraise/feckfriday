
var Slug = require('slug');

var categories = [
    "FeckFridayAWOL",
    "FeckFridayIN",
    "FeckFridayOUT"
];

exports.seed = function(knex, Promise) {

    var arr = [knex('categories').del()];

    categories.forEach((category) => {
        arr.push( knex('categories').insert({ title: category, slug: Slug(category, { lower: true }), created_at: new Date(), updated_at: new Date() }) );
    });

    return new Promise.all(arr)

};
