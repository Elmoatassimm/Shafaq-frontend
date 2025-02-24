import { useState } from "react";
export const Input = ({
  labelTitle,
  type,
  containerStyle,
  placeholder,
  updateFormValue,
  updateType,
}) => {
  const [value, setValue] = useState("");

  const updateInputValue = (val) => {
    setValue(val);
    updateFormValue({ updateType, value: val });
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label">
        <span className="label-text text-base-content">{labelTitle}</span>
      </label>
      <input
        type={type || "text"}
        value={value}
        placeholder={placeholder || ""}
        onChange={(e) => updateInputValue(e.target.value)}
        className="input input-bordered w-full"
      />
    </div>
  );
};
