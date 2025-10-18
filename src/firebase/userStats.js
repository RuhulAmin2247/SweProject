// Utility to get user statistics from Firebase
// This is for development/admin purposes only

import { collection, getDocs } from 'firebase/firestore';
import { db } from './config';

export const getUserStats = async () => {
  try {
    // Get all users from Firestore users collection
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    const stats = {
      totalUsers: 0,
      students: 0,
      owners: 0,
      admins: 0,
      userList: []
    };

    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      stats.totalUsers++;
      stats.userList.push({
        email: userData.email,
        name: userData.name,
        userType: userData.userType,
        createdAt: userData.createdAt
      });

      // Count by user type
      switch (userData.userType) {
        case 'student':
          stats.students++;
          break;
        case 'owner':
          stats.owners++;
          break;
        case 'admin':
          stats.admins++;
          break;
        default:
          break;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
};

// Usage example:
// const stats = await getUserStats();
// console.log('Total users:', stats.totalUsers);
// console.log('Students:', stats.students);
// console.log('Owners:', stats.owners);
// console.log('Admins:', stats.admins);
