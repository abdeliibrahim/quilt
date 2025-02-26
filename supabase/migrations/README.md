# Supabase Migrations

This directory contains database migrations for the Supabase project.

## Migrations

### 20240227_create_auth_trigger.sql

This migration creates database triggers that automatically handle user profile management:

1. `on_auth_user_created` - Creates a profile record when a new user signs up
   - Automatically sets the initial onboarding status with `account_created: true`
   - Extracts user metadata like first_name and last_name to create the full_name

2. `on_auth_user_updated` - Updates the profile when user data changes
   - Keeps the profile email and full_name in sync with auth.users

## Benefits

Using database triggers for profile management provides several benefits:

1. **Consistency** - Ensures profiles are always created for new users
2. **Simplicity** - Reduces client-side code complexity
3. **Performance** - Handles profile creation in a single database transaction
4. **Reliability** - Prevents race conditions and data inconsistencies

## Onboarding Status Structure

The onboarding status is stored as a JSONB object with the following structure:

```json
{
  "account_created": boolean,
  "patient_connected": boolean,
  "onboarding_complete": boolean
}
```

This structure allows for flexible tracking of the user's progress through the onboarding flow. 