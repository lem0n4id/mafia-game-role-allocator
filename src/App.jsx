function App() {
  return (
    <div className="min-h-screen flex flex-col p-4 max-w-2xl mx-auto text-center md:p-8">
      <header className="py-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-gray-800">
          Mafia Game Role Allocator
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          A minimal, mobile-first role allocation system for Mafia games.
        </p>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Welcome to the Setup
          </h2>
          <p className="mb-6 text-gray-600">
            This foundational React 18 + Vite application is ready for feature
            development.
          </p>

          <div className="text-left space-y-2">
            <p className="text-sm text-green-700">
              ✅ React 18 functional components
            </p>
            <p className="text-sm text-green-700">✅ Vite build system</p>
            <p className="text-sm text-green-700">✅ Hot module replacement</p>
            <p className="text-sm text-green-700">
              ✅ Mobile-first architecture ready
            </p>
            <p className="text-sm text-green-700">
              ✅ Tailwind CSS v3.4.17 integrated
            </p>
            <p className="text-sm text-green-700">
              ✅ PostCSS + Autoprefixer configured
            </p>
            <p className="text-sm text-green-700">
              ✅ Mobile-first breakpoints (sm:640px, md:768px, lg:1024px)
            </p>
          </div>
        </div>
      </main>

      <footer className="p-4 text-gray-500 text-sm">
        <p>Ready for feature implementation</p>
      </footer>
    </div>
  );
}

export default App;
