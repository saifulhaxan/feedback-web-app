// Input field utilities
export const capitalizeFirstLetter = (str) => {
  if (!str || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const handleInputChange = (e, setValue) => {
  const { value } = e.target;
  setValue(value); // Always allow normal typing
};

export const handleInputChangeWithValidation = (e, setValue, setErrors, fieldName) => {
  const { value } = e.target;
  setValue(value); // Always allow normal typing
  
  // Clear error when user starts typing
  if (setErrors && fieldName) {
    setErrors(prev => ({
      ...prev,
      [fieldName]: ""
    }));
  }
};
