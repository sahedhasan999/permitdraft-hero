
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Plus, Edit, Trash2, Loader2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Testimonial, getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial, updateTestimonialOrder } from '@/services/testimonialsService';
import { ImageSelector } from '../shared/ImageSelector';

export const TestimonialsManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    content: '',
    rating: 5,
    active: true,
    order: 0,
    profileImage: ''
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setIsLoading(true);
      const data = await getTestimonials();
      setTestimonials(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (error) {
      toast.error('Failed to load testimonials');
    } finally {
      setIsLoading(false);
    }
  };

  const openDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        location: testimonial.location,
        content: testimonial.content,
        rating: testimonial.rating,
        active: testimonial.active,
        order: testimonial.order || 0,
        profileImage: testimonial.profileImage || ''
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: '',
        location: '',
        content: '',
        rating: 5,
        active: true,
        order: testimonials.length,
        profileImage: ''
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTestimonial(null);
    setFormData({
      name: '',
      location: '',
      content: '',
      rating: 5,
      active: true,
      order: 0,
      profileImage: ''
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.location || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, formData);
        toast.success('Testimonial updated successfully');
      } else {
        await addTestimonial(formData);
        toast.success('Testimonial added successfully');
      }
      
      await loadTestimonials();
      closeDialog();
    } catch (error) {
      toast.error('Failed to save testimonial');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await deleteTestimonial(id);
      toast.success('Testimonial deleted successfully');
      loadTestimonials();
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  };

  const handleToggleActive = async (testimonial: Testimonial) => {
    try {
      await updateTestimonial(testimonial.id, { ...testimonial, active: !testimonial.active });
      toast.success('Testimonial status updated');
      loadTestimonials();
    } catch (error) {
      toast.error('Failed to update testimonial status');
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(testimonials);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order values
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setTestimonials(updatedItems);

    try {
      await updateTestimonialOrder(reorderedItem.id, result.destination.index);
      toast.success('Testimonial order updated');
    } catch (error) {
      toast.error('Failed to update testimonial order');
      loadTestimonials(); // Reload to revert changes if failed
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Testimonials Management</h2>
          <p className="text-muted-foreground">Manage customer testimonials and reviews</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </DialogTitle>
              <DialogDescription>
                {editingTestimonial 
                  ? 'Update the testimonial details below.' 
                  : 'Enter the details for the new testimonial.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Customer Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. New York, NY"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content">Testimonial Content *</Label>
                <Textarea
                  id="content"
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter the testimonial content..."
                />
              </div>
              
              <ImageSelector
                value={formData.profileImage}
                onChange={(profileImage) => setFormData({ ...formData, profileImage })}
                label="Profile Image (Optional)"
                placeholder="Select profile image from gallery or enter URL"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                      className="w-20"
                    />
                    <div className="flex">
                      {renderStars(formData.rating)}
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    placeholder="Display order"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(active) => setFormData({ ...formData, active })}
                />
                <Label htmlFor="active">Active (visible on website)</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="testimonials">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid gap-4"
            >
              {testimonials.map((testimonial, index) => (
                <Draggable key={testimonial.id} draggableId={testimonial.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "transition-shadow",
                        snapshot.isDragging && "shadow-lg"
                      )}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="w-5 h-5 text-gray-500 cursor-grab" />
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-teal-100 rounded-full w-8 h-8 flex items-center justify-center">
                                <span className="text-teal-600 font-semibold text-xs">
                                  {testimonial.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <CardTitle className="text-base">{testimonial.name}</CardTitle>
                                <CardDescription className="text-sm">{testimonial.location}</CardDescription>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={testimonial.active ? "default" : "secondary"}>
                              {testimonial.active ? "Active" : "Inactive"}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {renderStars(testimonial.rating)}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <blockquote className="text-sm text-muted-foreground mb-4 italic">
                          "{testimonial.content}"
                        </blockquote>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            Order: {testimonial.order || 0}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleActive(testimonial)}
                            >
                              {testimonial.active ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDialog(testimonial)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(testimonial.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {testimonials.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Star className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No testimonials yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start building trust with your customers by adding testimonials
            </p>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Testimonial
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
