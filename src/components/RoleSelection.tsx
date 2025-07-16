import React from 'react';
import { Database, Target, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const RoleSelection: React.FC = () => {
  const { setUserRole, authState } = useAuth();

  const roles = [
    {
      id: 'client' as const,
      title: 'Client',
      subtitle: 'Data Requester',
      description: 'Upload datasets and create labeling tasks for the community',
      icon: Database,
      color: 'from-[#00FFB2] to-[#00FFB2]/80',
      features: [
        'Upload datasets (CSV, JSON)',
        'Create custom labeling tasks',
        'Track progress in real-time',
        'Manage escrow & payments',
        'Download verified results',
      ],
    },
    {
      id: 'labeler' as const,
      title: 'Labeler',
      subtitle: 'Task Worker',
      description: 'Earn ICP tokens by contributing high-quality data labels',
      icon: Target,
      color: 'from-[#9B5DE5] to-[#9B5DE5]/80',
      features: [
        'Browse task marketplace',
        'Earn ICP for quality work',
        'Build reputation & level up',
        'Stake tokens for better tasks',
        'Instant reward claims',
      ],
    },
    {
      id: 'admin' as const,
      title: 'Admin',
      subtitle: 'Platform Manager',
      description: 'Oversee platform operations and ensure quality standards',
      icon: Shield,
      color: 'from-[#0A0E2A] to-[#1a1f4a]',
      features: [
        'Monitor all platform activity',
        'Review & approve submissions',
        'Manage user accounts',
        'Control stake & payouts',
        'Handle dispute resolution',
      ],
    },
  ];

  const handleRoleSelect = async (role: 'client' | 'labeler' | 'admin') => {
    await setUserRole(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E2A] via-[#0A0E2A] to-[#1a1f4a] flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-[#00FFB2] rounded-2xl flex items-center justify-center">
              <Database className="w-7 h-7 text-[#0A0E2A]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                Validata
              </h1>
              <p className="text-[#00FFB2] text-sm">Web3 AI Data Platform</p>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            Choose Your Role
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Welcome to the decentralized future of AI data labeling. Select your role to get started 
            and begin contributing to the Web3 AI ecosystem.
          </p>
          
          {authState.user && (
            <div className="mt-4 inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl">
              <div className="w-2 h-2 bg-[#00FFB2] rounded-full"></div>
              <span className="text-white text-sm">
                Connected: {authState.user.principal.slice(0, 8)}...{authState.user.principal.slice(-8)}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
                onClick={() => handleRoleSelect(role.id)}
              >
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${role.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0A0E2A] mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {role.title}
                  </h3>
                  <p className="text-[#9B5DE5] font-medium text-sm">{role.subtitle}</p>
                </div>

                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  {role.description}
                </p>

                <div className="space-y-3 mb-8">
                  {role.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#00FFB2] rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-gradient-to-r from-[#00FFB2] to-[#00FFB2]/90 text-[#0A0E2A] py-3 rounded-2xl font-semibold hover:from-[#00FFB2]/90 hover:to-[#00FFB2] transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-lg">
                  <span>Select {role.title}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            You can change your role later in your profile settings
          </p>
        </div>
      </div>
    </div>
  );
};