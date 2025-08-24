// Input field utilities
export const capitalizeFirstLetter = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const handleInputChange = (e, setValue) => {
  const { value } = e.target;
  const capitalizedValue = capitalizeFirstLetter(value);
  setValue(capitalizedValue);
};

export const handleInputChangeWithValidation = (e, setValue, setErrors, fieldName) => {
  const { value } = e.target;
  const capitalizedValue = capitalizeFirstLetter(value);
  setValue(capitalizedValue);
  
  // Clear error when user starts typing
  if (setErrors && fieldName) {
    setErrors(prev => ({
      ...prev,
      [fieldName]: ""
    }));
  }
};
