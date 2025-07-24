
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createBrowserClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';

export function AddWorkForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createBrowserClient();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !imageFile) {
      toast({
        title: "Error",
        description: "Please fill out all fields and select an image.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `works/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, imageFile);

    if (uploadError) {
      toast({
        title: "Upload Error",
        description: uploadError.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase.from('works').insert([
      {
        title,
        description,
        category,
        image_url: publicUrlData.publicUrl,
      },
    ]);

    if (insertError) {
      toast({
        title: "Database Error",
        description: insertError.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Work added successfully.",
      });
      router.push('/venus/works');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
      <div>
        <Label htmlFor="image">Image</Label>
        <Input id="image" type="file" onChange={handleFileChange} className="bg-gray-800 border-gray-700 text-white" />
      </div>
      <Button type="submit" disabled={loading} className="bg-african-terracotta hover:bg-african-terracotta/90 text-white">
        {loading ? 'Adding...' : 'Add Work'}
      </Button>
    </form>
  );
}
