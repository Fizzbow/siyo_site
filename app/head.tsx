export default function Head() {
  return (
    <>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      {/* Safari / mobile browser address bar color (locked to dark to match page header) */}
      <meta name="theme-color" content="#020617" />
      {/* Set initial theme before React hydration using localStorage / system preference to avoid light-to-dark flash */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function() {
  try {
    var storageKey = 'theme';
    var theme = localStorage.getItem(storageKey);
    if (!theme) {
      var mql = window.matchMedia('(prefers-color-scheme: dark)');
      if (mql.matches) theme = 'dark';
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();`,
        }}
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
      />
    </>
  );
}
