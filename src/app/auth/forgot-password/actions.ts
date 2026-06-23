"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/mail";
import { rateLimitAction } from "@/lib/rateLimit";

export async function sendPasswordResetOTP(email: string) {
    if (await rateLimitAction('password-reset', 5)) {
        return { success: false, error: 'Too many reset attempts. Please wait a minute.' };
    }

    const supabase = await createAdminClient();
    
    // 1. Check if user exists in profiles
    const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('email', email)
        .single();
        
    if (userError || !user) {
        return { success: false, error: "No account found with this email address." };
    }
    
    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    
    // 3. Save to password_reset_otps
    const { error: otpError } = await supabase
        .from('password_reset_otps')
        .upsert({
            email,
            otp,
            expires_at: expiresAt.toISOString()
        }, { onConflict: 'email' });
        
    if (otpError) {
        console.error("OTP Save Error:", otpError);
        return { success: false, error: "Failed to initialize security protocol. Try again." };
    }
    
    // 4. Send Professional Email
    const html = `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; color: #0F172A; padding: 40px; border: 1px solid #F1F5F9; border-radius: 16px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="font-size: 24px; font-weight: 800; letter-spacing: 4px; color: #0F172A; margin: 0; text-transform: uppercase;">LENZIFY</h1>
                <p style="font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #775a19; margin: 8px 0 0 0; text-transform: uppercase; font-style: italic;">The Future of Vision</p>
            </div>
            
            <div style="border-top: 1px solid #F1F5F9; pt-32;">
                <h2 style="font-size: 20px; font-weight: 700; color: #0F172A; margin-bottom: 16px;">Security Verification</h2>
                <p style="font-size: 14px; color: #64748B; line-height: 1.6; margin-bottom: 24px;">Hi ${user.full_name || 'there'},</p>
                <p style="font-size: 14px; color: #64748B; line-height: 1.6; margin-bottom: 24px;">We received a request to reset your password. Please use the following One-Time Password (OTP) to complete the verification process. This code will expire in 10 minutes.</p>
                
                <div style="background-color: #F8FAFC; border: 1px solid #F1F5F9; padding: 24px; text-align: center; border-radius: 12px; margin: 32px 0;">
                    <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #0F172A;">${otp}</span>
                </div>
                
                <p style="font-size: 12px; color: #94A3B8; line-height: 1.6; margin-bottom: 32px;">If you did not request this password reset, please ignore this email or contact our security team if you have concerns.</p>
                
                <div style="border-top: 1px solid #F1F5F9; padding-top: 32px;">
                    <p style="font-size: 14px; font-weight: 600; color: #0F172A; margin: 0;">Team Lenzify</p>
                    <p style="font-size: 12px; color: #94A3B8; margin: 4px 0 0 0;">Automated Archive Security System</p>
                </div>
            </div>
            
            <div style="margin-top: 48px; text-align: center;">
                <p style="font-size: 10px; color: #CBD5E1; letter-spacing: 1px; text-transform: uppercase;">Lenzify.in | Bangalore, India</p>
            </div>
        </div>
    `;
    
    const mailRes = await sendEmail({
        to: email,
        subject: `${otp} is your Lenzify Verification Code`,
        html
    });
    
    if (!mailRes.success) {
        return { success: false, error: "Email delivery failure. Check your connection." };
    }
    
    return { success: true };
}

export async function verifyOTP(email: string, otp: string) {
    const supabase = await createAdminClient();
    
    const { data: otpData, error } = await supabase
        .from('password_reset_otps')
        .select('*')
        .eq('email', email)
        .eq('otp', otp)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
    if (error || !otpData) {
        return { success: false, error: "Invalid or expired verification code." };
    }
    
    return { success: true };
}

export async function resetPassword(email: string, otp: string, newPassword: string) {
    const supabase = await createAdminClient();
    
    // 1. Verify OTP again for security
    const verifyRes = await verifyOTP(email, otp);
    if (!verifyRes.success) return verifyRes;
    
    // 2. Find User ID
    const { data: user } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
        
    if (!user) return { success: false, error: "Identity mismatch. Reset aborted." };
    
    // 3. Update Supabase Auth Password
    const { error: authError } = await supabase.auth.admin.updateUserById(user.id, {
        password: newPassword
    });
    
    if (authError) {
        console.error("Auth Reset Error:", authError);
        return { success: false, error: authError.message };
    }
    
    // 4. Cleanup OTP
    await supabase.from('password_reset_otps').delete().eq('email', email);
    
    return { success: true };
}
