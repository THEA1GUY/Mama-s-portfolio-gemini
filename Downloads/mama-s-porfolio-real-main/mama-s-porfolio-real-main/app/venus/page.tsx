import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, MessageSquare, GalleryVertical, Star } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-african-terracotta mb-8">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-black/60 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Works</CardTitle>
            <GalleryVertical className="h-4 w-4 text-african-ochre" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-gray-400">+5 this month</p>
          </CardContent>
        </Card>
        <Card className="bg-black/60 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">New Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-african-ochre" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-gray-400">+2 today</p>
          </CardContent>
        </Card>
        <Card className="bg-black/60 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Client Testimonials</CardTitle>
            <Star className="h-4 w-4 text-african-ochre" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-400">+1 new</p>
          </CardContent>
        </Card>
        <Card className="bg-black/60 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-african-ochre" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50</div>
            <p className="text-xs text-gray-400">+3 this week</p>
          </CardContent>
        </Card>
      </div>

      <section className="bg-black/60 border border-purple-500/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-african-terracotta mb-4">Recent Activity</h2>
        <ul className="space-y-3 text-gray-300">
          <li>- New work "Celestial Harmony" added to Digital Art.</li>
          <li>- Message received from Sarah Chen regarding a custom commission.</li>
          <li>- Kemi Adebayo's testimonial approved and published.</li>
          <li>- Updated "Afrofuturistic Visions" description.</li>
        </ul>
      </section>

      <section className="bg-black/60 border border-purple-500/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-african-terracotta mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button className="bg-african-terracotta hover:bg-african-terracotta/90 text-white">Add New Work</Button>
          <Button
            variant="outline"
            className="border-african-ochre text-african-ochre hover:bg-african-ochre hover:text-black bg-transparent"
          >
            View Messages
          </Button>
          <Button
            variant="outline"
            className="border-african-ochre text-african-ochre hover:bg-african-ochre hover:text-black bg-transparent"
          >
            Manage Testimonials
          </Button>
        </div>
      </section>
    </div>
  )
}
