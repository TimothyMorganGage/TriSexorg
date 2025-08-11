import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePWA } from '@/hooks/usePWA';
import { Download, Smartphone, X, Wifi, WifiOff } from 'lucide-react';

export function PWAInstallPrompt() {
  const { isInstallable, isInstalled, isOnline, installApp } = usePWA();
  const [isVisible, setIsVisible] = useState(true);

  if (!isInstallable || isInstalled || !isVisible) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setIsVisible(false);
    }
  };

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 shadow-lg border-primary/20 md:max-w-sm md:right-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-lg">⚧️</span>
            </div>
            <div>
              <CardTitle className="text-sm">Install TriSex.org</CardTitle>
              <CardDescription className="text-xs">Add to your home screen</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {isOnline ? (
              <Wifi className="h-3 w-3 text-green-500" />
            ) : (
              <WifiOff className="h-3 w-3 text-red-500" />
            )}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">
                <Smartphone className="h-3 w-3 mr-1" />
                Works offline
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Fast loading
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Push notifications
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Get quick access to age verification, materials science, and cooperative matchmaking features.
            </p>
          </div>
          
          <Button 
            onClick={handleInstall}
            className="w-full"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Install App
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function PWAStatusBadge() {
  const { isInstalled, isOnline } = usePWA();

  if (!isInstalled) return null;

  return (
    <Badge 
      variant={isOnline ? "default" : "destructive"} 
      className="fixed top-4 right-4 z-40"
    >
      {isOnline ? (
        <Wifi className="h-3 w-3 mr-1" />
      ) : (
        <WifiOff className="h-3 w-3 mr-1" />
      )}
      {isOnline ? 'Online' : 'Offline'}
    </Badge>
  );
}