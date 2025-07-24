"use client"
import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { getMessages, updateMessageStatus, deleteMessage } from "./actions"
import { Loader2, Eye, MailOpen, Mail, Trash2 } from "lucide-react"
import { format } from "date-fns"

interface Message {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  created_at: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const { toast } = useToast()

  const fetchMessages = async () => {
    setLoading(true)
    const result = await getMessages()
    if (result.success && result.data) {
      setMessages(result.data)
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to fetch messages.",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleUpdateStatus = async (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const result = await updateMessageStatus(id, !currentStatus)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        fetchMessages() // Re-fetch to update UI
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    })
  }

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return

    startTransition(async () => {
      const result = await deleteMessage(id)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        fetchMessages() // Re-fetch to update UI
        if (selectedMessage?.id === id) {
          setIsMessageDialogOpen(false)
          setSelectedMessage(null)
        }
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    })
  }

  const openMessageDialog = (message: Message) => {
    setSelectedMessage(message)
    setIsMessageDialogOpen(true)
    if (!message.read) {
      handleUpdateStatus(message.id, false) // Mark as read when opened
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-african-terracotta mb-8">Client Messages</h1>

      <Card className="bg-black/60 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-african-ochre">Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            </div>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-400">No messages found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/20">
                  <TableHead className="w-[40px]">Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject (First few words)</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow
                    key={message.id}
                    className={`border-purple-500/10 ${message.read ? "text-gray-500" : "font-medium text-white"}`}
                  >
                    <TableCell>
                      {message.read ? (
                        <MailOpen className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Mail className="h-5 w-5 text-african-ochre" />
                      )}
                    </TableCell>
                    <TableCell>{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell className="max-w-[250px] truncate">
                      {message.message.split(" ").slice(0, 8).join(" ")}...
                    </TableCell>
                    <TableCell>{format(new Date(message.created_at), "MMM dd, yyyy HH:mm")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openMessageDialog(message)}
                          disabled={isPending}
                          className="border-african-ochre text-african-ochre hover:bg-african-ochre hover:text-black bg-transparent"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateStatus(message.id, message.read)}
                          disabled={isPending}
                          className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white bg-transparent"
                        >
                          {message.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteMessage(message.id)}
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

      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-black border-purple-500/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-african-terracotta">Message from {selectedMessage?.name}</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="grid gap-4 py-4 text-gray-300">
              <div>
                <p className="font-medium">From:</p>
                <p>
                  {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                </p>
              </div>
              <div>
                <p className="font-medium">Date:</p>
                <p>{format(new Date(selectedMessage.created_at), "PPPp")}</p>
              </div>
              <div>
                <p className="font-medium">Message:</p>
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => selectedMessage && handleDeleteMessage(selectedMessage.id)}
              disabled={isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Message
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsMessageDialogOpen(false)}
              disabled={isPending}
              className="border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white bg-transparent"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
