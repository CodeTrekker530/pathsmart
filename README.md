# PathSmart

## Web: Fix for "6000ms timeout exceeded" (FontFaceObserver)

If you saw an Uncaught Error: 6000ms timeout exceeded from `fontfaceobserver.standalone.js` in the web build, it was caused by icon fonts not being preloaded before render. This repo now preloads the icon fonts at startup so the app renders only after fonts are available.

What changed:
- `app/_layout.jsx` loads `Feather.ttf` and `Ionicons.ttf` using `expo-font` via `useFonts`, and keeps the splash visible until fonts are ready.
- `expo-font` is added to `package.json`.

How to run cleanly (PowerShell):

```powershell
# Install deps (done once)
npm install

# Clear Expo cache and start web
npx expo start -c --web
```

Adding more icons/fonts:
- If you use other packs from `@expo/vector-icons` (e.g., MaterialIcons), add their `.ttf` to the `iconFonts` map in `app/_layout.jsx` and reload.

