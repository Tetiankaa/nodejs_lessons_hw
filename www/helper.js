const foo = () => {
    console.log(__dirname);
    console.log(__filename);
    console.log(process.cwd());
}
console.log('Hello from helper helper.js');

module.exports = {foo};
