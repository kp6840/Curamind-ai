import React from 'react';
import { Bell, Search, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/AuthContext';

export default function TopBar() {
  const { user } = useAuth();
  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search patients, records, appointments..."
            className="pl-10 h-9 bg-muted/50 border-0 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="outline" className="hidden md:flex items-center gap-1.5 py-1 px-2.5 border-emerald-200 bg-emerald-50 text-emerald-700">
          <Shield className="w-3 h-3" />
          <span className="text-[11px] font-medium">HIPAA Compliant</span>
        </Badge>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </Button>
        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-xs font-semibold leading-tight">{user?.full_name || 'User'}</p>
            <p className="text-[10px] text-muted-foreground">{user?.role || 'Admin'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}