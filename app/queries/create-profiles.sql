-- Caregiver profiles (connected to auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  onboarding_status JSONB DEFAULT '{"account_created": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Patients (no auth accounts)
CREATE TABLE public.patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT,
  info JSONB,
  invitation_code TEXT UNIQUE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Caregiver-Patient relationships
CREATE TABLE public.caregiver_patient (
  caregiver_id UUID REFERENCES public.profiles(id),
  patient_id UUID REFERENCES public.patients(id),
  relationship_type TEXT, -- 'primary', 'secondary', etc.
  PRIMARY KEY (caregiver_id, patient_id)
);