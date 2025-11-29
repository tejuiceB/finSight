'use client';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              About FinSight
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your intelligent financial agent. Upload documents, get insights,
              and transform your financial health with smart recommendations.
            </p>
          </div>

          {/* Privacy */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Privacy & Security
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>🔒 All data stored locally in your browser</li>
              <li>🛡️ No server database - your privacy first</li>
              <li>✅ Files processed securely in browser</li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Resources
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>
                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                  About FinSight
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            © 2025 FinSight. Your Intelligent Financial Agent. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
