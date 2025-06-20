import React, { useState } from 'react'
import { User, Crown, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, profile, isProUser, signOut } = useAuth()

  if (!user) return null

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isProUser ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-600'
        }`}>
          {isProUser ? (
            <Crown className="w-4 h-4 text-white" />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900">
            {user.email?.split('@')[0]}
          </p>
          <p className="text-xs text-gray-500">
            {isProUser ? 'Pro User' : 'Free User'}
          </p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-20">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isProUser ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-600'
                }`}>
                  {isProUser ? (
                    <Crown className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    {isProUser ? 'Pro Account' : 'Free Account'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2">
              {!isProUser && (
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-blue-50 rounded-lg transition-colors group">
                  <Crown className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Upgrade to Pro</p>
                    <p className="text-xs text-blue-600">Unlock all features</p>
                  </div>
                </button>
              )}
              
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Settings className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Account Settings</span>
              </button>
              
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default UserMenu