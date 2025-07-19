import React, { useState } from 'react';
import { Menu, X, LogOut, Wallet, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Logo, TextLogo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  const { authState, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0E2A] transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-[#1a1f4a] border-b border-gray-200 dark:border-gray-600 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Logo size="sm" />
              <div style={{ display: 'none' }}>
                <TextLogo size="sm" />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-sm font-medium text-[#0A0E2A] dark:text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</div>
              </div>

              {/* Wallet Status */}
              <div className="flex items-center space-x-3 bg-[#00FFB2]/10 px-4 py-2 rounded-xl border border-[#00FFB2]/20">
                <Wallet className="w-4 h-4 text-[#00FFB2]" />
                <div className="text-sm">
                  <div className="font-medium text-[#0A0E2A] dark:text-white">Connected</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                    {authState.user?.principal.slice(0, 8)}...{authState.user?.principal.slice(-6)}
                  </div>
                </div>
              </div>

              {/* User Menu */}
              <div className="relative">
                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-transparent dark:border dark:border-gray-600 px-3 py-2 rounded-xl">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 capitalize">
                    {authState.user?.role}
                  </span>
                </div>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-[#1a1f4a] border-t border-gray-200 dark:border-gray-600">
            <div className="px-4 py-4 space-y-4">
              <div className="text-center pb-4 border-b border-gray-100 dark:border-gray-600">
                <div className="text-lg font-bold text-[#0A0E2A] dark:text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300">{subtitle}</div>
              </div>

              {/* Mobile Wallet Status */}
              <div className="flex items-center space-x-3 bg-[#00FFB2]/10 px-4 py-3 rounded-xl border border-[#00FFB2]/20">
                <Wallet className="w-5 h-5 text-[#00FFB2]" />
                <div>
                  <div className="font-medium text-[#0A0E2A] dark:text-white text-sm">Wallet Connected</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 font-mono">
                    {authState.user?.principal.slice(0, 12)}...{authState.user?.principal.slice(-8)}
                  </div>
                </div>
              </div>

              {/* Mobile User Info */}
              <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-200 text-sm capitalize">
                    {authState.user?.role} Dashboard
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">
                    {authState.user?.profile?.username}
                  </div>
                </div>
              </div>

              {/* Mobile Theme Toggle */}
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Theme</span>
                <ThemeToggle />
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-3 rounded-xl hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};