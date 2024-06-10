"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/dist/server/api-utils";
import { saveMeal } from "./meals";

export async function shareMeal(prevState, formData) {
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
  };

  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    meal.image.size === 0
  ) {
    return {
      message: "Invalid value.",
    };
  }

  await saveMeal(meal);
  revalidatePath("meals", "layout");
  redirect("/meals");
}

function isInvalidText(text) {
  return !text || text.trim() === "";
}
