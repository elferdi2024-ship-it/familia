
import algoliasearch from 'algoliasearch';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testAlgolia() {
    const client = algoliasearch(
        process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
        process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ''
    );

    const index = client.initIndex('properties');
    const { hits } = await index.search('');

    console.log('Algolia Hits count:', hits.length);
    if (hits.length > 0) {
        console.log('Sample Hit ID:', hits[0].objectID);
        console.log('Sample Hit Title:', hits[0].title);
    }
}

testAlgolia();
