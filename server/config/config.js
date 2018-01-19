var env = process.env.NODE_ENV || 'development';

console.log('env ******', env);
if (env == "development") {
    process.env.PORT = 2300;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp1';
}
else if (env == "test") {
    process.env.PORT = 2300;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}