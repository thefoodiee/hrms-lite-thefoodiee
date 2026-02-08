"use client"
import { useForm } from "react-hook-form";

export default function TestForm() {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register("name")} />
      <button type="submit">Submit</button>
    </form>
  );
}
