import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  History,
  ArrowDownToLine,
  ArrowUpFromLine,
  Settings,
  LogOut,
  Film,
  User,
} from 'lucide-react';
import Button from '../ui/Button';

const navLinks = [
  { to: '/dashboard/overview', icon: <LayoutDashboard size={20} />, label: 'Overview' },
  { to: '/dashboard/packages', icon: <Package size={20} />, label: 'Packages' },
  { to: '/dashboard/earnings', icon: <History size={20} />, label: 'Earnings' },
  { to: '/dashboard/deposits', icon: <ArrowDownToLine size={20} />, label: 'Deposits' },
  { to: '/dashboard/withdrawals', icon: <ArrowUpFromLine size={20} />, label: 'Withdrawals' },
  { to: '/dashboard/settings', icon: <Settings size={20} />, label: 'Settings' },
];

const Sidebar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center space-x-2">
          <Film className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-text-primary">PrimeAdView</span>
        </Link>
      </div>
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" className="w-full h-full rounded-full" />
            ) : (
              <User className="text-text-secondary" />
            )}
          </div>
          <div>
            <p className="font-semibold text-text-primary text-sm truncate">{profile?.full_name || user?.email}</p>
            <p className="text-xs text-text-secondary">Balance: ${profile?.deposit_balance?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-secondary hover:text-text-primary'
              }`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <Button onClick={handleSignOut} variant="secondary" className="w-full justify-center">
          <LogOut size={16} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
