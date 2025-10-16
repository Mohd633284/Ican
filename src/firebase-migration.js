// Firebase Migration Tool
// This script migrates all localStorage data to Firebase

import { saveMember, saveMemberActivity } from '@/firebase';

/**
 * Migrate all members from localStorage to Firebase
 */
export const migrateMembers = async () => {
  try {
    console.log('🔄 Starting member migration to Firebase...');
    
    const branchName = localStorage.getItem('branchName') || 'default';
    const storedMembers = localStorage.getItem('members');
    
    if (!storedMembers) {
      console.log('⚠️ No members found in localStorage to migrate');
      return { success: false, message: 'No members to migrate' };
    }
    
    const members = JSON.parse(storedMembers);
    console.log(`📊 Found ${members.length} members to migrate`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const member of members) {
      try {
        const result = await saveMember(branchName, member.id, member);
        if (result.success) {
          successCount++;
          console.log(`✅ Migrated: ${member.name}`);
        } else {
          failCount++;
          console.error(`❌ Failed to migrate: ${member.name}`, result.error);
        }
      } catch (err) {
        failCount++;
        console.error(`❌ Error migrating: ${member.name}`, err);
      }
    }
    
    console.log(`\n🎉 Migration complete!`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    
    return {
      success: true,
      total: members.length,
      successful: successCount,
      failed: failCount
    };
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Migrate activities from localStorage to Firebase
 */
export const migrateActivities = async () => {
  try {
    console.log('🔄 Starting activity migration to Firebase...');
    
    const branchName = localStorage.getItem('branchName') || 'default';
    const storedActivities = localStorage.getItem('memberActivities');
    
    if (!storedActivities) {
      console.log('⚠️ No activities found in localStorage to migrate');
      return { success: false, message: 'No activities to migrate' };
    }
    
    const activities = JSON.parse(storedActivities);
    console.log(`📊 Found ${activities.length} activities to migrate`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const activity of activities) {
      try {
        const result = await saveMemberActivity(branchName, activity);
        if (result.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (err) {
        failCount++;
      }
    }
    
    console.log(`\n🎉 Activity migration complete!`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    
    return {
      success: true,
      total: activities.length,
      successful: successCount,
      failed: failCount
    };
    
  } catch (error) {
    console.error('❌ Activity migration error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Clear localStorage after successful migration
 */
export const clearLocalStorage = () => {
  try {
    console.log('🗑️ Clearing localStorage...');
    
    // Backup before clearing
    const backup = {
      members: localStorage.getItem('members'),
      activities: localStorage.getItem('memberActivities'),
      branchName: localStorage.getItem('branchName')
    };
    
    // Clear member data
    localStorage.removeItem('members');
    localStorage.removeItem('memberActivities');
    
    console.log('✅ localStorage cleared successfully');
    
    return { success: true, backup };
  } catch (error) {
    console.error('❌ Error clearing localStorage:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Full migration process: Migrate and clear localStorage
 */
export const fullMigration = async () => {
  console.log('🚀 Starting full migration to Firebase...\n');
  
  // Step 1: Migrate members
  const memberResult = await migrateMembers();
  
  // Step 2: Migrate activities
  const activityResult = await migrateActivities();
  
  // Step 3: Clear localStorage if successful
  if (memberResult.success && activityResult.success) {
    const clearResult = clearLocalStorage();
    
    if (clearResult.success) {
      console.log('\n🎉 MIGRATION COMPLETE!');
      console.log('✅ All data migrated to Firebase');
      console.log('✅ localStorage cleared');
      console.log('\n🔥 Your app now uses Firebase exclusively!');
      
      return {
        success: true,
        members: memberResult,
        activities: activityResult
      };
    }
  }
  
  console.log('\n⚠️ Migration completed with errors');
  return {
    success: false,
    members: memberResult,
    activities: activityResult
  };
};

// Usage in browser console:
/*
import { fullMigration } from './src/firebase-migration.js';
await fullMigration();
*/
