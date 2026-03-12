import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type Role } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const ROLES: { value: Role; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'rd', label: 'R&D Team' },
  { value: 'packing', label: 'Packing Team' },
  { value: 'production', label: 'Production Manager' },
  { value: 'marketing', label: 'Marketing Team' },
];

export default function Login() {
  const [role, setRole] = useState<Role>('admin');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
    navigate('/');
  };

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <Card className="w-full max-w-md animate-in-slide-up">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold text-gold-foreground font-bold text-xl">
              A
            </div>
          </div>
          <CardTitle className="text-2xl">ABLOS Brand Launch OS</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to access the portal
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Select your role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Login as {ROLES.find((r) => r.value === role)?.label}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
