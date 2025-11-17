/**
 * Seed Database Script
 * 
 * This script imports all cities from cities-expanded.ts into your Supabase database
 * 
 * Usage:
 * 1. Make sure your .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 * 2. Run: tsx scripts/seed-database.ts
 * 
 * Note: You need to install tsx: npm install -D tsx
 */

import { createClient } from '@supabase/supabase-js';
import { cities } from '../data/cities-expanded';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');
  console.log(`📊 Total cities to import: ${cities.length}\n`);

  try {
    // Check if cities table exists and is empty
    const { count, error: countError } = await supabase
      .from('cities')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error checking existing data:', countError);
      console.error('\nMake sure you have run the schema.sql script first!');
      process.exit(1);
    }

    if (count && count > 0) {
      console.log(`⚠️  Warning: Database already has ${count} cities`);
      console.log('Do you want to:');
      console.log('1. Skip seeding (recommended)');
      console.log('2. Add anyway (may create duplicates)');
      console.log('3. Clear and re-seed (destructive!)');
      console.log('\nPlease modify this script to choose an option.\n');
      
      // For now, we'll skip if data exists
      console.log('Skipping seed to prevent duplicates.');
      console.log('To force seed, manually clear the cities table first.');
      return;
    }

    // Convert cities to match database schema
    const citiesToInsert = cities.map(city => ({
      id: city.id,
      city: city.city,
      state: city.state,
      safety_score: city.safetyScore,
      lighting_score: city.lightingScore,
      public_transport_score: city.publicTransportScore,
      crowd_score: city.crowdScore,
      women_review_score: city.womenReviewScore,
      budget_level: city.budgetLevel,
      activities: city.activities,
      coordinates: city.coordinates,
      alerts: city.alerts,
      pros: city.pros,
      cons: city.cons
    }));

    // Insert in batches of 10 to avoid timeouts
    const batchSize = 10;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < citiesToInsert.length; i += batchSize) {
      const batch = citiesToInsert.slice(i, i + batchSize);
      const { data, error } = await supabase
        .from('cities')
        .insert(batch)
        .select();

      if (error) {
        console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error);
        errorCount += batch.length;
      } else {
        successCount += batch.length;
        console.log(`✅ Inserted batch ${i / batchSize + 1}: ${batch.length} cities`);
      }
    }

    console.log('\n🎉 Seeding complete!');
    console.log(`✅ Successfully imported: ${successCount} cities`);
    if (errorCount > 0) {
      console.log(`❌ Failed to import: ${errorCount} cities`);
    }
    console.log('\n🔍 Verifying data...');

    // Verify the data
    const { count: finalCount } = await supabase
      .from('cities')
      .select('*', { count: 'exact', head: true });

    console.log(`📊 Total cities in database: ${finalCount}`);

    // Get some sample data
    const { data: sampleCities } = await supabase
      .from('cities')
      .select('city, state, safety_score')
      .order('safety_score', { ascending: false })
      .limit(5);

    if (sampleCities) {
      console.log('\n🏆 Top 5 safest cities:');
      sampleCities.forEach((city, index) => {
        console.log(`  ${index + 1}. ${city.city}, ${city.state} (Score: ${city.safety_score})`);
      });
    }

    console.log('\n✨ Database is ready to use!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
