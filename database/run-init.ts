
import { initializeTables } from './init-db.js';

console.log('🔄 Initializing database tables...');
initializeTables()
  .then(() => {
    console.log('✅ Database tables initialized.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error initializing tables:', err);
    process.exit(1);
  });
