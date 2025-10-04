import { ChangePlayersPermissionsRequest, Player } from '@/components/constants/types'
import { changePlayersPermissions } from '@/components/lib/api';
import { showToast } from '@/utils/toastUtil';
import React, { useEffect, useState } from 'react'

const PermissionSkeleton = () => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm animate-pulse">
    <div className="h-4 bg-gray-300 rounded-md w-2/5"></div>
    <div className="h-7 w-14 bg-gray-300 rounded-full"></div>
  </div>
);

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-gray-600 transition-colors">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
    return (
        <div className="relative flex items-center group">
            {children}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible z-10">
                {text}
                <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---

const PlayerPermissions = ({ isLoadingData, playerData }: { isLoadingData: boolean, playerData?: Player }) => {
  // State for each permission
  const [canPlayCasino, setCanPlayCasino] = useState(false);
  const [canSportsBet, setCanSportsBet] = useState(false);

  // Individual loading states for API calls
  const [isUpdatingCasino, setIsUpdatingCasino] = useState(false);
  const [isUpdatingSportsBet, setIsUpdatingSportsBet] = useState(false);

  // Effect to sync component state with incoming player data
  useEffect(() => {
    if (playerData) {
      setCanPlayCasino(playerData.canPlayCasino);
      setCanSportsBet(playerData.canSportsBet);
    }
  }, [playerData]);

  // Generic handler for toggling permissions
  const handlePermissionChange = async (
    permission: 'casino' | 'sports',
    newValue: boolean
  ) => {
    if (!playerData) return;

    // Set the specific loading state
    if (permission === 'casino') {
        setIsUpdatingCasino(true);
    } else {
        setIsUpdatingSportsBet(true);
    }

    const requestBody: ChangePlayersPermissionsRequest = {
      playerId: playerData.playerId, // Corrected from playerId to id to match Player interface
      ...(permission === 'casino' && { canPlayCasino: newValue }),
      ...(permission === 'sports' && { canSportsBet: newValue }),
    };

    const response = await changePlayersPermissions(requestBody);

    if (response.isSuccess) {
      // Update the state only on successful API call
      if (permission === 'casino') {
        setCanPlayCasino(newValue);
      } else {
        setCanSportsBet(newValue);
      }
      showToast(response.message || 'Success!', 'success');
    } else {
      showToast(response.message || 'Failed to update.', 'error');
    }
    
    // Unset the specific loading state
    if (permission === 'casino') {
        setIsUpdatingCasino(false);
    } else {
        setIsUpdatingSportsBet(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="p-6 bg-gray-50 rounded-xl space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Player Permissions</h3>
        <PermissionSkeleton />
        <PermissionSkeleton />
      </div>
    );
  }

  if (!playerData) {
    return (
      <div className="p-6 bg-gray-50 rounded-xl">
        <p className="text-center text-gray-500">No player data available.</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Player Permissions</h3>
        <div className="space-y-4">
            {/* Casino Toggle */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Can Play Casino</span>
                    <Tooltip text="Enables or disables the player's access to all casino games, including slots and live dealer tables.">
                        <InfoIcon />
                    </Tooltip>
                </div>
                <button
                    disabled={isUpdatingCasino || isUpdatingSportsBet}
                    onClick={() => handlePermissionChange('casino', !canPlayCasino)}
                    className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        canPlayCasino ? 'bg-indigo-600' : 'bg-gray-300'
                    } ${isUpdatingCasino || isUpdatingSportsBet ? 'cursor-not-allowed' : ''}`}
                >
                    <span className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ${
                        canPlayCasino ? 'translate-x-8' : 'translate-x-1'
                    }`}>
                        {isUpdatingCasino && <div className="w-full h-full border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>}
                    </span>
                </button>
            </div>
            
            {/* Sports Bet Toggle */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Can Sports Bet</span>
                    <Tooltip text="Permits or restricts the player from placing bets on any sports-related events.">
                        <InfoIcon />
                    </Tooltip>
                </div>
                 <button
                    disabled={isUpdatingCasino || isUpdatingSportsBet}
                    onClick={() => handlePermissionChange('sports', !canSportsBet)}
                    className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                        canSportsBet ? 'bg-green-600' : 'bg-gray-300'
                    } ${isUpdatingCasino || isUpdatingSportsBet ? 'cursor-not-allowed' : ''}`}
                >
                    <span className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ${
                        canSportsBet ? 'translate-x-8' : 'translate-x-1'
                    }`}>
                        {isUpdatingSportsBet && <div className="w-full h-full border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>}
                    </span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default PlayerPermissions;