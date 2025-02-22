export const createWalkerIcon = (): string => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
      <!-- Traveler 1 - More Realistic -->
      <!-- Head with better anatomy -->
      <ellipse cx="18" cy="9.5" rx="4.5" ry="5" fill="#e0be98" stroke="#5d4037" stroke-width="0.7"/>
      
      <!-- Face details -->
      <path d="M16 8.5 Q17 8, 17.5 9" stroke="#5d4037" stroke-width="0.6" fill="none"/> <!-- Eyebrow left -->
      <path d="M18.5 8.5 Q19.5 8, 20 9" stroke="#5d4037" stroke-width="0.6" fill="none"/> <!-- Eyebrow right -->
      <ellipse cx="16.5" cy="9.2" rx="0.7" ry="0.9" fill="#3e2723"/> <!-- Eye left -->
      <ellipse cx="19.5" cy="9.2" rx="0.7" ry="0.9" fill="#3e2723"/> <!-- Eye right -->
      <path d="M16.5 12 Q18 13, 19.5 12" stroke="#5d4037" stroke-width="0.6" fill="none"/> <!-- Mouth -->
      <path d="M18 10.5 L18 11.5" stroke="#5d4037" stroke-width="0.6"/> <!-- Nose -->
      
      <!-- Hair with more detail -->
      <path d="M14.5 7.5 C14 5, 22 5, 21.5 7.5" stroke="#3e2723" stroke-width="0.7" fill="#5d4037"/>
      <path d="M14.5 7.5 C15 9, 21 9, 21.5 7.5" stroke="#3e2723" stroke-width="0.5" fill="#5d4037"/>
      <path d="M14 8 Q13.5 9.5, 14.5 11" stroke="#5d4037" stroke-width="0.7" fill="none"/> <!-- Sideburn -->
      <path d="M22 8 Q22.5 9.5, 21.5 11" stroke="#5d4037" stroke-width="0.7" fill="none"/> <!-- Sideburn -->
      
      <!-- Neck -->
      <path d="M18 14 L18 15.5" stroke="#d7b594" stroke-width="2.5" stroke-linecap="round"/>
      
      <!-- Torso with better anatomy -->
      <path d="M18 15.5 L18 32" stroke="#1976D2" stroke-width="3" stroke-linecap="round"/>
      
      <!-- Technical backpack -->
      <path d="M14.5 16 C14 18, 14 28, 15 30" stroke="#388E3C" stroke-width="0.7" fill="#4CAF50"/> <!-- Backpack left -->
      <path d="M21.5 16 C22 18, 22 28, 21 30" stroke="#388E3C" stroke-width="0.7" fill="#4CAF50"/> <!-- Backpack right -->
      <path d="M14.5 16 L21.5 16" stroke="#388E3C" stroke-width="0.7" fill="none"/> <!-- Backpack top -->
      <path d="M15 30 L21 30" stroke="#388E3C" stroke-width="0.7" fill="none"/> <!-- Backpack bottom -->
      <path d="M16 19 L20 19" stroke="#388E3C" stroke-width="0.6"/> <!-- Backpack detail -->
      <path d="M16 22 L20 22" stroke="#388E3C" stroke-width="0.6"/> <!-- Backpack detail -->
      <path d="M16 25 L20 25" stroke="#388E3C" stroke-width="0.6"/> <!-- Backpack detail -->
      
      <!-- Straps -->
      <path d="M16 16 L16 22" stroke="#2E7D32" stroke-width="0.8"/> <!-- Left strap -->
      <path d="M20 16 L20 22" stroke="#2E7D32" stroke-width="0.8"/> <!-- Right strap -->
      
      <!-- Arms with better anatomy -->
      <path d="M18 18 C16 19, 14 21, 12 23" stroke="#d7b594" stroke-width="2.2" stroke-linecap="round"/> <!-- Left arm -->
      <path d="M18 18 C20 19, 22 21, 24 23" stroke="#d7b594" stroke-width="2.2" stroke-linecap="round"/> <!-- Right arm -->
      
      <!-- Hands -->
      <circle cx="12" cy="23" r="1" fill="#d7b594" stroke="#5d4037" stroke-width="0.4"/>
      <circle cx="24" cy="23" r="1" fill="#d7b594" stroke="#5d4037" stroke-width="0.4"/>
      
      <!-- Legs with better anatomy -->
      <path d="M18 32 C16 35, 14 40, 12.5 44.5" stroke="#263238" stroke-width="2.5" stroke-linecap="round"/> <!-- Left leg -->
      <path d="M18 32 C20 35, 22 40, 23.5 44.5" stroke="#263238" stroke-width="2.5" stroke-linecap="round"/> <!-- Right leg -->
      
      <!-- Hiking boots with detail -->
      <path d="M10.5 44.5 C11 46, 14 46, 14.5 44.5" stroke="#3E2723" stroke-width="0.6" fill="#5D4037"/>
      <path d="M10.5 44.5 L10 45.5 L14.8 45.5 L14.5 44.5" stroke="#3E2723" stroke-width="0.6" fill="#3E2723"/>
      <path d="M21.5 44.5 C22 46, 25 46, 25.5 44.5" stroke="#3E2723" stroke-width="0.6" fill="#5D4037"/>
      <path d="M21.5 44.5 L21 45.5 L25.8 45.5 L25.5 44.5" stroke="#3E2723" stroke-width="0.6" fill="#3E2723"/>
      
      <!-- Traveler 2 - More Realistic -->
      <!-- Head with better anatomy -->
      <ellipse cx="40" cy="9.5" rx="4.5" ry="5" fill="#f0d6b1" stroke="#5d4037" stroke-width="0.7"/>
      
      <!-- Face details -->
      <path d="M38 8.5 Q39 8, 39.5 9" stroke="#5d4037" stroke-width="0.6" fill="none"/> <!-- Eyebrow left -->
      <path d="M40.5 8.5 Q41.5 8, 42 9" stroke="#5d4037" stroke-width="0.6" fill="none"/> <!-- Eyebrow right -->
      <ellipse cx="38.5" cy="9.2" rx="0.7" ry="0.9" fill="#3e2723"/> <!-- Eye left -->
      <ellipse cx="41.5" cy="9.2" rx="0.7" ry="0.9" fill="#3e2723"/> <!-- Eye right -->
      <path d="M38.5 12 Q40 13, 41.5 12" stroke="#5d4037" stroke-width="0.6" fill="none"/> <!-- Mouth -->
      <path d="M40 10.5 L40 11.5" stroke="#5d4037" stroke-width="0.6"/> <!-- Nose -->
      
      <!-- Longer hair with more detail -->
      <path d="M36.5 7 C36 4, 44 4, 43.5 7" stroke="#784618" stroke-width="0.7" fill="#8D6E63"/>
      <path d="M36.5 7 C37 8.5, 43 8.5, 43.5 7" stroke="#784618" stroke-width="0.5" fill="#8D6E63"/>
      <path d="M43.5 7 C45 9, 44 14, 43 16" stroke="#784618" stroke-width="0.7" fill="#8D6E63"/> <!-- Hair flowing down -->
      <path d="M36.5 7 C35 9, 36 14, 37 16" stroke="#784618" stroke-width="0.7" fill="#8D6E63"/> <!-- Hair flowing down -->
      
      <!-- Neck -->
      <path d="M40 14 L40 15.5" stroke="#e8c9a9" stroke-width="2.5" stroke-linecap="round"/>
      
      <!-- Torso with better anatomy -->
      <path d="M40 15.5 L40 32" stroke="#673AB7" stroke-width="3" stroke-linecap="round"/>
      
      <!-- Technical backpack -->
      <path d="M36.5 16 C36 18, 36 28, 37 30" stroke="#C62828" stroke-width="0.7" fill="#F44336"/> <!-- Backpack left -->
      <path d="M43.5 16 C44 18, 44 28, 43 30" stroke="#C62828" stroke-width="0.7" fill="#F44336"/> <!-- Backpack right -->
      <path d="M36.5 16 L43.5 16" stroke="#C62828" stroke-width="0.7" fill="none"/> <!-- Backpack top -->
      <path d="M37 30 L43 30" stroke="#C62828" stroke-width="0.7" fill="none"/> <!-- Backpack bottom -->
      <path d="M38 19 L42 19" stroke="#C62828" stroke-width="0.6"/> <!-- Backpack detail -->
      <path d="M38 22 L42 22" stroke="#C62828" stroke-width="0.6"/> <!-- Backpack detail -->
      <path d="M38 25 L42 25" stroke="#C62828" stroke-width="0.6"/> <!-- Backpack detail -->
      
      <!-- Straps -->
      <path d="M38 16 L38 22" stroke="#B71C1C" stroke-width="0.8"/> <!-- Left strap -->
      <path d="M42 16 L42 22" stroke="#B71C1C" stroke-width="0.8"/> <!-- Right strap -->
      
      <!-- Arms with better anatomy -->
      <path d="M40 18 C38 19, 36 21, 34 23" stroke="#e8c9a9" stroke-width="2.2" stroke-linecap="round"/> <!-- Left arm -->
      <path d="M40 18 C42 19, 44 21, 46 23" stroke="#e8c9a9" stroke-width="2.2" stroke-linecap="round"/> <!-- Right arm -->
      
      <!-- Hands -->
      <circle cx="34" cy="23" r="1" fill="#e8c9a9" stroke="#5d4037" stroke-width="0.4"/>
      <circle cx="46" cy="23" r="1" fill="#e8c9a9" stroke="#5d4037" stroke-width="0.4"/>
      
      <!-- Legs with better anatomy -->
      <path d="M40 32 C38 35, 36 40, 34.5 44.5" stroke="#455A64" stroke-width="2.5" stroke-linecap="round"/> <!-- Left leg -->
      <path d="M40 32 C42 35, 44 40, 45.5 44.5" stroke="#455A64" stroke-width="2.5" stroke-linecap="round"/> <!-- Right leg -->
      
      <!-- Hiking boots with detail -->
      <path d="M32.5 44.5 C33 46, 36 46, 36.5 44.5" stroke="#3E2723" stroke-width="0.6" fill="#5D4037"/>
      <path d="M32.5 44.5 L32 45.5 L36.8 45.5 L36.5 44.5" stroke="#3E2723" stroke-width="0.6" fill="#3E2723"/>
      <path d="M43.5 44.5 C44 46, 47 46, 47.5 44.5" stroke="#3E2723" stroke-width="0.6" fill="#5D4037"/>
      <path d="M43.5 44.5 L43 45.5 L47.8 45.5 L47.5 44.5" stroke="#3E2723" stroke-width="0.6" fill="#3E2723"/>
      
      <!-- Dog - More Realistic -->
      <!-- Body with more anatomical shape -->
      <path d="M24 38 C26 36, 29 36, 31 37 C33 38, 35 38, 34 40 C33 42, 31 43, 28 43 C25 43, 24 41, 24 38" 
        fill="#8D6E63" stroke="#5D4037" stroke-width="0.7"/>
      
      <!-- Head with more detail -->
      <ellipse cx="23" cy="38" rx="2.8" ry="2.5" fill="#8D6E63" stroke="#5D4037" stroke-width="0.7"/>
      
      <!-- Face features -->
      <ellipse cx="21.5" cy="37.5" rx="0.6" ry="0.8" fill="#3E2723"/> <!-- Eye -->
      <path d="M20.8 38.5 C20.5 38.8, 20.2 39, 20.5 39.2" fill="#212121" stroke="#212121" stroke-width="0.5"/> <!-- Nose -->
      <path d="M20.5 39.2 Q21 39.7, 22 39.5" stroke="#3E2723" stroke-width="0.4" fill="none"/> <!-- Mouth -->
      
      <!-- Ears with more detail -->
      <path d="M21 36 Q20 34.5, 21 35 Q21.5 35.5, 22 35" stroke="#5D4037" stroke-width="0.6" fill="#795548"/> <!-- Left ear -->
      <path d="M24 36 Q25 34.5, 25 35 Q24.5 35.5, 24 35" stroke="#5D4037" stroke-width="0.6" fill="#795548"/> <!-- Right ear -->
      
      <!-- Neck more defined -->
      <path d="M25 38 C26 38.5, 27 39, 28 39" stroke="#795548" stroke-width="1.5" fill="none"/>
      
      <!-- Legs with joints -->
      <path d="M28 43 C28 44, 27.5 46, 27 48" stroke="#795548" stroke-width="1.5" stroke-linecap="round"/> <!-- Front left -->
      <path d="M31 42.5 C31.5 44, 31.8 46, 32 48" stroke="#795548" stroke-width="1.5" stroke-linecap="round"/> <!-- Front right -->
      <path d="M33 41 C33.5 42, 34 44, 34 46" stroke="#795548" stroke-width="1.5" stroke-linecap="round"/> <!-- Back right -->
      <path d="M30 42 C30 43, 30 44, 29.5 46" stroke="#795548" stroke-width="1.5" stroke-linecap="round"/> <!-- Back left -->
      
      <!-- Paws -->
      <ellipse cx="27" cy="48.2" rx="0.8" ry="0.5" fill="#5D4037"/>
      <ellipse cx="32" cy="48.2" rx="0.8" ry="0.5" fill="#5D4037"/>
      <ellipse cx="34" cy="46.2" rx="0.8" ry="0.5" fill="#5D4037"/>
      <ellipse cx="29.5" cy="46.2" rx="0.8" ry="0.5" fill="#5D4037"/>
      
      <!-- Tail with more detail -->
      <path d="M34 40 C36 38, 37 39, 37 40.5" stroke="#795548" stroke-width="1.2" fill="none"/>
      
      <!-- Collar with tag -->
      <path d="M26 38.5 C26.5 39, 27.5 39, 28 38.5" stroke="#D32F2F" stroke-width="0.7" fill="none"/>
      <circle cx="27" cy="39" r="0.5" fill="#FDD835" stroke="#F57F17" stroke-width="0.2"/>
    </svg>
  `;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
};
