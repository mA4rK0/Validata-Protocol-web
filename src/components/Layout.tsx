import React, { useState } from 'react';
import { Database, Menu, X, LogOut, Wallet, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#00FFB2] rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-[#0A0E2A]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#0A0E2A]" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Validata
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-sm font-medium text-[#0A0E2A]" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {title}
                </div>
                <div className="text-xs text-gray-500">{subtitle}</div>
              </div>

              {/* Wallet Status */}
              <div className="flex items-center space-x-3 bg-[#00FFB2]/10 px-4 py-2 rounded-xl border border-[#00FFB2]/20">
                <Wallet className="w-4 h-4 text-[#00FFB2]" />
                <div className="text-sm">
                  <div className="font-medium text-[#0A0E2A]">Connected</div>
                  <div className="text-xs text-gray-600 font-mono">
                    {authState.user?.principal.slice(0, 8)}...{authState.user?.principal.slice(-6)}
                  </div>
                </div>
              </div>

              {/* User Menu */}
              <div className="relative">
                <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-xl">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {authState.user?.role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-4">
              <div className="text-center pb-4 border-b border-gray-100">
                <div className="text-lg font-bold text-[#0A0E2A]" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {title}
                </div>
                <div className="text-sm text-gray-500">{subtitle}</div>
              </div>

              {/* Mobile Wallet Status */}
              <div className="flex items-center space-x-3 bg-[#00FFB2]/10 px-4 py-3 rounded-xl border border-[#00FFB2]/20">
                <Wallet className="w-5 h-5 text-[#00FFB2]" />
                <div>
                  <div className="font-medium text-[#0A0E2A] text-sm">Wallet Connected</div>
                  <div className="text-xs text-gray-600 font-mono">
                    {authState.user?.principal.slice(0, 12)}...{authState.user?.principal.slice(-8)}
                  </div>
                </div>
              </div>

              {/* Mobile User Info */}
              <div className="flex items-center space-x-3 bg-gray-50 px-4 py-3 rounded-xl">
                <User className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-700 text-sm capitalize">
                    {authState.user?.role} Dashboard
                  </div>
                  <div className="text-xs text-gray-500">
                    {authState.user?.profile?.username}
                  </div>
                </div>
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