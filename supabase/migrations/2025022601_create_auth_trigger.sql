-- Create a function that will be triggered when a user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new profile for the user with default onboarding status
  INSERT INTO public.profiles (id, email, full_name, onboarding_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    jsonb_build_object(
      'account_created', true,
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that calls the function when a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -- Create a function to handle user updates
-- CREATE OR REPLACE FUNCTION public.handle_user_update()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   -- Update the profile when user metadata changes
--   UPDATE public.profiles
--   SET 
--     email = NEW.email,
--     full_name = COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', '')
--   WHERE id = NEW.id;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- -- Create a trigger that calls the function when a user is updated
-- CREATE OR REPLACE TRIGGER on_auth_user_updated
-- AFTER UPDATE ON auth.users
-- FOR EACH ROW EXECUTE FUNCTION public.handle_user_update(); 