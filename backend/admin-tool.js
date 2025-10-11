/**
 * ICAN ADMIN CONTROL TOOL
 * Safe user account management system
 * 
 * Usage: node admin-tool.js
 */

import readline from 'readline';
import {
  listAllUsers,
  listUsersByBranch,
  getBranchUserCounts,
  deleteUserByEmail,
  deleteUserById,
  setRegistrationStatus,
  setMaxUsers,
  getAllBranchSettings,
} from './src/database.js';
import { initDatabase } from './src/database.js';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function displayHeader() {
  console.log('\n' + colors.cyan + '╔════════════════════════════════════════════════════════════════╗');
  console.log('║              ICAN ADMIN CONTROL PANEL                      ║');
  console.log('╚════════════════════════════════════════════════════════════════╝' + colors.reset + '\n');
}

function displayMenu() {
  console.log(colors.bright + '\nMAIN MENU:' + colors.reset);
  console.log(colors.cyan + '─────────────────────────────────────────────────────────────────' + colors.reset);
  console.log('  1. View All Users');
  console.log('  2. View Users by Branch');
  console.log('  3. View Branch Statistics');
  console.log('  4. Delete User Account (Safe Selection)');
  console.log('  5. Change Branch User Limit');
  console.log('  6. Enable/Disable Branch Registration');
  console.log('  7. View Branch Settings');
  console.log('  0. Exit');
  console.log(colors.cyan + '─────────────────────────────────────────────────────────────────' + colors.reset);
}

function displayUsers(users, title = 'User List') {
  console.log('\n' + colors.bright + colors.green + '✓ ' + title + colors.reset);
  console.log(colors.dim + '─────────────────────────────────────────────────────────────────' + colors.reset);
  
  if (users.length === 0) {
    console.log(colors.yellow + '  No users found.' + colors.reset);
    return;
  }

  console.log(colors.bright + '\n┌──────┬────────────────────────────────────────┬───────────┬──────────────────────┐');
  console.log('│  ID  │ Email                                  │  Branch   │ Name                 │');
  console.log('├──────┼────────────────────────────────────────┼───────────┼──────────────────────┤' + colors.reset);
  
  users.forEach(user => {
    const id = String(user.id).padEnd(4);
    const email = String(user.email).padEnd(38);
    const branch = String(user.branch).padEnd(9);
    const name = String(user.name).substring(0, 20).padEnd(20);
    console.log(colors.cyan + `│ ${id} │ ${email} │ ${branch} │ ${name} │` + colors.reset);
  });
  
  console.log(colors.bright + '└──────┴────────────────────────────────────────┴───────────┴──────────────────────┘' + colors.reset);
  console.log(colors.dim + `\nTotal: ${users.length} user(s)` + colors.reset);
}

function displayBranchStats() {
  const counts = getBranchUserCounts();
  const settings = getAllBranchSettings();
  const branches = ['Kaduna', 'Kano', 'Minna', 'Oyo', 'Sokoto'];

  console.log('\n' + colors.bright + colors.green + '✓ Branch Registration Status' + colors.reset);
  console.log(colors.dim + '─────────────────────────────────────────────────────────────────' + colors.reset);
  
  console.log(colors.bright + '\n┌────────────┬───────────┬─────────┬────────────┬──────────────────┐');
  console.log('│  Branch    │  Users    │  Max    │  Available │  Status          │');
  console.log('├────────────┼───────────┼─────────┼────────────┼──────────────────┤' + colors.reset);
  
  branches.forEach(branch => {
    const userCount = counts[branch] || 0;
    const branchSetting = settings.find(s => s.branch === branch);
    const maxUsers = branchSetting ? branchSetting.maxUsers : 1;
    const availableSlots = maxUsers - userCount;
    const regEnabled = branchSetting ? branchSetting.registrationEnabled : true;
    
    let statusColor = colors.green;
    let statusText = '✓ AVAILABLE';
    
    if (!regEnabled) {
      statusColor = colors.red;
      statusText = '✗ DISABLED';
    } else if (availableSlots < 0) {
      statusColor = colors.red;
      statusText = '✗ OVER LIMIT!';
    } else if (availableSlots === 0) {
      statusColor = colors.yellow;
      statusText = '⚠ FULL';
    }
    
    const branchName = branch.padEnd(10);
    const userCountStr = String(userCount).padStart(7);
    const maxUsersStr = String(maxUsers).padStart(5);
    const availableStr = String(availableSlots).padStart(8);
    
    console.log(statusColor + `│ ${branchName} │ ${userCountStr} │ ${maxUsersStr} │ ${availableStr} │ ${statusText.padEnd(16)} │` + colors.reset);
  });
  
  console.log(colors.bright + '└────────────┴───────────┴─────────┴────────────┴──────────────────┘' + colors.reset);
}

async function viewAllUsers() {
  const users = listAllUsers();
  displayUsers(users, `All Users (${users.length} total)`);
}

async function viewUsersByBranch() {
  console.log('\n' + colors.yellow + 'Available Branches:' + colors.reset);
  console.log('  1. Kaduna');
  console.log('  2. Kano');
  console.log('  3. Minna');
  console.log('  4. Oyo');
  console.log('  5. Sokoto');
  
  const choice = await question('\nEnter branch number (1-5): ');
  const branches = ['Kaduna', 'Kano', 'Minna', 'Oyo', 'Sokoto'];
  const branchIndex = parseInt(choice) - 1;
  
  if (branchIndex < 0 || branchIndex >= branches.length) {
    console.log(colors.red + '✗ Invalid choice!' + colors.reset);
    return;
  }
  
  const branch = branches[branchIndex];
  const users = listUsersByBranch(branch);
  displayUsers(users, `Users in ${branch} Branch (${users.length} total)`);
}

async function deleteUserSafe() {
  console.log('\n' + colors.yellow + colors.bright + '⚠ DELETE USER ACCOUNT - SAFE SELECTION MODE' + colors.reset);
  console.log(colors.dim + '─────────────────────────────────────────────────────────────────' + colors.reset);
  
  // First, show all users
  const users = listAllUsers();
  
  if (users.length === 0) {
    console.log(colors.yellow + '\n  No users to delete.' + colors.reset);
    return;
  }
  
  displayUsers(users, 'Select User to Delete');
  
  console.log('\n' + colors.yellow + 'DELETE OPTIONS:' + colors.reset);
  console.log('  1. Delete by ID (safer - exact match)');
  console.log('  2. Delete by Email');
  console.log('  0. Cancel and go back');
  
  const choice = await question('\nChoose deletion method (0-2): ');
  
  if (choice === '0') {
    console.log(colors.cyan + 'Deletion cancelled.' + colors.reset);
    return;
  }
  
  if (choice === '1') {
    await deleteByIdSafe(users);
  } else if (choice === '2') {
    await deleteByEmailSafe(users);
  } else {
    console.log(colors.red + '✗ Invalid choice!' + colors.reset);
  }
}

async function deleteByIdSafe(users) {
  const userId = await question(colors.yellow + '\nEnter User ID to delete: ' + colors.reset);
  const userIdNum = parseInt(userId);
  
  // Find the user to confirm
  const userToDelete = users.find(u => u.id === userIdNum);
  
  if (!userToDelete) {
    console.log(colors.red + '\n✗ User ID not found!' + colors.reset);
    return;
  }
  
  // Show confirmation
  console.log('\n' + colors.yellow + '⚠ CONFIRMATION REQUIRED' + colors.reset);
  console.log(colors.dim + '─────────────────────────────────────────────────────────────────' + colors.reset);
  console.log(colors.bright + '\nYou are about to delete:' + colors.reset);
  console.log(colors.red + `  ID:     ${userToDelete.id}` + colors.reset);
  console.log(colors.red + `  Name:   ${userToDelete.name}` + colors.reset);
  console.log(colors.red + `  Email:  ${userToDelete.email}` + colors.reset);
  console.log(colors.red + `  Branch: ${userToDelete.branch}` + colors.reset);
  console.log(colors.red + `  Phone:  ${userToDelete.phone}` + colors.reset);
  
  const confirm = await question('\n' + colors.bright + colors.red + 'Type "DELETE" to confirm (case-sensitive): ' + colors.reset);
  
  if (confirm !== 'DELETE') {
    console.log(colors.cyan + '\n✓ Deletion cancelled. Account is safe.' + colors.reset);
    return;
  }
  
  try {
    const deleted = deleteUserById(userIdNum);
    console.log(colors.green + '\n✓ SUCCESS! User account deleted:' + colors.reset);
    console.log(colors.dim + `  ${deleted.name} (${deleted.email}) from ${deleted.branch} branch` + colors.reset);
    console.log(colors.cyan + '\n  This user can now create a new account with a different email.' + colors.reset);
  } catch (error) {
    console.log(colors.red + '\n✗ ERROR: ' + error.message + colors.reset);
  }
}

async function deleteByEmailSafe(users) {
  const email = await question(colors.yellow + '\nEnter Email to delete: ' + colors.reset);
  
  // Find the user to confirm
  const userToDelete = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!userToDelete) {
    console.log(colors.red + '\n✗ Email not found!' + colors.reset);
    console.log(colors.yellow + '\nAvailable emails:' + colors.reset);
    users.forEach(u => {
      console.log(colors.cyan + `  - ${u.email}` + colors.reset);
    });
    return;
  }
  
  // Show confirmation
  console.log('\n' + colors.yellow + '⚠ CONFIRMATION REQUIRED' + colors.reset);
  console.log(colors.dim + '─────────────────────────────────────────────────────────────────' + colors.reset);
  console.log(colors.bright + '\nYou are about to delete:' + colors.reset);
  console.log(colors.red + `  ID:     ${userToDelete.id}` + colors.reset);
  console.log(colors.red + `  Name:   ${userToDelete.name}` + colors.reset);
  console.log(colors.red + `  Email:  ${userToDelete.email}` + colors.reset);
  console.log(colors.red + `  Branch: ${userToDelete.branch}` + colors.reset);
  console.log(colors.red + `  Phone:  ${userToDelete.phone}` + colors.reset);
  
  const confirm = await question('\n' + colors.bright + colors.red + 'Type "DELETE" to confirm (case-sensitive): ' + colors.reset);
  
  if (confirm !== 'DELETE') {
    console.log(colors.cyan + '\n✓ Deletion cancelled. Account is safe.' + colors.reset);
    return;
  }
  
  try {
    const deleted = deleteUserByEmail(userToDelete.email);
    console.log(colors.green + '\n✓ SUCCESS! User account deleted:' + colors.reset);
    console.log(colors.dim + `  ${deleted.name} (${deleted.email}) from ${deleted.branch} branch` + colors.reset);
    console.log(colors.cyan + '\n  This user can now create a new account with a different email.' + colors.reset);
  } catch (error) {
    console.log(colors.red + '\n✗ ERROR: ' + error.message + colors.reset);
  }
}

async function changeBranchLimit() {
  console.log('\n' + colors.yellow + 'CHANGE BRANCH USER LIMIT' + colors.reset);
  console.log(colors.dim + '─────────────────────────────────────────────────────────────────' + colors.reset);
  
  console.log('\n' + colors.cyan + 'Available Branches:' + colors.reset);
  console.log('  1. Kaduna');
  console.log('  2. Kano');
  console.log('  3. Minna');
  console.log('  4. Oyo');
  console.log('  5. Sokoto');
  console.log('  6. All branches');
  
  const choice = await question('\nEnter branch number (1-6): ');
  const branches = ['Kaduna', 'Kano', 'Minna', 'Oyo', 'Sokoto'];
  
  let targetBranch = null;
  if (choice === '6') {
    targetBranch = 'all';
  } else {
    const branchIndex = parseInt(choice) - 1;
    if (branchIndex < 0 || branchIndex >= branches.length) {
      console.log(colors.red + '✗ Invalid choice!' + colors.reset);
      return;
    }
    targetBranch = branches[branchIndex];
  }
  
  const newLimit = await question(colors.yellow + '\nEnter new user limit (1-100): ' + colors.reset);
  const limitNum = parseInt(newLimit);
  
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    console.log(colors.red + '✗ Invalid limit! Must be between 1 and 100.' + colors.reset);
    return;
  }
  
  if (targetBranch === 'all') {
    branches.forEach(branch => {
      setMaxUsers(branch, limitNum);
    });
    console.log(colors.green + `\n✓ User limit set to ${limitNum} for ALL branches.` + colors.reset);
  } else {
    setMaxUsers(targetBranch, limitNum);
    console.log(colors.green + `\n✓ User limit for ${targetBranch} set to ${limitNum}.` + colors.reset);
  }
}

async function toggleRegistration() {
  console.log('\n' + colors.yellow + 'ENABLE/DISABLE BRANCH REGISTRATION' + colors.reset);
  console.log(colors.dim + '─────────────────────────────────────────────────────────────────' + colors.reset);
  
  console.log('\n' + colors.cyan + 'Available Branches:' + colors.reset);
  console.log('  1. Kaduna');
  console.log('  2. Kano');
  console.log('  3. Minna');
  console.log('  4. Oyo');
  console.log('  5. Sokoto');
  
  const choice = await question('\nEnter branch number (1-5): ');
  const branches = ['Kaduna', 'Kano', 'Minna', 'Oyo', 'Sokoto'];
  const branchIndex = parseInt(choice) - 1;
  
  if (branchIndex < 0 || branchIndex >= branches.length) {
    console.log(colors.red + '✗ Invalid choice!' + colors.reset);
    return;
  }
  
  const branch = branches[branchIndex];
  
  console.log('\n' + colors.cyan + 'Action:' + colors.reset);
  console.log('  1. Enable registration');
  console.log('  2. Disable registration');
  
  const action = await question('\nChoose action (1-2): ');
  
  if (action === '1') {
    setRegistrationStatus(branch, true);
    console.log(colors.green + `\n✓ Registration ENABLED for ${branch} branch.` + colors.reset);
  } else if (action === '2') {
    setRegistrationStatus(branch, false);
    console.log(colors.yellow + `\n⚠ Registration DISABLED for ${branch} branch.` + colors.reset);
  } else {
    console.log(colors.red + '✗ Invalid choice!' + colors.reset);
  }
}

function viewBranchSettings() {
  const settings = getAllBranchSettings();
  
  console.log('\n' + colors.bright + colors.green + '✓ Branch Settings' + colors.reset);
  console.log(colors.dim + '─────────────────────────────────────────────────────────────────' + colors.reset);
  
  console.log(colors.bright + '\n┌────────────┬─────────────┬──────────────────────┐');
  console.log('│  Branch    │  Max Users  │  Registration        │');
  console.log('├────────────┼─────────────┼──────────────────────┤' + colors.reset);
  
  settings.forEach(setting => {
    const branchName = setting.branch.padEnd(10);
    const maxUsers = String(setting.maxUsers).padStart(9);
    const regStatus = setting.registrationEnabled ? 
      colors.green + '✓ ENABLED          ' + colors.reset : 
      colors.red + '✗ DISABLED         ' + colors.reset;
    
    console.log(`│ ${branchName} │ ${maxUsers} │ ${regStatus} │`);
  });
  
  console.log(colors.bright + '└────────────┴─────────────┴──────────────────────┘' + colors.reset);
}

async function main() {
  try {
    // Initialize database
    await initDatabase();
    
    displayHeader();
    console.log(colors.green + '✓ Database connected successfully!' + colors.reset);
    
    let running = true;
    
    while (running) {
      displayMenu();
      const choice = await question('\n' + colors.bright + 'Enter your choice (0-7): ' + colors.reset);
      
      console.clear();
      displayHeader();
      
      switch (choice) {
        case '1':
          await viewAllUsers();
          break;
        case '2':
          await viewUsersByBranch();
          break;
        case '3':
          displayBranchStats();
          break;
        case '4':
          await deleteUserSafe();
          break;
        case '5':
          await changeBranchLimit();
          break;
        case '6':
          await toggleRegistration();
          break;
        case '7':
          viewBranchSettings();
          break;
        case '0':
          console.log(colors.cyan + '\nGoodbye! 👋\n' + colors.reset);
          running = false;
          break;
        default:
          console.log(colors.red + '\n✗ Invalid choice! Please try again.' + colors.reset);
      }
      
      if (running && choice !== '0') {
        await question(colors.dim + '\nPress Enter to continue...' + colors.reset);
        console.clear();
        displayHeader();
      }
    }
    
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error(colors.red + '\n✗ ERROR: ' + error.message + colors.reset);
    rl.close();
    process.exit(1);
  }
}

// Run the admin tool
main();
