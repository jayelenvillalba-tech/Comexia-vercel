import initSqlJs from 'sql.js';
import { drizzle } from 'drizzle-orm/sql-js';

console.log('Testing sql.js imports with Node ESM...');
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
