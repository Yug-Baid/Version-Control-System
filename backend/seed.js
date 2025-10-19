const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/userModel.js'); //
const Repo = require('./models/repoModel.js'); //

// Load environment variables
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

// --- Sample Data ---

const usersToCreate = [
  { name: 'alice', email: 'alice@example.com' },
  { name: 'bob', email: 'bob@example.com' },
  { name: 'charlie', email: 'charlie@example.com' },
  { name: 'diana', email: 'diana@example.com' },
  { name: 'edward', email: 'edward@example.com' },
];

const sampleRepoData = [
  { name: 'dotfiles', description: 'My personal configuration files.' },
  { name: 'blog-project', description: 'A blog built with Node.js and React.' },
  { name: 'portfolio-site', description: 'My personal developer portfolio.' },
  { name: 'data-structures', description: 'Implementations of common data structures.' },
  { name: 'learning-go', description: 'My journey learning the Go language.' },
  { name: 'css-art', description: 'Creating art with pure CSS.' },
  { name: 'api-gateway', description: 'A simple API gateway service.' },
  { name: 'mobile-app', description: 'A cross-platform mobile application.' },
];

// A helper function to pick random items
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- Seeding Function ---

const seedDatabase = async () => {
  if (!MONGO_URL) {
    console.error('Error: MONGO_URL is not defined in your .env file.');
    process.exit(1);
  }

  let dbConnection;
  try {
    // 1. Connect to MongoDB
    dbConnection = await mongoose.connect(MONGO_URL);
    console.log('Database connected successfully.');

    // 2. Clean up previous data
    console.log('Clearing existing users and repos...');
    await User.deleteMany({});
    await Repo.deleteMany({});
    console.log('Database cleared.');

    const salt = await bcrypt.genSalt(10);
    const defaultPassword = 'password123';
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);
    console.log(`Default password for all users: ${defaultPassword}`);

    // 3. Create all users
    for (const userData of usersToCreate) {
      console.log(`--- Creating user: ${userData.name} ---`);
      
      const newUser = new User({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        repositories: [],
        followedUser: [],
        StarRepos: [],
      }); //

      const savedUser = await newUser.save();
      const createdRepoIds = [];

      // 4. Create repositories for each user
      const repoCount = getRandomInt(4, 5); // Each user gets 4 or 5 repos
      console.log(`Creating ${repoCount} repos for ${savedUser.name}...`);

      for (let i = 0; i < repoCount; i++) {
        const repoDetails = getRandomItem(sampleRepoData);
        const repoName = `${savedUser.name}-${repoDetails.name}-${i}`;
        
        const newRepo = new Repo({
          name: repoName,
          description: repoDetails.description,
          visibility: Math.random() > 0.3, // Most repos are public
          owner: savedUser._id, // Link repo to the user
          issues: [],
        }); //

        const savedRepo = await newRepo.save();
        console.log(`  > Created repo: ${savedRepo.name}`);
        createdRepoIds.push(savedRepo._id);
      }

      // 5. Update the user with their new repository IDs
      savedUser.repositories = createdRepoIds;
      await savedUser.save();
      console.log(`Linked ${createdRepoIds.length} repos to user ${savedUser.name}.`);
    }

    console.log('\n✅ Seeding complete! All users and repos created and linked.');

  } catch (error) {
    console.error('\n❌ Error during seeding process:', error);
  } finally {
    // 6. Disconnect from the database
    if (dbConnection) {
      await mongoose.disconnect();
      console.log('Database disconnected.');
    }
    process.exit(0);
  }
};

// Run the seed script
seedDatabase();