import { supabase } from "../../core/config/supabase";

export const loginWithEmail = async (
  email: string,
  password: string
) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    console.log(error);
    throw error;
  };

  return data;
};

export const registerWithEmail = async (email:string,password:string) => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  });
  if (error) throw error;

  return data;
}
