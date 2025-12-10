// Simple test script to check marketplace API
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/marketplace/posts',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const posts = JSON.parse(data);
      console.log('\n=== MARKETPLACE API TEST ===\n');
      console.log(`Total posts: ${posts.length}`);
      
      if (posts.length > 0) {
        console.log('\n📦 First post structure:');
        console.log(JSON.stringify(posts[0], null, 2));
        
        console.log('\n📋 Post fields:');
        Object.keys(posts[0]).forEach(key => {
          console.log(`  - ${key}: ${typeof posts[0][key]}`);
        });
      } else {
        console.log('\n❌ No posts returned from API!');
      }
    } catch (error) {
      console.error('Error parsing JSON:', error.message);
      console.log('Raw response:', data.substring(0, 500));
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error.message);
});

req.end();
