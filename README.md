# GraphQL

###### Start test environment

Go in your desired folder location and run the following commands :
```
git clone https://github.com/Dagdahu/graphQL-demo.git
cd graphQL-demo
yarn
yarn start
```
Then open `localhost:4000/graphql` in your navigator.

## Server side

You can check `index.js` and `schema/schema.js` to check how to get build a simple graph providing some dummy data.
Those are of two linked types, Books and Authors. They will be used in the next part : Client side queries.

## Client side queries

Once your server is up and running, you can play with the GraphiQL interface by copying/pasting the examples below and see what you get.
Feel free to play with the queries and see the indications given you in case of errors. 

#### GraphiQL

GraphiQL is a tool that let you play with queries and explore the data structure and queries that you can use.
The left pane let you write your queries, the right one shows the result.

The first thing you want to do is to click on the `Docs` button on the upper right-hand corner.
This is kind of an automatically generated doc of the data structure and queries you just built.
Then click on the `RootQueryType` (yeap, the one defined in `schema/schema.js`) and see available queries (in blue) and data types (in yellow). 


#### Basic query

Let start easy, with this quick query, nice and simple :
```
{
    books {
        name
    }
}
```
It should return the list of the books names.

#### Arguments

Now, let's grab a single book :
```
{
    book(id: 1) {
        name,
        genre
    }
}
```
You might notice that we give 1 as an id even if the real id is "1". It still works because of the graphQLID arg type in the RootQuery.
It automatically transform any number into a string (magic).

#### Fragment
 
If a request should return more than one instance of the same data (like this two books), aliases comes to the rescue !
```
{
    book(id:1) {
        name
    },
    secondBook: book(id:2) {
        name
    },
}
```

 #### Aliases

To avoid duplicating code, one can use fragment to do some clean job.
```
{
    book(id:1) {
        ...bookInfo
    },
    secondBook: book(id:2) {
        ...bookInfo
    },
}

fragment bookInfo on Book {
    name,
    id,
    author {
        name
    }
}
```
#### Queries

The queries above is using the query shorthand syntax which prevents from using query name and variable like such :
```
query BookWithAuthor($bookId: ID = 1) {
  book(id:$bookId) {
    name,
    author {
      name
    },
  }
}
```
1 being the default in that example.
With the variable passed separately in the `Query variables` pane (on the bottom right);
```
{"bookId": 2}
```

You can even change the data structure based on a parameter :
```
query Book($bookId: ID = 1, $withAuthor: Boolean!) {
  book(id:$bookId) {
    name,
    author @include(if: $withAuthor) {
      name
    },
  }
}
```
With following variables :
```
{
  "bookId": 1,
  "withAuthor": false
}
```

#### Mutations

Accessing data is cool, but have you tried mutating data ?
In the `Docs` panel, we can see that a mutation is provided, let's give it a try !
Here is a mutation query with an explicit name and mandatory arguments.
```
mutation AddBook($name: String, $genre: String, $authorId: ID) {
  addBook(name:$name, genre:$genre, authorId:$authorId) {
    id,
    name
  }
}
```
We can then fill the variables with some dummy data in `Query variables` to try it out :
```
{
  "name": "Lord Of The Ring: The Two Thrones",
  "genre": "fantasy",
  "authorId": "1"
}
```
If it worked, it should send back the last piece of data you added (as defined in `schema.js`, but the answer is up to you).
We can then try to to retrieve the new list of books :
```
{
    books {
        name
    }
}
```