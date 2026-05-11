/**
 * Form validation utilities for Lenzify
 * Used across checkout, auth, and contact forms
 */

export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): string | null {
  if (!email || !email.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return "Please enter a valid email address";
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone || !phone.trim()) return "Phone number is required";
  const cleaned = phone.replace(/[\s\-\+\(\)]/g, "");
  if (cleaned.length < 10 || cleaned.length > 13) return "Phone number must be 10 digits";
  if (!/^\d+$/.test(cleaned.slice(-10))) return "Phone number must contain only digits";
  return null;
}

export function validatePincode(pincode: string): string | null {
  if (!pincode || !pincode.trim()) return "Pincode is required";
  const cleaned = pincode.trim();
  if (!/^\d{6}$/.test(cleaned)) return "Pincode must be exactly 6 digits";
  return null;
}

export function validateName(name: string): string | null {
  if (!name || !name.trim()) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  if (name.trim().length > 100) return "Name is too long";
  return null;
}

export function validateAddress(address: string): string | null {
  if (!address || !address.trim()) return "Address is required";
  if (address.trim().length < 10) return "Please enter a complete address";
  return null;
}

export function validateCity(city: string): string | null {
  if (!city || !city.trim()) return "City is required";
  if (city.trim().length < 2) return "Please enter a valid city name";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
}

export function validateCheckoutAddress(data: {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  const nameErr = validateName(data.name);
  if (nameErr) errors.push({ field: "name", message: nameErr });

  const phoneErr = validatePhone(data.phone);
  if (phoneErr) errors.push({ field: "phone", message: phoneErr });

  const addressErr = validateAddress(data.address);
  if (addressErr) errors.push({ field: "address", message: addressErr });

  const cityErr = validateCity(data.city);
  if (cityErr) errors.push({ field: "city", message: cityErr });

  const pincodeErr = validatePincode(data.pincode);
  if (pincodeErr) errors.push({ field: "pincode", message: pincodeErr });

  return errors;
}

/**
 * Sanitize error messages to never expose internal DB details to the user
 */
export function sanitizeErrorMessage(error: string): string {
  // Map common Supabase/internal errors to user-friendly messages
  if (error.includes("duplicate key")) return "This item already exists. Please try a different one.";
  if (error.includes("foreign key")) return "A required reference is missing. Please try again.";
  if (error.includes("null value")) return "Please fill in all required fields.";
  if (error.includes("violates check")) return "One of your inputs is out of the allowed range.";
  if (error.includes("permission denied")) return "You don't have permission to perform this action.";
  if (error.includes("JWT")) return "Your session has expired. Please log in again.";
  if (error.includes("not found")) return "The requested resource was not found.";
  // Generic fallback — never expose raw error
  return "Something went wrong. Please try again or contact support.";
}
