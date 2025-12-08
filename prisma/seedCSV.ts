import path from 'path';
import bcrypt from 'bcrypt';
import { readdir, readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { fieldTypes } from './types.js';
import { prisma } from '../src/prisma.js';

const models = Object.keys(fieldTypes);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.join(__dirname, 'csv');

// Mapping from CSV filename to Prisma model name
const fileToModel: Record<string, string> = {
  'user.csv': 'user',
  'genre.csv': 'genre',
  'poster.csv': 'poster',
  'genrePosterRel.csv': 'genrePosterRel',
  'cartlines.csv': 'cartline',
  'userRatings.csv': 'userRating',
};

async function main() {
  console.log('🌱 Seeding database...');
  
  const csvFiles = (await readdir(dir)).filter(f => f.endsWith('.csv'));

  for (const file of csvFiles) {
    const model = fileToModel[file];
    if (!model) {
      console.log(`⏭️ Skipping unknown file: ${file}`);
      continue;
    }

    console.log(`📥 Processing ${file} for model: ${model}`);

    const raw = parse(await readFile(path.join(dir, file), 'utf-8'), {
      columns: true,
      skip_empty_lines: true,
    });

    const data = await Promise.all(raw.map((row: any) => cast(model, row)));
    
    try {
      const result = await (prisma as any)[model].createMany({ 
        data, 
        skipDuplicates: true 
      });
      console.log(`✅ Created ${data.length} records for ${model}`);
    } catch (error) {
      console.error(`❌ Error seeding ${model}:`, error);
    }
  }
}

async function cast(model: string, row: any) {
  const types = fieldTypes[model];
  const out: any = {};

  for (const key in row) {
    const val = row[key]?.toString().trim();
    const type = types[key];

    if (key === 'password') out[key] = await bcrypt.hash(val, 10);
    else if (type === 'number') out[key] = Number(val);
    else if (type === 'boolean') out[key] = val !== '0' && val !== 'false';
    else if (type === 'date') out[key] = val ? new Date(val) : null;
    else out[key] = val ?? null;
  }
  return out;
}

main()
  .then(() => {
    console.log('✨ Seed completed successfully!');
  })
  .catch(error => {
    console.error('💥 Seed failed:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());