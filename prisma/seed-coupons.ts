import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding coupons...')

  // Create test coupons
  const coupons = [
    {
      code: 'WELCOME10',
      name: 'Welcome Discount',
      description: '10% off for new customers',
      discountType: 'percentage',
      discountValue: 10,
      minimumOrderAmount: 500,
      maximumDiscount: 1000,
      usageLimit: 100,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      isActive: true,
      appliesTo: 'all'
    },
    {
      code: 'SAVE50',
      name: 'Fixed Discount',
      description: '₹50 off on orders above ₹1000',
      discountType: 'fixed_amount',
      discountValue: 50,
      minimumOrderAmount: 1000,
      maximumDiscount: 50,
      usageLimit: 50,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      isActive: true,
      appliesTo: 'all'
    },
    {
      code: 'FUNNY20',
      name: 'Funny Category Discount',
      description: '20% off on Funny category products',
      discountType: 'percentage',
      discountValue: 20,
      minimumOrderAmount: 0,
      maximumDiscount: 500,
      usageLimit: 25,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      isActive: true,
      appliesTo: 'categories',
      applicableItems: JSON.stringify(['Funny'])
    }
  ]

  for (const coupon of coupons) {
    try {
      await prisma.coupon.upsert({
        where: { code: coupon.code },
        update: coupon,
        create: coupon
      })
      console.log(`✅ Created/Updated coupon: ${coupon.code}`)
    } catch (error) {
      console.error(`❌ Error creating coupon ${coupon.code}:`, error)
    }
  }

  console.log('🎉 Coupon seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 