
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, MoveUp, MoveDown, Eye, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Testimonial, 
  getTestimonials, 
  addTestimonial, 
  updateTestimonial, 
  deleteTestimonial,
  subscribeToTestimonials 
} from '@/services/testimonialsService';

export const TestimonialsManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeToTestimonials((items) => {
      setTestimonials(items);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const sortedTestimonials = [...testimonials].sort((a, b) => a.order - b.order);
  const activeTestimonials = sortedTestimonials.filter(item => item.active);

  const handleAddTestimonial = () => {
    setCurrentTestimonial({
      name: '',
      role: '',
      company: '',
      content: '',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5,
      project: '',
      location: '',
      active: true,
      order: testimonials.length + 1
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setCurrentTestimonial({ ...testimonial });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeletePrompt = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTestimonial = async () => {
    if (!currentTestimonial?.id) return;
    try {
      await deleteTestimonial(currentTestimonial.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Testimonial deleted",
        description: "The testimonial has been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive"
      });
    }
  };

  const handleSaveTestimonial = async () => {
    if (!currentTestimonial || !currentTestimonial.name || !currentTestimonial.content) return;

    try {
      if (isEditing && currentTestimonial.id) {
        await updateTestimonial(currentTestimonial.id, currentTestimonial);
        toast({
          title: "Testimonial updated",
          description: "Your changes have been saved",
        });
      } else {
        await addTestimonial(currentTestimonial as Omit<Testimonial, 'id'>);
        toast({
          title: "Testimonial added",
          description: "New testimonial has been added",
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive"
      });
    }
  };

  const handleMoveTestimonial = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = sortedTestimonials.findIndex(item => item.id === id);
    if ((direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === sortedTestimonials.length - 1)) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const itemToMove = sortedTestimonials[currentIndex];
    const itemToSwap = sortedTestimonials[newIndex];

    try {
      await updateTestimonial(itemToMove.id, { order: itemToSwap.order });
      await updateTestimonial(itemToSwap.id, { order: itemToMove.order });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder testimonials",
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (id: string) => {
    const testimonial = testimonials.find(item => item.id === id);
    if (!testimonial) return;

    try {
      await updateTestimonial(id, { active: !testimonial.active });
      toast({
        title: testimonial.active ? "Testimonial hidden" : "Testimonial shown",
        description: `The testimonial has been ${testimonial.active ? "hidden" : "made visible"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update testimonial status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Testimonials Management</h3>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Exit Preview' : 'Preview'}
          </Button>
          <Button onClick={handleAddTestimonial}>
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </div>
      </div>

      {previewMode ? (
        <div className="border rounded-lg p-6 bg-muted/20">
          <h4 className="text-lg font-medium mb-4">Testimonials Preview</h4>
          {activeTestimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-lg p-6 shadow-md">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4" 
                    />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                  <div className="text-sm text-gray-500">
                    <p>{testimonial.project} • {testimonial.location}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No active testimonials to display</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTestimonials.map((testimonial, index) => (
            <Card key={testimonial.id} className={!testimonial.active ? 'opacity-60' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{testimonial.name}</span>
                  {!testimonial.active && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      Hidden
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{testimonial.role}, {testimonial.company}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">"{testimonial.content}"</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => handleMoveTestimonial(testimonial.id, 'up')} disabled={index === 0}>
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleMoveTestimonial(testimonial.id, 'down')} disabled={index === sortedTestimonials.length - 1}>
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleEditTestimonial(testimonial)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive/90" onClick={() => handleDeletePrompt(testimonial)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  size="sm" 
                  variant={testimonial.active ? "ghost" : "outline"}
                  onClick={() => handleToggleActive(testimonial.id)}
                >
                  {testimonial.active ? 'Hide' : 'Show'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit/Add Testimonial Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update testimonial details below.' : 'Enter the details for the new testimonial.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={currentTestimonial?.name || ''} 
                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, name: e.target.value})}
                  placeholder="Enter name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input 
                  id="role" 
                  value={currentTestimonial?.role || ''} 
                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, role: e.target.value})}
                  placeholder="Enter role"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  value={currentTestimonial?.company || ''} 
                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, company: e.target.value})}
                  placeholder="Enter company"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={currentTestimonial?.location || ''} 
                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, location: e.target.value})}
                  placeholder="Enter location"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="project">Project</Label>
              <Input 
                id="project" 
                value={currentTestimonial?.project || ''} 
                onChange={(e) => setCurrentTestimonial({...currentTestimonial, project: e.target.value})}
                placeholder="Enter project type"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <Input 
                id="image" 
                value={currentTestimonial?.image || ''} 
                onChange={(e) => setCurrentTestimonial({...currentTestimonial, image: e.target.value})}
                placeholder="Enter image URL"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rating">Rating</Label>
              <Input 
                id="rating" 
                type="number"
                min="1"
                max="5"
                value={currentTestimonial?.rating || 5} 
                onChange={(e) => setCurrentTestimonial({...currentTestimonial, rating: parseInt(e.target.value)})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea 
                id="content" 
                value={currentTestimonial?.content || ''} 
                onChange={(e) => setCurrentTestimonial({...currentTestimonial, content: e.target.value})}
                placeholder="Enter testimonial content"
                rows={4}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={currentTestimonial?.active}
                onCheckedChange={(checked) => 
                  setCurrentTestimonial({...currentTestimonial, active: checked})
                }
              />
              <Label htmlFor="active">Active (visible on website)</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTestimonial} disabled={!currentTestimonial?.name || !currentTestimonial?.content}>
              {isEditing ? 'Update' : 'Add'} Testimonial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Testimonial</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteTestimonial}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
