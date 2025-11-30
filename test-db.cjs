const initSqlJs = require('sql.js');
const { drizzle } = require('drizzle-orm/sql-js');

console.log('Testing sql.js imports with Node CJS...');
async function main() {
    try {
        const SQL = await initSqlJs();
        const db = new SQL.Database();
        console.log('sql.js loaded');
        const d = drizzle(db);
        console.log('drizzle-orm loaded');
    } catch (e) {
        console.error(e);
    }
}
main();
