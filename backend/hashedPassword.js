import { supabase } from "./supabaseClient.js";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

async function hashAndUpdatePasswords() {
  // Fetch all users
  const { data: users, error } = await supabase
    .from("mepo_employee_account")
    .select("mepo_employee_id, password");

  if (error) {
    console.error("Error fetching users:", error);
    return;
  }

  for (const user of users) {
    // Skip if already hashed (optional: check if password starts with $2a$)
    if (user.password.startsWith("$2a$")) continue;

    const hashed = bcrypt.hashSync(user.password, 10);

    // Update the password in Supabase
    const { error: updateError } = await supabase
      .from("mepo_employee_account")
      .update({ password: hashed })
      .eq("mepo_employee_id", user.mepo_employee_id);

    if (updateError) {
      console.error(
        `Error updating user ${user.mepo_employee_id}:`,
        updateError
      );
    }
  }
}

hashAndUpdatePasswords();
