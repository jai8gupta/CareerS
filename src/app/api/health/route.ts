import { NextResponse } from "next/server";
export function GET(){return NextResponse.json({status:"ok",services:{database:Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),ai:Boolean(process.env.OPENAI_API_KEY),payments:Boolean(process.env.RAZORPAY_KEY_SECRET)}},{headers:{"Cache-Control":"no-store"}})}
