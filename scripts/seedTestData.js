// scripts/seedTestData.js

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

// Firebase configuration (same as in services/firebaseConfig.js)
const firebaseConfig = {
  apiKey: 'AIzaSyDA-oRt6E9qzxX5EDbjhTdL2cU8-xvXHVs',
  authDomain: 'reserveme-8b6a6.firebaseapp.com',
  databaseURL: 'https://reserveme-8b6a6-default-rtdb.firebaseio.com',
  projectId: 'reserveme-8b6a6',
  storageBucket: 'reserveme-8b6a6.appspot.com',
  messagingSenderId: '799896568782',
  appId: '1:799896568782:web:1300c18633676a9886219f',
  measurementId: 'G-B0SJRTX5WD',
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  try {
    // ─── a) Create users ───────────────────────────────
    const users = [
      {
        id: 'client_test_001',
        data: {
          userId: 'client_test_001',
          email: 'client@example.com',
          role: 'client',
          firstName: 'Alex',
          lastName: 'Johnson',
          phoneNumber: '555-1234',
          profilePhotoUrl: '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
      },
      {
        id: 'barber_test_001',
        data: {
          userId: 'barber_test_001',
          email: 'barber@example.com',
          role: 'barber',
          firstName: 'Sam',
          lastName: 'Reed',
          phoneNumber: '555-5678',
          profilePhotoUrl: '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
      },
    ];

    for (const user of users) {
      await setDoc(doc(db, 'users', user.id), user.data);
      console.log(`Created users/${user.id}`);
    }

    // ─── b) Barber profile ──────────────────────────────
    await setDoc(doc(db, 'barbers', 'barber_test_001'), {
      userId: 'barber_test_001',
      bio: 'Experienced barber specializing in fades and beard trims.',
      location: '123 Main St, Springfield',
      averageRating: 4.5,
      totalReviews: 10,
      servicesOffered: [
        { serviceId: 'mens_cut', price: 25 },
        { serviceId: 'beard_trim', price: 15 },
      ],
      availability: {
        monday: { startTime: '09:00', endTime: '17:00' },
        wednesday: { startTime: '10:00', endTime: '16:00' },
        friday: { startTime: '08:00', endTime: '13:00' },
      },
      portfolioImages: [
        'https://firebasestorage.googleapis.com/v0/b/reserveme-8b6a6.appspot.com/o/sample1.jpg?alt=media',
        'https://firebasestorage.googleapis.com/v0/b/reserveme-8b6a6.appspot.com/o/sample2.jpg?alt=media',
      ],
      isAvailable: true,
      updatedAt: serverTimestamp(),
    });
    console.log('Created barbers/barber_test_001');

    // ─── c) Services ────────────────────────────────────
    const services = [
      {
        id: 'mens_cut',
        data: {
          name: "Men's Haircut",
          description: 'Standard men’s haircut (30 minutes).',
          defaultPrice: 25,
          durationMinutes: 30,
          iconName: 'scissors',
        },
      },
      {
        id: 'beard_trim',
        data: {
          name: 'Beard Trim',
          description: 'Professional beard trim (15 minutes).',
          defaultPrice: 15,
          durationMinutes: 15,
          iconName: 'beard',
        },
      },
    ];

    for (const service of services) {
      await setDoc(doc(db, 'services', service.id), service.data);
      console.log(`Created services/${service.id}`);
    }

    // ─── d) Booking ─────────────────────────────────────
    await setDoc(doc(db, 'bookings', 'booking_test_001'), {
      clientId: 'client_test_001',
      barberId: 'barber_test_001',
      serviceId: 'mens_cut',
      bookingDate: Timestamp.fromDate(new Date('2025-07-20T10:00:00Z')),
      status: 'pending',
      price: 25,
      notes: 'Please give a fade on the sides.',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('Created bookings/booking_test_001');

    // ─── e) Review ──────────────────────────────────────
    await setDoc(doc(db, 'reviews', 'review_test_001'), {
      barberId: 'barber_test_001',
      clientId: 'client_test_001',
      bookingId: 'booking_test_001',
      rating: 5,
      comment: 'Great haircut—very precise!',
      createdAt: serverTimestamp(),
    });
    console.log('Created reviews/review_test_001');

    console.log('✅ Seed data successfully written to Firestore.');
  } catch (error) {
    console.error('❌ Failed to seed Firestore:', error);
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
