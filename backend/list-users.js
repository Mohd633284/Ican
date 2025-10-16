/**
 * Quick script to list users by branch
 * Usage: node list-users.js [branch-name]
 * Example: node list-users.js Minna
 */

import { initDatabase, listUsersByBranch, listAllUsers } from './src/database.js';

async function main() {
  await initDatabase();
  
  const branch = process.argv[2];
  
  if (!branch) {
    console.log('\n📋 ALL USERS:');
    console.log('═══════════════════════════════════════════════════════════════\n');
    const users = listAllUsers();
    
    if (users.length === 0) {
      console.log('No users found.\n');
      return;
    }
    
    console.log('ID  | Name                    | Email                       | Branch   | Phone');
    console.log('─────────────────────────────────────────────────────────────────────────────────');
    users.forEach(user => {
      console.log(
        `${String(user.id).padEnd(3)} | ` +
        `${user.name.padEnd(23)} | ` +
        `${user.email.padEnd(27)} | ` +
        `${user.branch.padEnd(8)} | ` +
        `${user.phone}`
      );
    });
    console.log(`\nTotal: ${users.length} users\n`);
  } else {
    console.log(`\n📋 USERS IN ${branch.toUpperCase()} BRANCH:`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    const users = listUsersByBranch(branch);
    
    if (users.length === 0) {
      console.log(`No users found in ${branch} branch.\n`);
      return;
    }
    
    console.log('ID  | Name                    | Email                       | Phone          | Member #');
    console.log('──────────────────────────────────────────────────────────────────────────────────────────');
    users.forEach(user => {
      console.log(
        `${String(user.id).padEnd(3)} | ` +
        `${user.name.padEnd(23)} | ` +
        `${user.email.padEnd(27)} | ` +
        `${user.phone.padEnd(14)} | ` +
        `${user.membershipNumber || 'N/A'}`
      );
    });
    console.log(`\nTotal: ${users.length} users in ${branch} branch\n`);
  }
  
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
