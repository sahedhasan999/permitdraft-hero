import React, { useState, useEffect } from 'react';
import { CarouselImage, getCarouselImages, addCarouselImage, updateCarouselImage, deleteCarouselImage, updateCarouselImageOrder } from '@/services/carouselService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'sonner';
import { Loader2, GripVertical, Trash2, Plus } from 'lucide-react';

export const CarouselManager: React.FC = () => {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newImage, setNewImage] = useState<Partial<CarouselImage>>({
    src: '',
    alt: '',
    caption: '',
    active: true,
    displayOrder: 0
  });

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const fetchedImages = await getCarouselImages();
      setImages(fetchedImages);
    } catch (error) {
      toast.error('Failed to load carousel images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImage = async () => {
    console.log('[CarouselManager] handleAddImage called. newImage data:', newImage); // Added log
    if (!newImage.src || !newImage.alt || !newImage.caption) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const newOrder = images.length;
      const imageToAdd = {
        ...newImage,
        displayOrder: newOrder
      } as Omit<CarouselImage, 'id'>;

      await addCarouselImage(imageToAdd);
      toast.success('Image added successfully');
      setNewImage({
        src: '',
        alt: '',
        caption: '',
        active: true,
        displayOrder: 0
      });
      loadImages();
    } catch (error) {
      console.error('[CarouselManager] Error in handleAddImage:', error); // Log the full error
      toast.error('Failed to add image. Check console for details.'); // Modified toast
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await updateCarouselImage(id, { active: !currentActive });
      toast.success('Image status updated');
      loadImages();
    } catch (error) {
      toast.error('Failed to update image status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await deleteCarouselImage(id);
      toast.success('Image deleted successfully');
      loadImages();
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);

    try {
      await updateCarouselImageOrder(reorderedItem.id, result.destination.index);
      toast.success('Image order updated');
    } catch (error) {
      toast.error('Failed to update image order');
      loadImages(); // Reload to revert changes if failed
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">Add New Image</h3>
        <div className="grid gap-2">
          <Label htmlFor="src">Image URL</Label>
          <Input
            id="src"
            value={newImage.src}
            onChange={(e) => setNewImage({ ...newImage, src: e.target.value })}
            placeholder="Enter image URL"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="alt">Alt Text</Label>
          <Input
            id="alt"
            value={newImage.alt}
            onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
            placeholder="Enter alt text"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="caption">Caption</Label>
          <Input
            id="caption"
            value={newImage.caption}
            onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
            placeholder="Enter caption"
          />
        </div>
        <Button onClick={handleAddImage} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="carousel-images">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {images.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <div {...provided.dragHandleProps}>
                        <GripVertical className="w-5 h-5 text-gray-500" />
                      </div>
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{image.alt}</p>
                        <p className="text-sm text-gray-500">{image.caption}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={image.active}
                            onCheckedChange={() => handleToggleActive(image.id, image.active)}
                          />
                          <Label>Active</Label>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(image.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}; 