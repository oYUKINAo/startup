const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!userName) {
    throw Error('Database not configured. Set environment variables');
}

const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);
const userCollection = client.db('askcougars').collection('user');
const questionCollection = client.db('askcougars').collection('userQuestion');

function getUser(username) {
    return userCollection.findOne({ username: username });
}

function getUserByToken(token) {
    return userCollection.findOne({ token: token });
}

async function createUser(username, password) {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
        username: username,
        password: passwordHash,
        token: uuid.v4(),
    };
    await userCollection.insertOne(user);

    return user;
}

async function addQuestion(username, title, question, date) {
    const userQuestion = {
        username: username,
        title: title,
        question: question,
        date: date,
    };
    await questionCollection.insertOne(userQuestion);
}

async function getQuestion() {
    const cursor = questionCollection.find();
    const info = await cursor.toArray();
    //console.log("db return", info);
    return info;
}

module.exports = {
    getUser,
    getUserByToken,
    createUser,
    addQuestion,
    getQuestion,
};
