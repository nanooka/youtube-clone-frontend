import React, { createContext, useContext, useState, ReactNode } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  day: string;
  month: string;
  year: string;
  gender: string;
  email: string;
  password: string;
}

interface FormContextProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  nextStep: () => void;
  //   prevStep: () => void;
  step: number;
}

const FormContext = createContext<FormContextProps | undefined>(undefined);

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    day: "",
    month: "",
    year: "",
    gender: "",
    email: "",
    password: "",
  });

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  //   const prevStep = () => setStep((prevStep) => prevStep - 1);

  console.log(formData);

  return (
    <FormContext.Provider value={{ formData, setFormData, nextStep, step }}>
      {children}
    </FormContext.Provider>
  );
};
