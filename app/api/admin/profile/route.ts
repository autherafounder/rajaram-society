
// Disable Next.js route caching for dynamic data
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    // Read admin data from Supabase
    const { data: adminData, error } = await supabaseAdmin
      .from('admins')
      .select('email, name, role')
      .limit(1)
      .single();

    if (error || !adminData) {
      return NextResponse.json(
        { error: 'Admin profile not found' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        user: {
          email: adminData.email,
          name: adminData.name,
          role: adminData.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Profile GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = requireAdmin(request);
    const body = await request.json();
    const { name, email } = body;

    // Update admin data in Supabase
    const { error } = await supabaseAdmin
      .from('admins')
      .update({
        name: name || undefined,
        email: email || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('email', admin.email);

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json(
        { error: 'Failed to save profile' },
        { status: 500 }
      );
    }

    // Log activity
    await supabaseAdmin.from('admin_activity').insert({
      admin_email: admin.email,
      action: 'profile_update',
      details: { name, email },
    });

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: { email: email || admin.email, name: name || admin.name, role: admin.role },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Profile PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
