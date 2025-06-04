// Use the plp_bookstore database
use('plp_bookstore');

// --------------------
// TASK 2: BASIC CRUD
// --------------------

// 1. Find all books in a specific genre (e.g., "Fiction")
db.books.find({ genre: 'Fiction' });

// 2. Find books published after a certain year (e.g., 1950)
db.books.find({ published_year: { $gt: 1950 } });

// 3. Find books by a specific author (e.g., "George Orwell")
db.books.find({ author: 'George Orwell' });

// 4. Update the price of a specific book (e.g., "1984")
db.books.updateOne(
  { title: '1984' },
  { $set: { price: 12.99 } }
);

// 5. Delete a book by its title (e.g., "Moby Dick")
db.books.deleteOne({ title: 'Moby Dick' });


// --------------------
// TASK 3: ADVANCED QUERIES
// --------------------

// 1. Books that are in stock and published after 2010
db.books.find({
  in_stock: true,
  published_year: { $gt: 2010 }
});

// 2. Projection: title, author, and price
db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
);

// 3. Sort by price ascending
db.books.find().sort({ price: 1 });

// 4. Sort by price descending
db.books.find().sort({ price: -1 });

// 5. Pagination: limit + skip (page 2, 5 books per page)
db.books.find().skip(5).limit(5);


// --------------------
// TASK 4: AGGREGATION PIPELINES
// --------------------

// 1. Average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      avgPrice: { $avg: "$price" }
    }
  }
]);

// 2. Author with the most books
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } },
  { $limit: 1 }
]);

// 3. Group books by publication decade and count them
db.books.aggregate([
  {
    $project: {
      decade: {
        $concat: [
          { $substr: [{ $subtract: ["$published_year", { $mod: ["$published_year", 10] }] }, 0, 4] },
          "s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);


// --------------------
// TASK 5: INDEXING
// --------------------

// 1. Create an index on the `title` field
db.books.createIndex({ title: 1 });

// 2. Create a compound index on `author` and `published_year`
db.books.createIndex({ author: 1, published_year: -1 });

// 3. Use explain() to show performance improvement
db.books.find({ title: '1984' }).explain('executionStats');
