import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col">
      <nav className="flex items-center justify-between px-8 py-4">
        <span className="text-blue-400 font-bold text-lg">⚡ RadAssist</span>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-gray-300 hover:text-white text-sm"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-bold text-white mb-4 max-w-2xl leading-tight">
          AI-Powered Radiology Analysis
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-lg">
          A second pair of eyes for radiologists. An interactive tutor for
          residents. Upload any medical image and get instant AI analysis.
        </p>
        <div className="flex gap-4">
          <Link
            href="/signup"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-lg"
          >
            Start Free
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg font-medium text-lg border border-gray-600"
          >
            Sign In
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-20 max-w-4xl">
          <div className="text-left">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="text-white font-semibold mb-1">Quick Read</h3>
            <p className="text-gray-400 text-sm">
              Upload an image and get structured findings, differentials, and
              next steps in seconds.
            </p>
          </div>
          <div className="text-left">
            <div className="text-2xl mb-2">🎓</div>
            <h3 className="text-white font-semibold mb-1">Learning Mode</h3>
            <p className="text-gray-400 text-sm">
              Practice reading images with an AI tutor that guides you through
              cases using the Socratic method.
            </p>
          </div>
          <div className="text-left">
            <div className="text-2xl mb-2">🏥</div>
            <h3 className="text-white font-semibold mb-1">DICOM Support</h3>
            <p className="text-gray-400 text-sm">
              Full medical image viewer with windowing, measurements, and
              annotations. Works with DICOM files.
            </p>
          </div>
        </div>
      </div>

      <footer className="text-center py-6 border-t border-gray-800">
        <p className="text-gray-600 text-xs">
          ⚠️ RadAssist is for educational and assistive purposes only. Not a
          clinical diagnostic tool. All findings must be verified by a qualified
          radiologist.
        </p>
      </footer>
    </main>
  );
}
