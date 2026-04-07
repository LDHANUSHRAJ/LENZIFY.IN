import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdmin() {
  const email = 'lenzify.in@gmail.com'
  const password = 'dhanush5*'
  const name = 'Lenzify Admin'

  console.log(`Connecting to Supabase at ${supabaseUrl}...`)

  // Check if user already exists
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error('Error fetching users:', listError.message)
    return
  }

  const existingUser = users.find(u => u.email === email)

  if (existingUser) {
    console.log(`User ${email} already exists. Updating password...`)
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      { password: password }
    )
    if (updateError) {
      console.error('Error updating password:', updateError.message)
    } else {
      console.log('Password updated successfully!')
    }
  } else {
    console.log(`Creating new admin user: ${email}...`)
    const { data, error: createError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { name: name }
    })

    if (createError) {
      console.error('Error creating user:', createError.message)
    } else {
      console.log('Admin user created successfully!')
      console.log('User ID:', data.user?.id)
    }
  }
}

createAdmin().catch(err => {
  console.error('Unexpected error:', err)
})
