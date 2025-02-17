<h1> Brain Memory </h1>

**Brain Memory** is a lightweight JavaScript library designed to simplify and enhance the management of browser's `localStorage` and `sessionStorage`. Inspired by how the human brain manages memory, it provides an intuitive API to store, retrieve, update, and manage your data efficiently.

---

## Table of Contents
  
  - [Features](#features)
  - [Browser Support](#browser_support)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Tips and Tricks](#tips-and-tricks)
  - [Credits](#credits)

---

## Features

- **Store Data**: Easily save key-value pairs.
- **Retrieve Data**: Retrieve specific or multiple keys with default values.
- **Update Data**: Update existing records non-destructively.
- **Forget Data**: Remove specific keys or all data with conditions.
- **Scoped Storage**: Use prefixes to create isolated namespaces.

---

## Browser Support

Brain Memory is designed to work seamlessly in web browsers that support `localStorage` and `sessionStorage`. Below is an overview of browser compatibility:

**Supported Browsers**

- **Google Chrome**: Version 4 and above
- **Mozilla Firefox**: Version 3.5 and above
- **Apple Safari**: Version 4 and above
- **Microsoft Edge**: Version 12 and above
- **Opera**: Version 10.50 and above
- **Mobile Browsers**: 
  - **Android Browser**: Version 2.1 and above
  - **iOS Safari**: Version 3.2 and above
  - **Chrome for Android**: Supported
  - **Firefox for Android**: Supported

**Unsupported Browsers**

- **Internet Explorer 8 or below**: `localStorage` and `sessionStorage` are not supported.

---

## Installation
You can include Brain Memory in your project using a CDN.

Add the following script tag to your HTML file:

```html
<script src="https://cdn.jsdelivr.net/gh/brain-memory@latest/brain-memory/dist/brain-memory.js"></script>
```
---

## Usage

### Initialization

**Permanent Storage (LocalStorage):**
```javascript
const permanentMemory = BrainMemory.permanent(); 
permanentMemory.record('appVersion', '1.0.0'); // Data persists across sessions
```
**Temporary Storage (SessionStorage):**
```javascript
const temporaryMemory = BrainMemory.temporary();
temporaryMemory.record('sessionID', 'abc123'); // Data is cleared after the session ends
```

#### **Scoped Storage Using Prefixes**

**Example: Namespaced storage with prefixes**
```javascript
const appScopedMemory = BrainMemory.permanent('myApp');
appScopedMemory.record('user.name', 'John');
appScopedMemory.record('user.theme', 'dark');

console.log(appScopedMemory.recallAll());
// Output: { user: { name: 'John', theme: 'dark' } }
```

**Temporary Scoped Storage:**
```javascript
const tempScopedMemory = BrainMemory.temporary('shoppingCart');
tempScopedMemory.record('cartItems', ['item1', 'item2']);
console.log(tempScopedMemory.recallAll());
// Output: { cartItems: ['item1', 'item2'] }
```


#### **Aliases**

- `BrainMemory.permanent()` and `BrainMemory.last()` are aliases for permanent (localStorage).
- `BrainMemory.temporary()` and `BrainMemory.temp()` are aliases for temporary (sessionStorage).

```javascript
const lastMemory = BrainMemory.last();
const tempMemory = BrainMemory.temp();

lastMemory.record('key', 'value');
tempMemory.record('sessionKey', 'tempValue');
```

---

### _.record(key, value, [rewrite])_
**Store or update a key-value pair.**

#### Example 1: Storing a simple key-value pair
```javascript
permanentMemory.record('username', 'JohnDoe');
```

#### Example 2: Storing complex data
```javascript
permanentMemory.record('user', { name: 'John', age: 30 });
```

#### Example 3: Prevent overwriting existing data
```javascript
permanentMemory.record('username', 'Alice', false); // Does nothing if 'username' already exists
```

---

### _.recallOne(key, [defaultValue, recordDefaultValue])_
**Retrieve a value by key, with optional defaults.**

#### Example 1: Retrieving an existing value
```javascript
console.log(permanentMemory.recallOne('username')); // Output: 'JohnDoe'
```

#### Example 2: Using a default value if the key doesn't exist
```javascript
console.log(permanentMemory.recallOne('theme', 'light')); // Output: 'light'
```

#### Example 3: Automatically store the default value if the key is missing
```javascript
permanentMemory.recallOne('fontSize', '16px', true); // Stores 'fontSize: 16px' if missing
```

---

### _.recall(keys, [defaultValues, recordDefaultValues])_
**Retrieve multiple values at once.**

#### Example 1: Retrieving multiple keys
```javascript
const data = permanentMemory.recall(['username', 'theme']);
console.log(data); // Output: { username: 'JohnDoe', theme: null }
```

#### Example 2: Providing default values
```javascript
const defaults = { username: 'Guest', theme: 'light' };
console.log(permanentMemory.recall(['username', 'theme'], defaults));
// Output: { username: 'JohnDoe', theme: 'light' }
```

#### Example 3: Automatically record missing keys
```javascript
permanentMemory.recall(['language', 'timezone'], { language: 'en', timezone: 'UTC' }, true);
// Stores 'language: en' and 'timezone: UTC' if missing
```

---

### _.forget(keys)_
**Remove specific keys.**

#### Example 1: Forget a single key
```javascript
permanentMemory.forget('username');
```

#### Example 2: Forget multiple keys
```javascript
permanentMemory.forget(['theme', 'fontSize']);
```

---

### _.forgetAll([condition])_
**Clear all keys, optionally based on a condition.**

#### Example 1: Clearing everything
```javascript
permanentMemory.forgetAll(); // Clears all keys
```

#### Example 2: Conditional clearing
```javascript
permanentMemory.forgetAll(false); // Does nothing because the condition is false
```

---

### _.prefix(prefix)_
**Set a prefix for namespacing keys.**

#### Example: Using prefixes
```javascript
const userMemory = BrainMemory.permanent().prefix('user');
userMemory.record('name', 'Alice');
userMemory.record('preferences.theme', 'dark');
console.log(userMemory.recallAll());
// Output: { name: 'Alice', preferences: { theme: 'dark' } }
```

---

### _.hasRecord(key)_
**Check if a key exists in storage.**

#### Example: Checking key existence
```javascript
console.log(permanentMemory.hasRecord('username')); // Output: true or false
```

---

### _.update(key, newValue)_
**Update an existing key without overwriting non-existing ones.**

#### Example: Updating an existing value
```javascript
permanentMemory.update('username', 'JaneDoe');
```

#### Example: Attempting to update a non-existing key (does nothing)
```javascript
permanentMemory.update('nonExistentKey', 'value'); // No changes
```

---

### _.recallExcept(keys, [defaultValues, recordDefaultValues])_
**Retrieve all keys except the specified ones.**

#### Example: Recall everything except certain keys
```javascript
const data = permanentMemory.recallExcept(['username']);
console.log(data); // Output: All stored keys except 'username'
```

---

### _.forgetExcept(keys)_
**Forget all keys except the specified ones.**

#### Example: Forget everything except certain keys
```javascript
permanentMemory.forgetExcept(['theme']);
```

---

### _.recallAll()_
**Retrieve all stored data.**

#### Example: Recall all keys
```javascript
const allData = permanentMemory.recallAll();
console.log(allData);
```

---

## Tips and Tricks

#### **1. Use Prefixes for Multi-App Storage**
To avoid key conflicts when managing multiple apps or features:
```javascript
const app1Storage = BrainMemory.permanent('app1');
const app2Storage = BrainMemory.permanent('app2');

app1Storage.record('config', { theme: 'light' });
app2Storage.record('config', { theme: 'dark' });

console.log(app1Storage.recallOne('config')); // Output: { theme: 'light' }
console.log(app2Storage.recallOne('config')); // Output: { theme: 'dark' }
```

---

#### **2. Nested Key Management**
Brain Memory supports nested keys for structured data:
```javascript
const userMemory = BrainMemory.permanent('user');

userMemory.record('profile.name', 'Alice');
userMemory.record('profile.settings.notifications', true);

console.log(userMemory.recallOne('profile'));
// Output: { name: 'Alice', settings: { notifications: true } }
```

---

#### **3. Automatically Save Defaults**
When retrieving a value with a default, save it automatically if it doesn't exist:
```javascript
const settingsMemory = BrainMemory.permanent('settings');

settingsMemory.recallOne('language', 'en', true); // Saves 'language: en' if missing
settingsMemory.recallOne('timezone', 'UTC', true); // Saves 'timezone: UTC' if missing

console.log(settingsMemory.recallAll());
// Output: { language: 'en', timezone: 'UTC' }
```

---

#### **4. Forget All Except Certain Keys**
Clear unnecessary data while keeping specific values:
```javascript
const memory = BrainMemory.permanent();
memory.record('keepKey', 'important');
memory.record('deleteKey1', 'temp');
memory.record('deleteKey2', 'temp');

memory.forgetExcept(['keepKey']);
console.log(memory.recallAll());
// Output: { keepKey: 'important' }
```

---

#### **5. Temporary Data for Session-Limited Features**
Use session storage for temporary features like one-time modals or session progress:
```javascript
const sessionMemory = BrainMemory.temporary('progress');
sessionMemory.record('step', 3); // Progress of a multi-step form
```

---

#### **6. Scoped Clearing with Prefixes**
Easily clear only the data for a specific app or feature:
```javascript
const chatMemory = BrainMemory.permanent('chat');
chatMemory.record('history', ['Hello', 'How are you?']);

chatMemory.forgetAll();
console.log(chatMemory.recallAll());
// Output: {}
```

---

#### **7. Simplify Settings Management**
Store multiple settings with default values:
```javascript
const settings = BrainMemory.permanent('settings');
const defaultSettings = { theme: 'light', notifications: true };

settings.recall(Object.keys(defaultSettings), defaultSettings, true);
console.log(settings.recallAll());
// Output: { theme: 'light', notifications: true }
```

---

#### **8. Easily Retrieve Values with Default Fallbacks**
Use `.recall()` to retrieve multiple values with defaults:
```javascript
const defaults = { theme: 'dark', fontSize: '16px' };
const userPrefs = BrainMemory.permanent('prefs');

const prefs = userPrefs.recall(['theme', 'fontSize'], defaults, true);
console.log(prefs);
// Output: { theme: 'dark', fontSize: '16px' }
```

---

#### **9. Efficiently Update Nested Objects**
Update deeply nested data without overwriting the rest:
```javascript
const userMemory = BrainMemory.permanent('user');

userMemory.record('profile', { name: 'Alice', age: 30 });
userMemory.record('profile.age', 31); // Updates only the age

console.log(userMemory.recallOne('profile'));
// Output: { name: 'Alice', age: 31 }
```

---

## Credits

- Designed and Developed by [Amine Amazou](https://github.com/amine-amazou).
- Minified using [Toptal JavaScript Minifier](https://www.toptal.com/developers/javascript-minifier).
- Thanks [Gemini](gemini.google.com) for error messages and description.
- Thanks [ChatGPT](chatgpt.com) for the documentation and exemples.
- Thanks [DevDocs](devdocs.io) for Web APIs and JavaScript Documentation.
- Thanks everyone for both direct and indirect support.
- Special thanks to all contributors and users for their feedback and support.
