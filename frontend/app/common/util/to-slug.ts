import slugify from "slugify";

export const toSlug = (text: string): string => {
  return slugify(text, {
    lower: true,
    strict: true,
    replacement: "-",
  })
    .slice(0, 50)
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};
