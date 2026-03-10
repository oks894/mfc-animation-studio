import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Store, Clock, Phone, Users, Key, Copy, Trash2, Plus, PackageCheck, Truck, Image, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AddAdminDialog from '@/components/admin/AddAdminDialog';
import TimeInput12hr from '@/components/ui/time-input-12hr';
import { useStoreSettings, useUpdateStoreSettings } from '@/hooks/useStoreSettings';
import { useImageUpload } from '@/hooks/useImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface ApiKey {
  id: string;
  key: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

const AdminSettings: React.FC = () => {
  const { data: settings, isLoading } = useStoreSettings();
  const updateSettings = useUpdateStoreSettings();
  const { uploadImage, isUploading } = useImageUpload();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [loadingKeys, setLoadingKeys] = useState(true);

  const [formData, setFormData] = useState({
    is_open: true,
    use_scheduled_hours: false,
    opening_time: '09:00',
    closing_time: '21:00',
    open_days: [0, 1, 2, 3, 4, 5, 6],
    upi_id: '',
    whatsapp_primary: '',
    whatsapp_secondary: '',
    packaging_fee: 60,
    base_delivery_fee: 100,
    per_km_delivery_fee: 50,
    customers_served: '2000+',
    years_running: '5+',
    average_rating: '4.8',
    menu_images: [] as string[],
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        is_open: settings.is_open,
        use_scheduled_hours: settings.use_scheduled_hours,
        opening_time: settings.opening_time,
        closing_time: settings.closing_time,
        open_days: settings.open_days,
        upi_id: settings.upi_id || '',
        whatsapp_primary: settings.whatsapp_primary || '',
        whatsapp_secondary: settings.whatsapp_secondary || '',
        packaging_fee: settings.packaging_fee ?? 60,
        base_delivery_fee: settings.base_delivery_fee ?? 100,
        per_km_delivery_fee: settings.per_km_delivery_fee ?? 50,
        customers_served: settings.customers_served || '2000+',
        years_running: settings.years_running || '5+',
        average_rating: settings.average_rating || '4.8',
        menu_images: settings.menu_images || [],
      });
    }
  }, [settings]);

  const fetchApiKeys = async () => {
    setLoadingKeys(true);
    const { data } = await supabase.from('api_keys').select('*').order('created_at', { ascending: false });
    setApiKeys((data as ApiKey[]) || []);
    setLoadingKeys(false);
  };

  useEffect(() => { fetchApiKeys(); }, []);

  const generateApiKey = async () => {
    if (!newKeyName.trim()) { toast.error('Enter a name for the API key'); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Not authenticated'); return; }
    const { error } = await supabase.from('api_keys').insert({ name: newKeyName.trim(), created_by: user.id });
    if (error) toast.error('Failed to create API key');
    else { toast.success('API key created!'); setNewKeyName(''); fetchApiKeys(); }
  };

  const revokeApiKey = async (id: string) => {
    await supabase.from('api_keys').update({ is_active: false }).eq('id', id);
    toast.success('Key revoked');
    fetchApiKeys();
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied!');
  };

  const handleDayToggle = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      open_days: prev.open_days.includes(dayIndex)
        ? prev.open_days.filter(d => d !== dayIndex)
        : [...prev.open_days, dayIndex].sort(),
    }));
  };

  const handleMenuImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (formData.menu_images.length + files.length > 4) {
      toast.error('Maximum 4 menu images allowed');
      return;
    }
    for (const file of Array.from(files)) {
      const url = await uploadImage(file);
      if (url) {
        setFormData(prev => ({ ...prev, menu_images: [...prev.menu_images, url] }));
      }
    }
  };

  const removeMenuImage = (index: number) => {
    setFormData(prev => ({ ...prev, menu_images: prev.menu_images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (settings) {
      await updateSettings.mutateAsync({ id: settings.id, ...formData });
    }
  };

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const apiBaseUrl = `https://${projectId}.supabase.co/functions/v1`;
  const apiEndpoint = `${apiBaseUrl}/orders-api`;

  if (isLoading) {
    return (
      <AdminSidebar>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold">Store Settings</h1>
          <p className="text-muted-foreground">Manage your store configuration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Store Status */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Store className="h-5 w-5" /> Store Status</CardTitle>
                <CardDescription>Control whether your store is open for orders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label htmlFor="is_open" className="text-base font-medium">Store is Open</Label>
                    <p className="text-sm text-muted-foreground">Toggle this to open or close your store</p>
                  </div>
                  <Switch id="is_open" checked={formData.is_open} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_open: checked }))} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label htmlFor="use_scheduled" className="text-base font-medium">Use Scheduled Hours</Label>
                    <p className="text-sm text-muted-foreground">Automatically open/close based on schedule</p>
                  </div>
                  <Switch id="use_scheduled" checked={formData.use_scheduled_hours} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, use_scheduled_hours: checked }))} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Operating Hours */}
          {formData.use_scheduled_hours && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Operating Hours</CardTitle>
                  <CardDescription>Set your store's opening hours</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="mb-2 block">Opening Time</Label>
                      <TimeInput12hr id="opening_time" value={formData.opening_time} onChange={(val) => setFormData(prev => ({ ...prev, opening_time: val }))} />
                    </div>
                    <div>
                      <Label className="mb-2 block">Closing Time</Label>
                      <TimeInput12hr id="closing_time" value={formData.closing_time} onChange={(val) => setFormData(prev => ({ ...prev, closing_time: val }))} />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-3 block">Open Days</Label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {dayNames.map((day, index) => (
                        <div key={day} className="flex items-center space-x-2 rounded-lg border p-3">
                          <Checkbox id={`day-${index}`} checked={formData.open_days.includes(index)} onCheckedChange={() => handleDayToggle(index)} />
                          <Label htmlFor={`day-${index}`} className="text-sm cursor-pointer">{day}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Fees Management */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><PackageCheck className="h-5 w-5" /> Fees Management</CardTitle>
                <CardDescription>Configure packaging and delivery fees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="packaging_fee">Packaging Fee (₹)</Label>
                    <Input id="packaging_fee" type="number" value={formData.packaging_fee} onChange={(e) => setFormData(prev => ({ ...prev, packaging_fee: Number(e.target.value) }))} />
                  </div>
                  <div>
                    <Label htmlFor="base_delivery_fee">Base Delivery Fee (₹)</Label>
                    <Input id="base_delivery_fee" type="number" value={formData.base_delivery_fee} onChange={(e) => setFormData(prev => ({ ...prev, base_delivery_fee: Number(e.target.value) }))} />
                  </div>
                  <div>
                    <Label htmlFor="per_km_delivery_fee">Per KM Fee (₹)</Label>
                    <Input id="per_km_delivery_fee" type="number" value={formData.per_km_delivery_fee} onChange={(e) => setFormData(prev => ({ ...prev, per_km_delivery_fee: Number(e.target.value) }))} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">These fees will be applied during checkout</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Homepage Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5" /> Homepage Stats</CardTitle>
                <CardDescription>Customize stats shown on the homepage and footer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="customers_served">Customers Served</Label>
                    <Input id="customers_served" value={formData.customers_served} onChange={(e) => setFormData(prev => ({ ...prev, customers_served: e.target.value }))} placeholder="2000+" />
                  </div>
                  <div>
                    <Label htmlFor="years_running">Years Running</Label>
                    <Input id="years_running" value={formData.years_running} onChange={(e) => setFormData(prev => ({ ...prev, years_running: e.target.value }))} placeholder="5+" />
                  </div>
                  <div>
                    <Label htmlFor="average_rating">Average Rating</Label>
                    <Input id="average_rating" value={formData.average_rating} onChange={(e) => setFormData(prev => ({ ...prev, average_rating: e.target.value }))} placeholder="4.8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Menu Images */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Image className="h-5 w-5" /> Menu Images</CardTitle>
                <CardDescription>Upload up to 4 menu images for the homepage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {formData.menu_images.map((img, index) => (
                    <div key={index} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-border">
                      <img src={img} alt={`Menu ${index + 1}`} className="w-full h-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeMenuImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {formData.menu_images.length < 4 && (
                    <label className="aspect-[3/4] rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">{isUploading ? 'Uploading...' : 'Upload'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleMenuImageUpload} disabled={isUploading} />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact & Payment */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5" /> Contact & Payment</CardTitle>
                <CardDescription>Configure contact and payment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="whatsapp_primary">Primary WhatsApp</Label>
                    <Input id="whatsapp_primary" value={formData.whatsapp_primary} onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_primary: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp_secondary">Secondary WhatsApp</Label>
                    <Input id="whatsapp_secondary" value={formData.whatsapp_secondary} onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_secondary: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="upi_id">UPI ID (for GPay)</Label>
                  <Input id="upi_id" value={formData.upi_id} onChange={(e) => setFormData(prev => ({ ...prev, upi_id: e.target.value }))} placeholder="yourname@upi" />
                  <p className="text-xs text-muted-foreground mt-1">Customers will see this for GPay payments</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* API Keys */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5" /> Delivery API Keys</CardTitle>
                <CardDescription>Generate API keys for delivery agent apps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-muted text-xs text-muted-foreground space-y-2">
                  <div>
                    <p className="font-medium text-foreground mb-1">API Base URL:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 break-all">{apiBaseUrl}</code>
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => { navigator.clipboard.writeText(apiBaseUrl); toast.success('Base URL copied!'); }}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Orders Endpoint:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 break-all">{apiEndpoint}</code>
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => { navigator.clipboard.writeText(apiEndpoint); toast.success('Endpoint copied!'); }}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <p className="mt-1">Use header: <code>Authorization: Bearer YOUR_API_KEY</code></p>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Key name (e.g. Dropee App)" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} />
                  <Button type="button" onClick={generateApiKey} size="sm"><Plus className="h-4 w-4 mr-1" /> Generate</Button>
                </div>
                {loadingKeys ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : apiKeys.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No API keys yet</p>
                ) : (
                  <div className="space-y-2">
                    {apiKeys.map((k) => (
                      <div key={k.id} className="flex items-center gap-2 p-3 rounded-lg border text-sm">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{k.name}</p>
                          <code className="text-xs text-muted-foreground break-all">{k.key}</code>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => copyKey(k.key)}>
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        {k.is_active && (
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-destructive" onClick={() => revokeApiKey(k.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {!k.is_active && <span className="text-xs text-destructive">Revoked</span>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Admin Management */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Admin Management</CardTitle>
                <CardDescription>Add new administrators to the dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <AddAdminDialog />
                <p className="text-xs text-muted-foreground mt-3">New admins will be able to log in immediately after creation</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={updateSettings.isPending} size="lg">
              <Save className="mr-2 h-4 w-4" />
              {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </div>
    </AdminSidebar>
  );
};

export default AdminSettings;
