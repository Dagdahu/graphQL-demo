const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
} = require('graphql');

// Dummy data
const books = [
    {
        id: "1",
        name: "Lord Of The Ring",
        genre: "Fantasy",
        authorId: "1",
    },
    {
        id: "2",
        name: "Oui oui",
        genre: "child book",
        authorId: "3",
    },
    {
        id: "3",
        name: "Harry Potter",
        genre: "Fantastic",
        authorId: "2",
    },
    {
        id: "4",
        name: "The Hobbit",
        genre: "Fantasy",
        authorId: "1",
    },
];

const authors = [
    {
        id: "1",
        name: "J.R.R Tolkien",
        // booksId: ["1", "4"],
    },
    {
        id: "2",
        name: "J.K Rolling",
        // booksId: ["3"],
    },
    {
        id: "3",
        name: "Therese",
        // booksId: ["2"],
    },
];

// Object types

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return authors.find(author => author.id === parent.authorId);
            }
        },
    }),
});

const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books.filter(book => book.authorId === parent.id);
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        books: {
            type: GraphQLList(BookType),
            resolve(parent, args) {
                return books;
            }
        },
        book: {
            type: BookType,
            args: {
                id: { type: GraphQLID },
                // Request will look like : book(id: '123'){name, genre}*
            },
            resolve(parent, args) {
                // code to get data from db or elsewhere
                return books.find(book => book.id === args.id);
            }
        },
        authors: {
            type: GraphQLList(AuthorType),
            resolve(parent, args) {
                return authors;
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: { type: GraphQLID },
                // Request will look like : book(id: '123'){name, genre}*
            },
            resolve(parent, args) {
                // code to get data from db or elsewhere
                return authors.find(author => author.id === args.id);
            }
        },
    },
});

// Mutations

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addBook: {
            type: BookType,
            args: {
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                author: { type: AuthorType },
            },
            resolve(parent, args) {

            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});