export async function POST() {
    return new Response('Payment flow removed. Use /api/orders/place.', { status: 410 })
}