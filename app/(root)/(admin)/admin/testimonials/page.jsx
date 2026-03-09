'use client'
import { useState, useEffect } from 'react'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import axios from 'axios'
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'
import { IoStar } from 'react-icons/io5'
import { RiEditLine, RiDeleteBinLine, RiAddLine } from 'react-icons/ri'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: '/admin/testimonials', label: 'Testimonials Management' },
]

const TestimonialsManagement = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    review: '',
    rating: 5,
    designation: '',
    company: '',
    email: '',
    isActive: true
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const { data } = await axios.get(`${baseUrl}/api/testimonials`)
      if (data.success) {
        setTestimonials(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
      toast.error('Failed to fetch testimonials')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      let response

      if (editingTestimonial) {
        response = await axios.put(`${baseUrl}/api/testimonials`, {
          ...formData,
          _id: editingTestimonial._id
        })
      } else {
        response = await axios.post(`${baseUrl}/api/testimonials`, formData)
      }

      if (response.data.success) {
        toast.success(editingTestimonial ? 'Testimonial updated successfully' : 'Testimonial created successfully')
        setDialogOpen(false)
        setEditingTestimonial(null)
        resetForm()
        fetchTestimonials()
      }
    } catch (error) {
      console.error('Failed to save testimonial:', error)
      toast.error(error.response?.data?.message || 'Failed to save testimonial')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      review: testimonial.review,
      rating: testimonial.rating,
      designation: testimonial.designation || '',
      company: testimonial.company || '',
      email: testimonial.email || '',
      isActive: testimonial.isActive
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const response = await axios.delete(`${baseUrl}/api/testimonials?id=${id}`)
      
      if (response.data.success) {
        toast.success('Testimonial deleted successfully')
        fetchTestimonials()
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error)
      toast.error('Failed to delete testimonial')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      review: '',
      rating: 5,
      designation: '',
      company: '',
      email: '',
      isActive: true
    })
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingTestimonial(null)
    resetForm()
  }

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2 flex justify-between items-center">
          <h4 className='text-xl font-semibold'>Testimonials Management</h4>
          <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer" onClick={() => setEditingTestimonial(null)}>
                <RiAddLine className="mr-2" size={20} />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="review">Review *</Label>
                  <Textarea
                    id="review"
                    rows={4}
                    value={formData.review}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Rating *</Label>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="text-2xl transition-colors"
                      >
                        <IoStar
                          className={star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. CEO, Manager"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. ABC Corp"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <ButtonLoading loading={loading} type="submit" text="Save" />
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="pb-5">
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-semibold text-lg">{testimonial.name}</h5>
                      <Badge variant={testimonial.isActive ? 'default' : 'secondary'}>
                        {testimonial.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {testimonial.designation && (
                      <p className="text-sm text-gray-600">{testimonial.designation}</p>
                    )}
                    {testimonial.company && (
                      <p className="text-sm text-gray-600">{testimonial.company}</p>
                    )}
                    <div className="flex mt-1 mb-2">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <IoStar key={`star${i}`} className='text-yellow-400' size={16} />
                      ))}
                    </div>
                    <p className="text-gray-700">{testimonial.review}</p>
                    {testimonial.email && (
                      <p className="text-sm text-gray-500 mt-2">{testimonial.email}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(testimonial)}
                      className="cursor-pointer"
                    >
                      <RiEditLine size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(testimonial._id)}
                      className="cursor-pointer text-red-600 hover:text-red-700"
                    >
                      <RiDeleteBinLine size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No testimonials found. Click "Add Testimonial" to create one.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TestimonialsManagement
