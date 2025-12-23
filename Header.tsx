
import React from 'react';

const Header: React.FC = () => {
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
          PC
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none text-slate-900">PC App</h1>
          <p className="text-[10px] text-blue-500 font-medium uppercase tracking-wider">Premium Tech</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {user && (
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-800">{user.first_name}</p>
            <p className="text-[10px] text-slate-400">Xush kelibsiz!</p>
          </div>
        )}
        <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
          <img src={`https://ui-avatars.com/api/?name=${user?.first_name || 'Guest'}&background=random`} alt="user" />
        </div>
      </div>
    </header>
  );
};

export default Header;
