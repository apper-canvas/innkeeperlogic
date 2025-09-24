import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  required, 
  children, 
  options,
  ...props 
}) => {
  const renderInput = () => {
    if (type === "select") {
      return (
        <Select error={error} {...props}>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          {children}
        </Select>
      );
    }
    
    return <Input type={type} error={error} {...props} />;
  };

  return (
    <div className="space-y-1">
      {label && <Label required={required}>{label}</Label>}
      {renderInput()}
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;