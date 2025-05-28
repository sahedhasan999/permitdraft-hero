
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, MoveUp, MoveDown, Eye, X, ImagePlus } from 'lucide-react';
import { usePortfolio, PortfolioItem } from '@/contexts/PortfolioContext';
import { useToast } from '@/hooks/use-toast';

// Available images from portfolioImages folder
const availableImages = [
  '/portfolioImages/01.jpg',
  '/portfolioImages/02.jpg',
  '/portfolioImages/03.png',
  '/portfolioImages/04.jpg',
  '/portfolioImages/05.jpg',
  '/portfolioImages/06.jpg',
  '/portfolioImages/Binder1_Page_04.jpg',
  '/portfolioImages/Binder1_Page_06.jpg',
  '/portfolioImages/Binder1_Page_07.jpg',
  '/portfolioImages/Binder1_Page_08.jpg',
  '/portfolioImages/Binder1_Page_09.jpg',
  '/portfolioImages/Binder1_Page_10.jpg',
  '/portfolioImages/Binder1_Page_11.jpg',
  '/portfolioImages/Binder1_Page_12.jpg',
  '/portfolioImages/Binder1_Page_13.jpg',
  '/portfolioImages/Binder1_Page_15.jpg',
  '/portfolioImages/Binder1_Page_16.jpg',
  '/portfolioImages/Binder1_Page_17.jpg',
  '/portfolioImages/Binder1_Page_18.jpg',
  '/portfolioImages/Binder1_Page_20.jpg',
  '/portfolioImages/Binder1_Page_23.jpg',
  '/portfolioImages/Binder1_Page_24.jpg',
  '/portfolioImages/Binder1_Page_26.jpg',
  '/portfolioImages/Binder1_Page_28.jpg',
  '/portfolioImages/Binder1_Page_30.jpg',
  '/portfolioImages/Binder1_Page_35.jpg',
  '/portfolioImages/Binder1_Page_38.jpg',
  '/portfolioImages/Binder1_Page_41.jpg',
  '/portfolioImages/Binder1_Page_42.jpg',
  '/portfolioImages/Binder1_Page_44.jpg',
  '/portfolioImages/Binder1_Page_45.jpg',
  '/portfolioImages/Binder1_Page_49.jpg',
  '/portfolioImages/Binder1_Page_50.jpg',
  '/portfolioImages/Binder1_Page_51.jpg',
  '/portfolioImages/Binder1_Page_52.jpg',
  '/portfolioImages/Binder1_Page_53.jpg',
  '/portfolioImages/Binder1_Page_54.jpg',
  '/portfolioImages/Binder1_Page_57.jpg',
  '/portfolioImages/Binder1_Page_58.jpg',
  '/portfolioImages/Binder1_Page_59.jpg',
  '/portfolioImages/Binder1_Page_60.jpg'
];

const categories = ['Deck', 'Patio', 'Pergola', 'Outdoor Kitchen', 'Home Addition/ADU'];

export const PortfolioManager: React.FC = () => {
  const { portfolioItems, setPortfolioItems } = usePortfolio();
  const [currentItem, setCurrentItem] = useState<Partial<PortfolioItem> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  const sortedItems = [...portfolioItems].sort((a, b) => a.order - b.order);
  const activeItems = sortedItems.filter(item => item.active);

  const handleAddItem = () => {
    setCurrentItem({
      id: `portfolio-${Date.now()}`,
      title: '',
      category: 'Deck',
      description: '',
      images: [availableImages[0]],
      active: true,
      order: portfolioItems.length + 1
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: PortfolioItem) => {
    setCurrentItem({ ...item });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeletePrompt = (item: PortfolioItem) => {
    setCurrentItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteItem = () => {
    if (!currentItem) return;
    setPortfolioItems(prev => prev.filter(item => item.id !== currentItem.id));
    setIsDeleteDialogOpen(false);
    toast({
      title: "Portfolio item deleted",
      description: "The portfolio item has been removed",
    });
  };

  const handleSaveItem = () => {
    if (!currentItem || !currentItem.title || !currentItem.description) return;

    if (isEditing) {
      setPortfolioItems(prev => 
        prev.map(item => item.id === currentItem.id ? currentItem as PortfolioItem : item)
      );
      toast({
        title: "Portfolio item updated",
        description: "Your changes have been saved",
      });
    } else {
      setPortfolioItems(prev => [...prev, currentItem as PortfolioItem]);
      toast({
        title: "Portfolio item added",
        description: "New portfolio item has been added",
      });
    }
    setIsDialogOpen(false);
  };

  const handleMoveItem = (id: string, direction: 'up' | 'down') => {
    const currentIndex = sortedItems.findIndex(item => item.id === id);
    if ((direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === sortedItems.length - 1)) {
      return;
    }

    const newItems = [...sortedItems];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    [newItems[currentIndex], newItems[newIndex]] = [newItems[newIndex], newItems[currentIndex]];
    
    // Update order values
    newItems.forEach((item, index) => {
      item.order = index + 1;
    });
    
    setPortfolioItems(newItems);
  };

  const handleToggleActive = (id: string) => {
    setPortfolioItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          return { ...item, active: !item.active };
        }
        return item;
      })
    );
    
    const item = portfolioItems.find(item => item.id === id);
    if (item) {
      toast({
        title: item.active ? "Item hidden" : "Item shown",
        description: `The portfolio item has been ${item.active ? "hidden from" : "made visible in"} the portfolio`,
      });
    }
  };

  const addImageToItem = () => {
    if (!currentItem) return;
    const unusedImages = availableImages.filter(img => !currentItem.images?.includes(img));
    if (unusedImages.length > 0) {
      setCurrentItem({
        ...currentItem,
        images: [...(currentItem.images || []), unusedImages[0]]
      });
    }
  };

  const removeImageFromItem = (index: number) => {
    if (!currentItem || !currentItem.images) return;
    const newImages = currentItem.images.filter((_, i) => i !== index);
    if (newImages.length === 0) {
      toast({
        title: "Cannot remove last image",
        description: "Portfolio items must have at least one image",
        variant: "destructive"
      });
      return;
    }
    setCurrentItem({
      ...currentItem,
      images: newImages
    });
  };

  const updateImageInItem = (index: number, newImage: string) => {
    if (!currentItem || !currentItem.images) return;
    const newImages = [...currentItem.images];
    newImages[index] = newImage;
    setCurrentItem({
      ...currentItem,
      images: newImages
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Portfolio Management</h3>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Exit Preview' : 'Preview'}
          </Button>
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {previewMode ? (
        <div className="border rounded-lg p-6 bg-muted/20">
          <h4 className="text-lg font-medium mb-4">Portfolio Preview</h4>
          {activeItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="h-48 overflow-hidden relative">
                    {item.images && item.images.length > 0 ? (
                      <img 
                        src={item.images[0]} 
                        alt={item.title}
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No image available</span>
                      </div>
                    )}
                    {item.images && item.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        +{item.images.length - 1} more
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-teal-100 text-teal-800 rounded-full mb-2">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No active portfolio items to display</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item, index) => (
            <Card key={item.id} className={!item.active ? 'opacity-60' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{item.title}</span>
                  {!item.active && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      Hidden
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{item.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted mb-2 relative">
                  {item.images && item.images.length > 0 ? (
                    <img 
                      src={item.images[0]} 
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                  {item.images && item.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {item.images.length} images
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => handleMoveItem(item.id, 'up')} disabled={index === 0}>
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleMoveItem(item.id, 'down')} disabled={index === sortedItems.length - 1}>
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleEditItem(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive/90" onClick={() => handleDeletePrompt(item)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  size="sm" 
                  variant={item.active ? "ghost" : "outline"}
                  onClick={() => handleToggleActive(item.id)}
                >
                  {item.active ? 'Hide' : 'Show'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit/Add Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update portfolio item details below.' : 'Enter the details for the new portfolio item.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={currentItem?.title || ''} 
                onChange={(e) => setCurrentItem({...currentItem, title: e.target.value})}
                placeholder="Enter portfolio item title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={currentItem?.category || 'Deck'} onValueChange={(value) => setCurrentItem({...currentItem, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Images</Label>
              <div className="space-y-2">
                {currentItem?.images?.map((image, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                    <img src={image} alt={`Preview ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                    <Select value={image} onValueChange={(value) => updateImageInItem(index, value)}>
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableImages.map((img) => (
                          <SelectItem key={img} value={img}>
                            {img.split('/').pop()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => removeImageFromItem(index)}
                      disabled={(currentItem?.images?.length || 0) <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addImageToItem} className="w-full">
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={currentItem?.description || ''} 
                onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
                placeholder="Enter portfolio item description"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={currentItem?.active}
                onCheckedChange={(checked) => 
                  setCurrentItem({...currentItem, active: checked})
                }
              />
              <Label htmlFor="active">Active (visible in portfolio)</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveItem} disabled={!currentItem?.title || !currentItem?.description}>
              {isEditing ? 'Update' : 'Add'} Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Portfolio Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this portfolio item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 aspect-[4/3] rounded overflow-hidden bg-muted">
            {currentItem?.images && currentItem.images.length > 0 ? (
              <img 
                src={currentItem.images[0]} 
                alt="To be deleted" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteItem}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
