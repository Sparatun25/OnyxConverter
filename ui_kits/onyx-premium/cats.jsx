const Cats = {
  CatLoading: () => (
    <svg className="cat cat-loading" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
    </svg>
  ),

  CatWaiting: () => (
    <svg className="cat cat-waiting" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  ),

  CatSuccess: () => (
    <svg className="cat cat-success" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
    </svg>
  ),

  CatMascot: () => (
    <svg className="cat cat-mascot" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="currentColor" opacity="0.1"/>
      <circle cx="24" cy="26" r="3" fill="currentColor"/>
      <circle cx="40" cy="26" r="3" fill="currentColor"/>
      <path d="M20 38c0-8 8-8 12-8s12 0 12 8" stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="32" cy="45" r="8" fill="currentColor"/>
      <circle cx="25" cy="22" r="2" fill="currentColor"/>
      <circle cx="39" cy="22" r="2" fill="currentColor"/>
    </svg>
  ),

  CatAbout: () => (
    <svg className="cat cat-about" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="8" r="1" fill="currentColor"/>
      <path d="M12 11v6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  CatCompanion: () => (
    <svg className="cat cat-companion" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
      <circle cx="16" cy="12" r="1.5" fill="currentColor"/>
      <path d="M12 16c-2.5 0-4.5-1-4.5-3s2-3 4.5-3 4.5 1 4.5 3-2 3-4.5 3z" fill="currentColor"/>
    </svg>
  )
};

export default Cats;