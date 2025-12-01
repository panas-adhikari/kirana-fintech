

// Error Constants
const passErr1 = "Password must contain at least one lowercase letter";
const passErr2 = "Password must contain at least one uppercase letter";
const passErr3 = "Password must contain at least one number";
const passErr4 = "Password must contain at least one special character (@$!%*?&)";
const passErr5 = "Password must be at least 8 characters long";
const emailErr = "Please enter a valid email address";

// Interface for return type
interface ValidationResult {
    error: boolean;
    message: string;
}

/**
 * Validates password based on specific granularity.
 * Checks order: Length -> Lower -> Upper -> Number -> Special
 */
export const registerPasswordValidator = (password: string): ValidationResult => {
    // 1. Check Length
    if (password.length < 8) {
        return { error: true, message: passErr5 };
    }

    // 2. Check Lowercase
    if (!/(?=.*[a-z])/.test(password)) {
        return { error: true, message: passErr1 };
    }

    // 3. Check Uppercase
    if (!/(?=.*[A-Z])/.test(password)) {
        return { error: true, message: passErr2 };
    }

    // 4. Check Number
    if (!/(?=.*\d)/.test(password)) {
        return { error: true, message: passErr3 };
    }

    // 5. Check Special Character
    // Note: This regex strictly checks for the special chars defined in your original snippet.
    if (!/(?=.*[@$!%*?&])/.test(password)) {
        return { error: true, message: passErr4 };
    }

    // If all pass
    return { error: false, message: "Good to go" };
};

/**
 * Validates confirm password 
 */

export const registerConfirmPasswordValidator = (confirmPassword: string, password: string): ValidationResult => {
    if(confirmPassword !== password ){
        return {error: true, message: "Passwords do not match"};
    }

    return { error: false, message: "Good to go" };
};

/**
 * Validates Email format for Registration
 */
export const registerEmailValidator = (email: string): ValidationResult => {
    // Basic HTML5 email regex pattern
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!emailRegex.test(email)) {
        return { error: true, message: emailErr };
    }

    return { error: false, message: "" };
};


/**
 * Validates Email format for Login
 * (Often identical to register, but sometimes allows simpler format if username is allowed)
 */
export const loginEmailValidator = (email: string): ValidationResult => {
    // Using the same strict regex as registration
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!email || !emailRegex.test(email)) {
        return { error: true, message: emailErr };
    }

    return { error: false, message: "" };
};

export const validator = (validationType: string, value: string, password?: string) => {
    switch (validationType) {
        case "email":
            return registerEmailValidator(value);
        case "password":
            return registerPasswordValidator(value);
        case "confirmPassword":
            // Call registerConfirmPasswordValidator with both confirmPassword and password
            if (password) {
                return registerConfirmPasswordValidator(value, password);  // Validate confirmPassword
            } else {
                return { error: true, message: "Password is required" };  // Handle case where password is missing
            }
        default:
            return { error: true, message: "Invalid validation type" };
    }
}