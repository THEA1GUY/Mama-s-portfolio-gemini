"use client"

import type React from "react"
import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Loader2, PlusCircle, Edit, Trash2, Star, CheckCircle, XCircle
} from "lucide-react"
import { format } from "date-fns"

interface Testimonial {
  id: string
  name: string
  role: string | null
  text: string
  rating: number | null
  approved: boolean
  created_at: string
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const { toast } = useToast()

  const fetchTestimonials = async () => {
    setLoading(true)
    try {
      const response = await fetch('/.netlify/functions/testimonials');
      const result = await response.json();
      if (result.success && result.data) {
        setTestimonials(result.data);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch testimonials.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleAddEditTestimonial = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name") as string,
      role: (formData.get("role") as string) || null,
      text: formData.get("text") as string,
      rating: formData.get("rating") ? Number.parseInt(formData.get("rating") as string) : null,
      approved: formData.get("approved") === "on",
    };

    startTransition(async () => {
      let result;
      try {
        if (editingTestimonial) {
          const response = await fetch('/.netlify/functions/testimonials', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: 'updateTestimonial', id: editingTestimonial.id, data }),
          });
          result = await response.json();
        } else {
          const response = await fetch('/.netlify/functions/testimonials', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: 'addTestimonial', data }),
          });
          result = await response.json();
        }

        if (result.success) {
          toast({
            title: "Success",
            description: result.message,
          });
          setIsDialogOpen(false);
          setEditingTestimonial(null);
          fetchTestimonials();
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    startTransition(async () => {
      try {
        const response = await fetch('/.netlify/functions/testimonials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: 'deleteTestimonial', id }),
        });
        const result = await response.json();
        if (result.success) {
          toast({
            title: "Success",
            description: result.message,
          });
          fetchTestimonials();
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      try {
        const response = await fetch('/.netlify/functions/testimonials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: 'toggleTestimonialApproval', id, currentApprovedStatus }),
        });
        const result = await response.json();
        if (result.success) {
          toast({
            title: "Success",
            description: result.message,
          });
          fetchTestimonials();
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  const openAddDialog = () => {
    setEditingTestimonial(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-african-terracotta">Manage Testimonials</h1>
        <Button onClick={openAddDialog} className="bg-african-terracotta hover:bg-african-terracotta/90 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Testimonial
        </Button>
      </div>

      <Card className="bg-black/60 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-african-ochre">Client Testimonials</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            </div>
          ) : testimonials.length === 0 ? (
            <p className="text-center text-gray-400">No testimonials found. Add your first testimonial!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/20">
                  <TableHead className="w-[40px]">Approved</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Testimonial</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow
                    key={testimonial.id}
                    className={`border-purple-500/10 ${testimonial.approved ? "text-white" : "text-gray-500"}`}
                  >
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleApproval(testimonial.id, testimonial.approved)}
                        disabled={isPending}
                        className="hover:bg-transparent"
                      >
                        {testimonial.approved ? (
                          <CheckCircle className="h-5 w-5 text-african-green" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{testimonial.name}</TableCell>
                    <TableCell>{testimonial.role || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex text-african-ochre">
                        {testimonial.rating ? (
                          [...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400 max-w-[250px] truncate">{testimonial.text}</TableCell>
                    <TableCell>{format(new Date(testimonial.created_at), "MMM dd, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditDialog(testimonial)}
                          disabled={isPending}
                          className="border-african-ochre text-african-ochre hover:bg-african-ochre hover:text-black bg-transparent"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteTestimonial(testimonial.id)}
                          disabled={isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-black border-purple-500/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-african-terracotta">
              {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEditTestimonial} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Client Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingTestimonial?.name || ""}
                className="col-span-3 bg-gray-800 border-gray-700 text-white focus:ring-african-ochre focus:border-african-ochre"
                required
                disabled={isPending}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role/Title
              </Label>
              <Input
                id="role"
                name="role"
                defaultValue={editingTestimonial?.role || ""}
                className="col-span-3 bg-gray-800 border-gray-700 text-white focus:ring-african-ochre focus:border-african-ochre"
                disabled={isPending}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="text" className="text-right">
                Testimonial
              </Label>
              <Textarea
                id="text"
                name="text"
                defaultValue={editingTestimonial?.text || ""}
                className="col-span-3 bg-gray-800 border-gray-700 text-white focus:ring-african-ochre focus:border-african-ochre"
                rows={5}
                required
                disabled={isPending}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">
                Rating (1-5)
              </Label>
              <Select name="rating" defaultValue={editingTestimonial?.rating?.toString() || ""} disabled={isPending}>
                <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700 text-white focus:ring-african-ochre focus:border-african-ochre">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Star{num > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="approved" className="text-right">
                Approved
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="approved"
                  name="approved"
                  defaultChecked={editingTestimonial?.approved || false}
                  disabled={isPending}
                  className="border-gray-700 data-[state=checked]:bg-african-green data-[state=checked]:text-white"
                />
                <span className="text-sm text-gray-300">Display on website</span>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isPending}
                className="border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-african-terracotta hover:bg-african-terracotta/90 text-white"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : editingTestimonial ? (
                  "Save Changes"
                ) : (
                  "Add Testimonial"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}