"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Zap, Users, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-black to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-black mb-6">
            About <span className="text-red-500">STRECK</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            We're not just selling clothes. We're selling a lifestyle. A lifestyle that says 
            "I don't care what you think" with style and sarcasm.
          </p>
          <Badge className="bg-red-600 text-white text-lg px-6 py-2">
            Zero F*cks Given Since 2024
          </Badge>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                To provide high-quality, comfortable clothing that speaks your truth without 
                saying a word. We believe everyone deserves to wear their personality on their sleeve.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                From existential crisis hoodies to corporate slave tees, we've got you covered 
                for every mood and every occasion where you need to make a statement.
              </p>
              <Button className="bg-black text-white hover:bg-gray-800">
                Shop Our Collection
              </Button>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Why STRECK?</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span>Premium quality materials</span>
                </li>
                <li className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Made with love and sarcasm</span>
                </li>
                <li className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span>Community of chaos lovers</span>
                </li>
                <li className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-green-500" />
                  <span>100% authentic attitude</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Authenticity</h3>
                <p className="text-gray-600">
                  We keep it real. No fake smiles, no forced positivity. Just pure, unapologetic you.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Quality</h3>
                <p className="text-gray-600">
                  Premium materials and craftsmanship. Because your attitude deserves the best.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Community</h3>
                <p className="text-gray-600">
                  Join the tribe of people who get it. You're not alone in your chaos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-6">Get In Touch</h2>
          <p className="text-lg text-gray-700 mb-8">
            Have questions? Want to share your STRECK story? We'd love to hear from you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Customer Support</h3>
              <p className="text-gray-600 mb-4">support@streck.com</p>
              <p className="text-gray-600">Available 24/7 for your chaos</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Business Inquiries</h3>
              <p className="text-gray-600 mb-4">hello@streck.com</p>
              <p className="text-gray-600">Let's make chaos together</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 