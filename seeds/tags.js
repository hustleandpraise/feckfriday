
exports.seed = function(knex, Promise) {

    var categories = [
        'feckfridayin',
        'feckfridayoff',
        'feckfridayawol',
    ];

    var arr = [];

    categories.forEach((category) => {
        arr.push( knex('tags').insert({ title: category, created_at: new Date(), updated_at: new Date() }) );
    });

    return new Promise.all(arr)

};
