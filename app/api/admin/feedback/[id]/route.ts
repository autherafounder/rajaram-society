import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

// PATCH — Update feedback status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = requireAdmin(request);
    const feedbackId = params.id;
    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ['new', 'read', 'resolved'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: new, read, resolved' },
        { status: 400 }
      );
    }

    // Update feedback
    const { data: feedback, error } = await supabaseAdmin
      .from('feedbacks')
      .update({ status })
      .eq('id', feedbackId)
      .select()
      .single();

    if (error) {
      console.error('Error updating feedback:', error);
      return NextResponse.json(
        { error: 'Failed to update feedback' },
        { status: 500 }
      );
    }

    if (!feedback) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    // Log admin activity
    await supabaseAdmin.from('admin_activity').insert({
      admin_email: admin.email,
      action: `feedback_${status}`,
      details: { feedbackId, previousStatus: body.previousStatus || 'unknown' },
    });

    return NextResponse.json(
      { message: 'Feedback updated successfully', feedback },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Feedback PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE — Delete feedback
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = requireAdmin(request);
    const feedbackId = params.id;

    // Get feedback details before deleting (for audit log)
    const { data: feedback } = await supabaseAdmin
      .from('feedbacks')
      .select('email, name')
      .eq('id', feedbackId)
      .single();

    // Delete feedback
    const { error } = await supabaseAdmin
      .from('feedbacks')
      .delete()
      .eq('id', feedbackId);

    if (error) {
      console.error('Error deleting feedback:', error);
      return NextResponse.json(
        { error: 'Failed to delete feedback' },
        { status: 500 }
      );
    }

    // Log admin activity
    await supabaseAdmin.from('admin_activity').insert({
      admin_email: admin.email,
      action: 'feedback_delete',
      details: {
        feedbackId,
        email: feedback?.email || 'unknown',
        name: feedback?.name || 'unknown',
      },
    });

    return NextResponse.json(
      { message: 'Feedback deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Feedback DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
