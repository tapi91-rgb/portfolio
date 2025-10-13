# Setup: Flutter + Firebase

This note outlines a minimal setup for a Flutter app with Firebase Auth and Firestore, plus basic CI.

## Project structure
- lib/
  - app.dart (MaterialApp, theme)
  - router.dart (routes)
  - features/auth/
  - features/home/

## Firebase integration
1. Add `firebase_core`, `firebase_auth`, `cloud_firestore`.
2. Initialize Firebase in `main()`.
3. Wrap app in `StreamBuilder<User?>` for auth state.
4. Use `CollectionReference` and typed models for Firestore.

```dart
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(const App());
}
```

## CI basics
- Flutter format + analyze
- Run unit tests
- Optional: build APK on main branch

## Tips
- Keep widgets small and composable
- Use strongly typed models and adapters
- Document dev setup in README