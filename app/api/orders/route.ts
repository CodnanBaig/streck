import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';
import { validateEmail, validatePhone, validatePincode } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { customer, items, subtotal, discount, shipping, total, paymentMethod, shippingMethod } = body;

    // Validate required fields
    if (!customer || !items || !total) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate customer data
    if (!validateEmail(customer.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (!validatePhone(customer.phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    if (!validatePincode(customer.pincode)) {
      return NextResponse.json(
        { error: 'Invalid pincode' },
        { status: 400 }
      );
    }

    // Create order
    const order = new Order({
      customer,
      items,
      subtotal,
      discount: discount || 0,
      shipping: shipping || 0,
      total,
      paymentMethod,
      shippingMethod,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await order.save();

    return NextResponse.json(
      { 
        message: 'Order created successfully',
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          total: order.total
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const orderNumber = searchParams.get('orderNumber');

    if (!email && !orderNumber) {
      return NextResponse.json(
        { error: 'Email or order number required' },
        { status: 400 }
      );
    }

    const query: any = {};
    if (email) query['customer.email'] = email;
    if (orderNumber) query.orderNumber = orderNumber;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ orders });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
} 