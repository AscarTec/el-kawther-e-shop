import React from 'react';
import { Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, Ticket, 
  ChevronLeft, ChevronRight, Menu, X, LogOut, Home, Boxes
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';
import { useTheme } from '@/contexts/ThemeContext';
import logoLight from '@/assets/logo-light.png';
import logoDark from '@/assets/logo-dark.png';
import { cn } from '@/lib/utils';

const navItems = [
  { key: 'dashboard', icon: LayoutDashboard, path: '/admin' },
  { key: 'orders', icon: ShoppingCart, path: '/admin/orders' },
  { key: 'products', icon: Package, path: '/admin/products' },
  { key: 'inventory', icon: Boxes, path: '/admin/inventory' },
  { key: 'coupons', icon: Ticket, path: '/admin/coupons' },
];

function NavLink({ item, isActive, collapsed }: { 
  item: typeof navItems[0]; 
  isActive: boolean; 
  collapsed: boolean;
}) {
  const { t, isArabic } = useLanguage();
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
        isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{t(`admin.${item.key}`)}</span>}
    </Link>
  );
}

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { t, isArabic } = useLanguage();
  const { theme } = useTheme();
  const { logout } = useStore();
  const location = useLocation();
  const logo = theme === 'dark' ? logoDark : logoLight;

  return (
    <div className={cn(
      'h-full flex flex-col border-e bg-card transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-8" />
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={onToggle} className="shrink-0">
          {collapsed 
            ? (isArabic ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />) 
            : (isArabic ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />)}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => (
          <NavLink 
            key={item.key} 
            item={item} 
            isActive={location.pathname === item.path}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{t('nav.home')}</span>}
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{t('nav.logout')}</span>}
        </button>
      </div>
    </div>
  );
}

function MobileSidebar() {
  const { t, isArabic } = useLanguage();
  const { theme } = useTheme();
  const { logout } = useStore();
  const location = useLocation();
  const logo = theme === 'dark' ? logoDark : logoLight;
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side={isArabic ? 'right' : 'left'} className="w-64 p-0">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <img src={logo} alt="Logo" className="h-8" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{t(`admin.${item.key}`)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t space-y-1">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-5 w-5 shrink-0" />
              <span>{t('nav.home')}</span>
            </Link>
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>{t('nav.logout')}</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function AdminLayout() {
  const { t, isArabic } = useLanguage();
  const { user, isAdmin } = useStore();
  const [collapsed, setCollapsed] = React.useState(false);

  // Redirect if not admin
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden h-14 border-b bg-card flex items-center px-4 gap-4">
          <MobileSidebar />
          <h1 className="font-semibold">{t('admin.dashboard')}</h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 bg-muted/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
