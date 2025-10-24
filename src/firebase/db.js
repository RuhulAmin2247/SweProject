import { collection, addDoc, doc, deleteDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from './config';

// Subscribe to published seats collection (real-time)
export const subscribeToSeats = (callback) => {
  const colRef = collection(db, 'seats');
  const unsub = onSnapshot(colRef, (snapshot) => {
    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    console.debug('[Firestore] seats snapshot:', items.length, 'documents');
    callback(items);
  }, (err) => {
    console.error('subscribeToSeats error', err);
  });
  return unsub;
};

// Subscribe to pending requests collection (real-time)
export const subscribeToPendingRequests = (callback) => {
  const colRef = collection(db, 'pendingRequests');
  const unsub = onSnapshot(colRef, (snapshot) => {
    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    console.debug('[Firestore] pendingRequests snapshot:', items.length, 'documents');
    callback(items);
  }, (err) => {
    console.error('subscribeToPendingRequests error', err);
  });
  return unsub;
};

// Add a pending request document
export const addPendingRequest = async (requestData) => {
  const colRef = collection(db, 'pendingRequests');
  const docRef = await addDoc(colRef, requestData);
  return docRef.id;
};

// Publish a pending request: copy it to 'seats' then remove from pendingRequests
export const publishRequest = async (pendingRequestId) => {
  const pendingRef = doc(db, 'pendingRequests', pendingRequestId);
  const pendingSnap = await getDoc(pendingRef);
  if (!pendingSnap.exists()) throw new Error('Pending request not found');

  const data = pendingSnap.data();
  // Create a new seat doc in 'seats'
  const seatsCol = collection(db, 'seats');
  const newSeatRef = await addDoc(seatsCol, {
    ...data,
    status: 'published',
    publishedAt: new Date().toISOString()
  });

  // Remove the pending request
  await deleteDoc(pendingRef);
  return newSeatRef.id;
};

// Delete a pending request (reject)
export const deletePendingRequest = async (pendingRequestId) => {
  const pendingRef = doc(db, 'pendingRequests', pendingRequestId);
  await deleteDoc(pendingRef);
  return true;
};
