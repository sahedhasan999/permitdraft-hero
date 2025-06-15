
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Image, Link, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  value,
  onChange,
  label,
  placeholder = "Enter image URL or select from gallery"
}) => {
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(value);

  useEffect(() => {
    // Load portfolio images from the public folder
    const loadPortfolioImages = async () => {
      try {
        // This is a workaround to get images from public folder
        // In a real app, you'd have an API endpoint that lists the files
        const imageNames = [
          '01.jpg', '02.jpg', '03.png', '04.jpg', '05.jpg', '06.jpg',
          'Binder1_Page_04.jpg', 'Binder1_Page_06.jpg', 'Binder1_Page_07.jpg',
          'Binder1_Page_08.jpg', 'Binder1_Page_09.jpg', 'Binder1_Page_10.jpg',
          'Binder1_Page_11.jpg', 'Binder1_Page_12.jpg', 'Binder1_Page_13.jpg',
          'Binder1_Page_15.jpg', 'Binder1_Page_16.jpg', 'Binder1_Page_17.jpg',
          'Binder1_Page_18.jpg', 'Binder1_Page_20.jpg', 'Binder1_Page_23.jpg',
          'Binder1_Page_24.jpg', 'Binder1_Page_26.jpg', 'Binder1_Page_28.jpg',
          'Binder1_Page_30.jpg', 'Binder1_Page_35.jpg', 'Binder1_Page_38.jpg',
          'Binder1_Page_41.jpg', 'Binder1_Page_42.jpg', 'Binder1_Page_44.jpg',
          'Binder1_Page_45.jpg', 'Binder1_Page_49.jpg', 'Binder1_Page_50.jpg',
          'Binder1_Page_51.jpg', 'Binder1_Page_52.jpg', 'Binder1_Page_53.jpg',
          'Binder1_Page_54.jpg', 'Binder1_Page_57.jpg', 'Binder1_Page_58.jpg',
          'Binder1_Page_59.jpg', 'Binder1_Page_60.jpg'
        ];
        
        const imagePaths = imageNames.map(name => `/portfolioImages/${name}`);
        setPortfolioImages(imagePaths);
      } catch (error) {
        console.error('Error loading portfolio images:', error);
      }
    };

    loadPortfolioImages();
  }, []);

  const handleImageSelect = (imagePath: string) => {
    setSelectedImage(imagePath);
  };

  const handleConfirmSelection = () => {
    onChange(selectedImage);
    setIsDialogOpen(false);
  };

  const handleUrlChange = (url: string) => {
    setSelectedImage(url);
    onChange(url);
  };

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" type="button">
              <Image className="w-4 h-4 mr-2" />
              Gallery
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Select Image</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="gallery" className="w-full">
              <TabsList>
                <TabsTrigger value="gallery">Portfolio Gallery</TabsTrigger>
                <TabsTrigger value="url">Custom URL</TabsTrigger>
              </TabsList>
              
              <TabsContent value="gallery" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {portfolioImages.map((imagePath, index) => (
                    <div
                      key={index}
                      className={cn(
                        "relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all",
                        selectedImage === imagePath
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => handleImageSelect(imagePath)}
                    >
                      <img
                        src={imagePath}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                      {selectedImage === imagePath && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Check className="w-6 h-6 text-primary" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="url" className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="customUrl">Custom Image URL</Label>
                  <Input
                    id="customUrl"
                    value={selectedImage}
                    onChange={(e) => setSelectedImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                {selectedImage && (
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="max-w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmSelection}>
                Select Image
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {value && (
        <div className="border rounded-lg p-2">
          <img
            src={value}
            alt="Selected"
            className="max-w-full h-20 object-cover rounded"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};
