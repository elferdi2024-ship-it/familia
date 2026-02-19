
import { algoliasearch } from 'algoliasearch';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testAlgolia() {
    console.log("🚀 Testing Algolia v5 connection...");

    const client = algoliasearch(
        process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
        process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ''
    );

    try {
        const response = await client.search({
            requests: [
                {
                    indexName: 'properties',
                    query: '',
                    hitsPerPage: 5
                }
            ]
        });

        const hits = (response.results[0] as any).hits;
        console.log('✅ Connection Successful!');
        console.log('📊 Hits count:', hits.length);

        if (hits.length > 0) {
            console.log('🏠 Sample Data (Last 2):');
            hits.slice(0, 2).forEach((hit: any) => {
                console.log(` - [ID: ${hit.objectID}] Title: ${hit.title}`);
            });
        } else {
            console.log('⚠️ The index "properties" is empty.');
        }
    } catch (error) {
        console.error('❌ Algolia Error:', error);
    }
}

testAlgolia();
