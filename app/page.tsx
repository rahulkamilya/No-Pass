import AddCard from "@/components/add-card"
import AddPasswords from "@/components/add-passwords"
import YourCards from "@/components/your-cards"
import YourPasswords from "@/components/your-passwords"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'No-Pass',
  description: 'Your all password saver',
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Password Manager</h1>

      {/* Add section - side by side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-card rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Add your credit cards</h2>
          <AddCard />
        </div>

        <div className="bg-card rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Add a Password</h2>
          <AddPasswords />
        </div>
      </div>

      {/* View section - side by side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Your credit cards</h2>
          <YourCards />
        </div>

        <div className="bg-card rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Your passwords</h2>
          <YourPasswords />
        </div>
      </div>
    </div>
  )
}
