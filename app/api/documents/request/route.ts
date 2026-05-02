import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, flatUnit, email, password, documents } = body;

    // Validate input
    if (!fullName || !flatUnit || !email || !password) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    if (!documents || documents.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one document' },
        { status: 400 }
      );
    }

    // Save document access request to Supabase
    const { data: requestData, error: insertError } = await supabaseAdmin
      .from('document_requests')
      .insert({
        full_name: fullName.trim(),
        flat_unit: flatUnit.trim(),
        email: email.trim().toLowerCase(),
        documents: documents,
        status: 'pending',
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Error saving document request:', insertError);
      return NextResponse.json(
        { error: 'Failed to submit request. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Document access request submitted successfully',
        requestId: requestData.id,
        status: 'pending',
        estimatedTime: '72 business hours',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Document request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
