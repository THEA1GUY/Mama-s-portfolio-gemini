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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { addWork, getWorks, updateWork, deleteWork, getSignedUploadUrl } from "./actions"
import { FileUpload } from "@/components/ui/file-upload"
import { Loader2, PlusCircle, Edit, Trash2, Star } from "lucide-react"
import Image from "next/image"

interface Work {
  id: string
  title: string
  category: string
  image_url: string | null
  description: string | null
  created_at: string
  updated_at: string
  image_width: number | null
  image_height: number | null
  is_favorite: boolean | null
  type: "image" | "video"
  video_url: string | null
  thumbnail_url?: string | null
}

const categories = ["Photography", "Videography"]

export default function AdminWorksPage() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingWork, setEditingWork] = useState<Work | null>(null)
  const [fileToUpload, setFileToUpload] = useState<{ file: File | null; dimensions: { width: number; height: number } | null | undefined }>({ file: null, dimensions: null })
  const [isFavoriteState, setIsFavoriteState] = useState(false)
  const [workType, setWorkType] = useState<"image" | "video">("image")
  const { toast } = useToast()

  const fetchWorks = async () => {
    setLoading(true)
    const result = await getWorks()
    if (result.success && result.data) {
      setWorks(result.data)
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to fetch works.",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchWorks()
  }, [])

  const handleAddEditWork = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        let imageUrl: string | null = editingWork?.image_url || null

        if (fileToUpload.file) {
          const presignedUrlResult = await getSignedUploadUrl(fileToUpload.file.name, fileToUpload.file.type, "works-images")
          if (!presignedUrlResult.success || !presignedUrlResult.data) {
            throw new Error(presignedUrlResult.message)
          }

          const { data: presignedData } = presignedUrlResult
          if (!presignedData) {
            throw new Error("Failed to get presigned URL data.")
          }

          await fetch(presignedData.signedUrl, {
            method: "PUT",
            body: fileToUpload.file,
            headers: { "Content-Type": fileToUpload.file.type },
          })
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
          imageUrl = `${supabaseUrl}/storage/v1/object/public/works-images/${presignedData.path}`
          formData.set("image_url", imageUrl)
          if (fileToUpload.dimensions) {
            formData.set("image_width", fileToUpload.dimensions.width.toString())
            formData.set("image_height", fileToUpload.dimensions.height.toString())
          }
        }

        formData.set("type", workType)
        formData.set("is_favorite", isFavoriteState ? "true" : "false")

        const result = editingWork ? await updateWork(editingWork.id, formData) : await addWork(formData)

        if (result.success) {
          toast({
            title: "Success",
            description: result.message,
          })
          setIsDialogOpen(false)
          setEditingWork(null)
          setFileToUpload({ file: null, dimensions: null })
          fetchWorks()
        } else {
          throw new Error(result.message)
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        })
      }
    })
  }

  const handleDeleteWork = async (id: string, imageUrl: string | null) => {
    if (!confirm("Are you sure you want to delete this work?")) return

    startTransition(async () => {
      const result = await deleteWork(id, imageUrl)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        fetchWorks()
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    })
  }

  const openAddDialog = () => {
    setEditingWork(null)
    setFileToUpload({ file: null, dimensions: null })
    setIsFavoriteState(false)
    setWorkType("image")
    setIsDialogOpen(true)
  }

  const openEditDialog = (work: Work) => {
    setEditingWork(work)
    setFileToUpload({ file: null, dimensions: null })
    setIsFavoriteState(work.is_favorite || false)
    setWorkType(work.type || "image")
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-african-terracotta">Manage Works</h1>
        <Button onClick={openAddDialog} className="bg-african-terracotta hover:bg-african-terracotta/90 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Work
        </Button>
      </div>

      <Card className="bg-black/60 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-african-ochre">Your Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            </div>
          ) : works.length === 0 ? (
            <p className="text-center text-gray-400">No works found. Add your first work!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/20">
                  <TableHead className="w-[40px]">Fav</TableHead>
                  <TableHead className="w-[80px]">Media</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {works.map((work) => (
                  <TableRow key={work.id} className="border-purple-500/10">
                    <TableCell>
                      {work.is_favorite && <Star className="h-4 w-4 fill-african-ochre text-african-ochre" />}
                    </TableCell>
                    <TableCell>
                      {work.thumbnail_url ? (
                        <Image
                          src={work.thumbnail_url}
                          alt={work.title}
                          width={56}
                          height={56}
                          className="rounded-md object-cover aspect-square"
                        />
                      ) : (work.type === "image" || !work.type) && work.image_url && work.image_width && work.image_height ? (
                        <Image
                          src={work.image_url || "/placeholder.svg"}
                          alt={work.title}
                          width={work.image_width}
                          height={work.image_height}
                          className="rounded-md object-cover aspect-square"
                        />
                      ) : work.type === "video" && work.video_url ? (
                        <div className="w-14 h-14 bg-gray-700 rounded-md flex items-center justify-center text-gray-400 text-xs overflow-hidden">
                          <iframe
                            src={`https://www.youtube.com/embed/${work.video_url.split("v=")[1]?.split("&")[0]}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell className="font-medium">{work.title}</TableCell>
                    <TableCell>{work.category}</TableCell>
                    <TableCell className="text-gray-400 max-w-[200px] truncate">{work.description || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditDialog(work)}
                          disabled={isPending}
                          className="border-african-ochre text-african-ochre hover:bg-african-ochre hover:text-black bg-transparent"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteWork(work.id, work.image_url)}
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
            <DialogTitle className="text-african-terracotta">{editingWork ? "Edit Work" : "Add New Work"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEditWork} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={editingWork?.title || ""}
                className="col-span-3 bg-gray-800 border-gray-700 text-white focus:ring-african-ochre focus:border-african-ochre"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select name="category" defaultValue={editingWork?.category || ""} required disabled={isPending}>
                <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700 text-white focus:ring-african-ochre focus:border-african-ochre">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workType" className="text-right">
                Type
              </Label>
              <Select name="workType" value={workType} onValueChange={(value: "image" | "video") => setWorkType(value)} required disabled={isPending}>
                <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700 text-white focus:ring-african-ochre focus:border-african-ochre">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editingWork?.description || ""}
                className="col-span-3 bg-gray-800 border-gray-700 text-white focus:ring-african-ochre focus:border-african-ochre"
                rows={4}
              />
            </div>

            {workType === "image" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageFile" className="text-right">
                  Image
                </Label>
                <div className="col-span-3">
                  <FileUpload
                    name="imageFile"
                    label="Upload Image"
                    currentFileUrl={editingWork?.image_url}
                    onFileChange={(file, dimensions) => setFileToUpload({ file, dimensions })}
                    disabled={isPending}
                  />
                </div>
              </div>
            )}

            {workType === "video" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="video_url" className="text-right">
                  YouTube URL
                </Label>
                <Input
                  id="video_url"
                  name="video_url"
                  defaultValue={editingWork?.video_url || ""}
                  className="col-span-3 bg-gray-800 border-gray-700 text-white focus:ring-african-ochre focus:border-african-ochre"
                  placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  required
                />
              </div>
            )}

            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_favorite" className="text-right">
                Favorite
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="is_favorite"
                  name="is_favorite"
                  checked={isFavoriteState}
                  onCheckedChange={(checked) => setIsFavoriteState(Boolean(checked))}
                  disabled={isPending}
                  className="border-gray-700 data-[state=checked]:bg-african-green data-[state=checked]:text-white"
                />
                <span className="text-sm text-gray-300">Mark as a favorite work</span>
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
                ) : editingWork ? (
                  "Save Changes"
                ) : (
                  "Add Work"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}