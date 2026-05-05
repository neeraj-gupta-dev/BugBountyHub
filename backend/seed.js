const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Project = require('./models/Project');
const BugReport = require('./models/BugReport');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await BugReport.deleteMany();
    const Notification = require('./models/Notification');
    await Notification.deleteMany();

    console.log('Cleared existing data.');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // 1. Create Users
    const users = await User.insertMany([
      { name: 'Admin Boss', email: 'admin@bugbounty.com', password, role: 'Admin' },
      { name: 'Dev Alice', email: 'alice@dev.com', password, role: 'Developer' },
      { name: 'Dev Bob', email: 'bob@dev.com', password, role: 'Developer' },
      { name: 'Tester Charlie', email: 'charlie@tester.com', password, role: 'Tester', points: 150 },
      { name: 'Tester Dave', email: 'dave@tester.com', password, role: 'Tester', points: 50 },
      { name: 'Tester Eve', email: 'eve@tester.com', password, role: 'Tester', points: 0 },
    ]);

    const admin = users[0];
    const devAlice = users[1];
    const devBob = users[2];
    const testerCharlie = users[3];
    const testerDave = users[4];
    const testerEve = users[5];

    console.log('Users seeded.');

    // 2. Create Projects
    const projects = await Project.insertMany([
      {
        title: 'E-commerce React Native App',
        description: 'Testing the mobile checkout flow and payment gateway integrations. Focus on the stripe webhooks.',
        developer: devAlice._id,
        status: 'Active'
      },
      {
        title: 'Fintech Dashboard',
        description: 'Our new B2B fintech dashboard built with Next.js. Look for vulnerabilities in the reporting and export CSV endpoints.',
        developer: devBob._id,
        status: 'Active'
      },
      {
        title: 'Legacy Healthcare Portal',
        description: 'Looking for IDOR or privilege escalation bugs in the patient records module. NOTE: Do not run automated scanners against production data.',
        developer: devAlice._id,
        status: 'Closed'
      }
    ]);

    console.log('Projects seeded.');

    // 3. Create Bug Reports
    const bugs = await BugReport.insertMany([
      {
        title: 'Checkout crash on invalid credit card',
        description: 'When entering a 15-digit card instead of 16, the app completely crashes instead of showing a validation error.',
        project: projects[0]._id,
        tester: testerCharlie._id,
        severity: 'High',
        status: 'accepted',
        pointsAwarded: 100
      },
      {
        title: 'Missing CSRF token on CSV Export',
        description: 'The /api/export endpoint does not require a CSRF token, making it vulnerable to cross-site request forgery.',
        project: projects[1]._id,
        tester: testerDave._id,
        severity: 'Critical',
        status: 'submitted',
        pointsAwarded: 0
      },
      {
        title: 'Cart total does not update after removing item',
        description: 'If you add 3 items and remove 1, the total price still reflects 3 items until you refresh the page.',
        project: projects[0]._id,
        tester: testerCharlie._id,
        severity: 'Medium',
        status: 'under_review',
        pointsAwarded: 0
      },
      {
        title: 'SQL Injection in Search Bar',
        description: 'Using payload \`\' OR 1=1 --\` on the main search returns all users in the database.',
        project: projects[1]._id,
        tester: testerDave._id,
        severity: 'Critical',
        status: 'accepted',
        pointsAwarded: 50
      },
      {
        title: 'Typo in privacy policy link',
        description: 'The footer link to the privacy policy points to a 404 page.',
        project: projects[0]._id,
        tester: testerEve._id,
        severity: 'Low',
        status: 'closed',
        pointsAwarded: 0
      },
      {
        title: 'Patient records accessible without auth',
        description: 'Directly navigating to /records/123 allows viewing without being logged in.',
        project: projects[2]._id,
        tester: testerCharlie._id,
        severity: 'Critical',
        status: 'fixed',
        pointsAwarded: 50
      }
    ]);

    console.log('Bugs seeded.');

    // 4. Create Notifications
    await Notification.insertMany([
      {
        user: testerCharlie._id,
        message: 'Your bug "Checkout crash on invalid credit card" was accepted! You earned 100 points.',
        link: `/bug-history`,
        isRead: false
      },
      {
        user: devAlice._id,
        message: 'New bug reported on E-commerce React Native App: Checkout crash on invalid credit card',
        link: `/my-projects`,
        isRead: false
      },
      {
        user: testerEve._id,
        message: 'Your bug "Typo in privacy policy link" was rejected.',
        link: `/bug-history`,
        isRead: false
      }
    ]);

    console.log('Notifications seeded.');
    console.log('Data successfully seeded!');
    console.log('You can login with any email (e.g. admin@bugbounty.com) and password: password123');
    process.exit();

  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
