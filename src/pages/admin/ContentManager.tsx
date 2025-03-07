
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImagePlus, Image, Trash2, MoveUp, MoveDown, Eye, Plus, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ImageCarousel } from '@/components/ui/ImageCarousel';

const initialCarouselImages = [
  {
    id: 'img-1',
    src: '/lovable-uploads/66619c27-f30e-4e6c-b1c7-0f5ad695cee0.png',
    alt: 'Modern deck design',
    caption: 'Modern deck with built-in lighting',
    active: true
  },
  {
    id: 'img-2',
    src: '/lovable-uploads/dd2d3de4-09ef-4eb5-a833-36fb407ca0ad.png',
    alt: 'Wooden deck with pergola',
    caption: 'Wooden deck with overhead pergola',
    active: true
  },
  {
    id: 'img-3',
    src: '/lovable-uploads/741fe312-9ad4-4de6-833f-cb39ab80875c.png',
    alt: 'Custom patio design',
    caption: 'Custom stone patio with firepit',
    active: true
  },
  {
    id: 'img-4',
    src: '/lovable-uploads/3a843a1c-f661-483d-8811-7db962bc1ae3.png',
    alt: 'Elevated deck with railing',
    caption: 'Elevated deck with glass railing',
    active: true
  },
  {
    id: 'img-5',
    src: '/lovable-uploads/9f01866a-b5d5-4500-b848-661b05f806fc.png',
    alt: 'Outdoor kitchen area',
    caption: 'Luxury outdoor kitchen and dining area',
    active: true
  },
  {
    id: 'img-6',
    src: '/lovable-uploads/6f8495a1-edcb-490a-96bd-74de3ccd30ab.png',
    alt: 'Backyard transformation',
    caption: 'Complete backyard transformation',
    active: true
  },
  {
    id: 'img-7',
    src: '/lovable-uploads/12407047-f591-4871-b433-89be31d5efd4.png',
    alt: 'Multi-level deck',
    caption: 'Multi-level deck with integrated planters',
    active: true
  },
  {
    id: 'img-8',
    src: '/lovable-uploads/2f66816d-eb2c-415b-97e2-3a4797161b8d.png',
    alt: 'Covered patio design',
    caption: 'Covered patio with outdoor living room',
    active: true
  },
  {
    id: 'img-9',
    src: '/lovable-uploads/bcbbc964-b88c-4788-98b5-67f72c5652c5.png',
    alt: 'Modern deck with scenery',
    caption: 'Modern deck with mountain views',
    active: true
  }
];

const ContentManager = () => {
  const [carouselImages, setCarouselImages] = useState(initialCarouselImages);
  const [currentImage, setCurrentImage] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const activeImages = carouselImages.filter(img => img.active).map(img => img.src);

  const handleAddImage = () => {
    setCurrentImage({
      id: `img-${Date.now()}`,
      src: '',
      alt: '',
      caption: '',
      active: true
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditImage = (image: any) => {
    setCurrentImage({ ...image });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeletePrompt = (image: any) => {
    setCurrentImage(image);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteImage = () => {
    setCarouselImages(carouselImages.filter(img => img.id !== currentImage.id));
    setIsDeleteDialogOpen(false);
  };

  const handleSaveImage = () => {
    if (isEditing) {
      setCarouselImages(carouselImages.map(img => img.id === currentImage.id ? currentImage : img));
    } else {
      setCarouselImages([...carouselImages, currentImage]);
    }
    setIsDialogOpen(false);
  };

  const handleMoveImage = (id: string, direction: 'up' | 'down') => {
    const currentIndex = carouselImages.findIndex(img => img.id === id);
    if ((direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === carouselImages.length - 1)) {
      return;
    }

    const newImages = [...carouselImages];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    [newImages[currentIndex], newImages[newIndex]] = [newImages[newIndex], newImages[currentIndex]];
    
    setCarouselImages(newImages);
  };

  const handleToggleActive = (id: string) => {
    setCarouselImages(carouselImages.map(img => {
      if (img.id === id) {
        return { ...img, active: !img.active };
      }
      return img;
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage website content and images
            </p>
          </div>
        </div>

        <Tabs defaultValue="hero-carousel" className="w-full">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="hero-carousel">Hero Carousel</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hero-carousel" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Hero Carousel Images</h2>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                  <Eye className="h-4 w-4 mr-2" />
                  {previewMode ? 'Exit Preview' : 'Preview'}
                </Button>
                <Button onClick={handleAddImage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div>
            </div>

            {previewMode ? (
              <div className="border rounded-lg p-6 bg-muted/20">
                <h3 className="text-lg font-medium mb-4">Carousel Preview</h3>
                {activeImages.length > 0 ? (
                  <div className="max-w-3xl mx-auto aspect-[4/3]">
                    <ImageCarousel images={activeImages} interval={3000} className="aspect-[4/3]" />
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <Image className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <p className="mt-4 text-muted-foreground">No active images to display</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {carouselImages.map((image, index) => (
                  <Card key={image.id} className={!image.active ? 'opacity-60' : ''}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        Image {index + 1}
                        {!image.active && (
                          <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                            Hidden
                          </span>
                        )}
                      </CardTitle>
                      {image.caption && (
                        <CardDescription>{image.caption}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted">
                        {image.src ? (
                          <img 
                            src={image.src} 
                            alt={image.alt || `Carousel image ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImagePlus className="h-12 w-12 text-muted-foreground opacity-50" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => handleMoveImage(image.id, 'up')} disabled={index === 0}>
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleMoveImage(image.id, 'down')} disabled={index === carouselImages.length - 1}>
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEditImage(image)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive/90" onClick={() => handleDeletePrompt(image)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        size="sm" 
                        variant={image.active ? "ghost" : "outline"}
                        onClick={() => handleToggleActive(image.id)}
                      >
                        {image.active ? 'Hide' : 'Show'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}

                {/* Add Image Card */}
                <Card className="border-dashed border-2 bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer" onClick={handleAddImage}>
                  <CardContent className="flex flex-col items-center justify-center h-full py-12">
                    <ImagePlus className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-medium">Add New Image</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="testimonials" className="pt-4">
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground">Testimonials management coming soon</p>
            </div>
          </TabsContent>
          
          <TabsContent value="portfolio" className="pt-4">
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground">Portfolio management coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit/Add Image Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Image' : 'Add New Image'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update image details below.' : 'Enter the details for the new image.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input 
                id="imageUrl" 
                value={currentImage?.src || ''} 
                onChange={(e) => setCurrentImage({...currentImage, src: e.target.value})}
                placeholder="Enter image URL"
              />
              {currentImage?.src && (
                <div className="mt-2 aspect-[4/3] rounded overflow-hidden bg-muted">
                  <img 
                    src={currentImage.src} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlZWVlIiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="altText">Alternative Text</Label>
              <Input 
                id="altText" 
                value={currentImage?.alt || ''} 
                onChange={(e) => setCurrentImage({...currentImage, alt: e.target.value})}
                placeholder="Describe the image for accessibility"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="caption">Caption (optional)</Label>
              <Textarea 
                id="caption" 
                value={currentImage?.caption || ''} 
                onChange={(e) => setCurrentImage({...currentImage, caption: e.target.value})}
                placeholder="Add a caption to display with the image"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={currentImage?.active}
                onCheckedChange={(checked) => 
                  setCurrentImage({...currentImage, active: checked})
                }
              />
              <Label htmlFor="active">Active (visible in carousel)</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveImage} disabled={!currentImage?.src}>
              {isEditing ? 'Update' : 'Add'} Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 aspect-[4/3] rounded overflow-hidden bg-muted">
            <img 
              src={currentImage?.src} 
              alt="To be deleted" 
              className="w-full h-full object-cover"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteImage}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ContentManager;
