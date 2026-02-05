import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { t, isArabic } = useLanguage();
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      toast.success(isArabic ? 'تم تسجيل الدخول بنجاح' : 'Logged in successfully');
      navigate('/');
    } else {
      toast.error(isArabic ? 'بيانات غير صحيحة' : 'Invalid credentials');
    }
  };

  return (
    <Layout>
      <div className="container py-16 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>{t('nav.login')}</CardTitle>
            <CardDescription>
              {isArabic ? 'سجل دخول للمتابعة' : 'Sign in to continue'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('checkout.email')}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{isArabic ? 'كلمة المرور' : 'Password'}</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('common.loading') : t('nav.login')}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {isArabic ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
                <Link to="/register" className="text-primary hover:underline">{t('nav.register')}</Link>
              </p>
              <p className="text-center text-xs text-muted-foreground mt-4 p-2 bg-muted rounded">
                {isArabic ? 'للدخول كمسؤول: admin@kawther.com' : 'Admin login: admin@kawther.com'}
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
