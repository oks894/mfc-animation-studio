import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { usePromotions, useCreatePromotion, useUpdatePromotion, useDeletePromotion } from '@/hooks/usePromotions';
import { useProducts } from '@/hooks/useProducts';
import { Promotion } from '@/types/database';

const AdminPromotions: React.FC = () => {
  const { data: promotions, isLoading } = usePromotions();
  const { data: products } = useProducts();
  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();
  const deletePromotion = useDeletePromotion();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_percentage: '',
    is_active: true,
    applies_to_all: true,
    product_ids: [] as string[],
    valid_from: '',
    valid_until: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      discount_percentage: '',
      is_active: true,
      applies_to_all: true,
      product_ids: [],
      valid_from: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      valid_until: '',
    });
    setSelectedPromotion(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (promo: Promotion) => {
    setSelectedPromotion(promo);
    setFormData({
      title: promo.title,
      description: promo.description || '',
      discount_percentage: promo.discount_percentage.toString(),
      is_active: promo.is_active,
      applies_to_all: promo.applies_to_all,
      product_ids: promo.product_ids || [],
      valid_from: promo.valid_from ? format(new Date(promo.valid_from), "yyyy-MM-dd'T'HH:mm") : '',
      valid_until: promo.valid_until ? format(new Date(promo.valid_until), "yyyy-MM-dd'T'HH:mm") : '',
    });
    setIsDialogOpen(true);
  };

  const toggleProductSelection = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      product_ids: prev.product_ids.includes(productId)
        ? prev.product_ids.filter(id => id !== productId)
        : [...prev.product_ids, productId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const promoData = {
      title: formData.title,
      description: formData.description || null,
      discount_percentage: parseInt(formData.discount_percentage) || 0,
      is_active: formData.is_active,
      applies_to_all: formData.applies_to_all,
      product_ids: formData.applies_to_all ? [] : formData.product_ids,
      banner_image: null,
      valid_from: formData.valid_from ? new Date(formData.valid_from).toISOString() : new Date().toISOString(),
      valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null,
    };

    if (selectedPromotion) {
      await updatePromotion.mutateAsync({ id: selectedPromotion.id, ...promoData });
    } else {
      await createPromotion.mutateAsync(promoData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async () => {
    if (selectedPromotion) {
      await deletePromotion.mutateAsync(selectedPromotion.id);
      setDeleteDialogOpen(false);
      setSelectedPromotion(null);
    }
  };

  const toggleActive = async (promo: Promotion) => {
    await updatePromotion.mutateAsync({ id: promo.id, is_active: !promo.is_active });
  };

  return (
    <AdminSidebar>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Promotions</h1>
            <p className="text-muted-foreground">Manage discounts and offers</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Promotion
          </Button>
        </div>

        {/* Promotions List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {promotions?.map((promo, index) => (
              <motion.div
                key={promo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={promo.is_active ? '' : 'opacity-60'}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{promo.title}</CardTitle>
                      <Badge variant={promo.is_active ? "default" : "secondary"}>
                        {promo.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {promo.description && (
                      <p className="text-sm text-muted-foreground">{promo.description}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        {promo.discount_percentage}% OFF
                      </span>
                      <Badge variant="outline">
                        {promo.applies_to_all ? 'All Products' : 'Selected'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {format(new Date(promo.valid_from), 'MMM d, yyyy')}
                        {promo.valid_until && ` - ${format(new Date(promo.valid_until), 'MMM d, yyyy')}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={promo.is_active}
                          onCheckedChange={() => toggleActive(promo)}
                        />
                        <span className="text-sm">Active</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(promo)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setSelectedPromotion(promo);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {(!promotions || promotions.length === 0) && !isLoading && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🏷️</div>
            <h3 className="text-lg font-semibold">No promotions yet</h3>
            <p className="text-muted-foreground">Create your first promotion to attract customers</p>
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedPromotion ? 'Edit Promotion' : 'Create Promotion'}</DialogTitle>
              <DialogDescription>
                {selectedPromotion ? 'Update promotion details' : 'Create a new discount or offer'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Weekend Special"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the promotion..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="discount">Discount Percentage *</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: e.target.value }))}
                  placeholder="10"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="valid_from">Valid From</Label>
                  <Input
                    id="valid_from"
                    type="datetime-local"
                    value={formData.valid_from}
                    onChange={(e) => setFormData(prev => ({ ...prev, valid_from: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="valid_until">Valid Until (Optional)</Label>
                  <Input
                    id="valid_until"
                    type="datetime-local"
                    value={formData.valid_until}
                    onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="applies_to_all">Apply to All Products</Label>
                  <p className="text-sm text-muted-foreground">Discount applies site-wide</p>
                </div>
                <Switch
                  id="applies_to_all"
                  checked={formData.applies_to_all}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, applies_to_all: checked }))}
                />
              </div>

              {/* Product Selection (when not applies_to_all) */}
              {!formData.applies_to_all && (
                <div className="rounded-lg border p-4">
                  <Label className="mb-3 block">Select Products</Label>
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {products?.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted/50"
                        >
                          <Checkbox
                            id={`product-${product.id}`}
                            checked={formData.product_ids.includes(product.id)}
                            onCheckedChange={() => toggleProductSelection(product.id)}
                          />
                          <Label
                            htmlFor={`product-${product.id}`}
                            className="flex-1 cursor-pointer text-sm"
                          >
                            {product.name}
                            <span className="ml-2 text-muted-foreground">₹{product.price}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  {formData.product_ids.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {formData.product_ids.length} product(s) selected
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="is_active">Active</Label>
                  <p className="text-sm text-muted-foreground">Show this promotion to customers</p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createPromotion.isPending || updatePromotion.isPending}>
                  {selectedPromotion ? 'Update Promotion' : 'Create Promotion'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Promotion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedPromotion?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminSidebar>
  );
};

export default AdminPromotions;
