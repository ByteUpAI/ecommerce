import { response } from '@/lib/helperFunction'
import TestimonialModel from '@/models/Testimonial.model'
import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import mongoose from 'mongoose'

export async function GET() {
    try {
        await connectDB()
        const testimonials = await TestimonialModel.find({ isActive: true })
            .sort({ order: 1, createdAt: -1 })
            .lean()
        
        return response(true, 200, 'Testimonials fetched successfully.', testimonials)
    } catch (error) {
        console.error('Failed to fetch testimonials:', error)
        return response(false, 500, 'Failed to fetch testimonials.')
    }
}

export async function POST(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const body = await request.json()
        const testimonial = new TestimonialModel(body)
        await testimonial.save()
        
        return response(true, 201, 'Testimonial created successfully.', testimonial)
    } catch (error) {
        console.error('Failed to create testimonial:', error)
        return response(false, 500, 'Failed to create testimonial.')
    }
}

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const body = await request.json()
        const { _id, ...updateData } = body

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            return response(false, 400, 'Invalid testimonial ID.')
        }

        const testimonial = await TestimonialModel.findByIdAndUpdate(
            _id,
            updateData,
            { new: true, runValidators: true }
        )

        if (!testimonial) {
            return response(false, 404, 'Testimonial not found.')
        }

        return response(true, 200, 'Testimonial updated successfully.', testimonial)
    } catch (error) {
        console.error('Failed to update testimonial:', error)
        return response(false, 500, 'Failed to update testimonial.')
    }
}

export async function DELETE(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response(false, 400, 'Invalid testimonial ID.')
        }

        const testimonial = await TestimonialModel.findByIdAndDelete(id)
        
        if (!testimonial) {
            return response(false, 404, 'Testimonial not found.')
        }

        return response(true, 200, 'Testimonial deleted successfully.')
    } catch (error) {
        console.error('Failed to delete testimonial:', error)
        return response(false, 500, 'Failed to delete testimonial.')
    }
}
