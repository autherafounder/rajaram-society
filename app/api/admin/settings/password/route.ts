import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function PUT(request: NextRequest) {
  try {
    const admin = requireAdmin(request);
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Read admin data from Supabase
    const { data: adminData, error: fetchError } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('email', admin.email)
      .single();

    if (fetchError || !adminData) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 500 }
      );
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, adminData.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in Supabase
    const { error: updateError } = await supabaseAdmin
      .from('admins')
      .update({
        password: hashedPassword,
        updated_at: new Date().toISOString(),
      })
      .eq('email', admin.email);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    // Log activity
    await supabaseAdmin.from('admin_activity').insert({
      admin_email: admin.email,
      action: 'password_change',
      details: { timestamp: new Date().toISOString() },
    });

    return NextResponse.json(
      { message: 'Password changed successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
