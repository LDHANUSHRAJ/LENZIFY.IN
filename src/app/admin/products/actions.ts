"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  // Extract common fields
  const name = formData.get("name") as string;
  const brand = formData.get("brand") as string;
  const sku = formData.get("sku") as string;
  const price = parseFloat(formData.get("price") as string);
  const offer_price = formData.get("offer_price") ? parseFloat(formData.get("offer_price") as string) : null;
  const stock = parseInt(formData.get("stock") as string);
  const category_id = parseInt(formData.get("category_id") as string);
  const description = formData.get("description") as string;
  
  // Extract Specs
  const frame_type = formData.get("frame_type") as string;
  const shape = formData.get("shape") as string;
  const material = formData.get("material") as string;
  const gender = formData.get("gender") as string;
  const color = formData.get("color") as string;
  const size = formData.get("size") as string;
  
  // Extract Metadata
  const is_featured = formData.get("is_featured") === "true";

  // Primary image
  const primary_image = formData.get("primary_image") as string;
  // Additional images (comma separated URLs)
  const additional_images = (formData.get("additional_images") as string || "").split(",").filter(Boolean);

  const { data: product, error: productError } = await supabase.from("products").insert({
    name,
    sku,
    description,
    price,
    offer_price,
    category_id,
    brand,
    frame_type,
    shape,
    gender,
    material,
    color,
    size,
    stock,
    is_featured,
    is_enabled: formData.get("is_enabled") !== "false", // Default true
    images_360: JSON.parse(formData.get("images_360") as string || "[]"),
    specifications: JSON.parse(formData.get("specifications") as string || "{}"),
    tags: (formData.get("tags") as string || "").split(",").map(t => t.trim()).filter(Boolean),
    variants: JSON.parse(formData.get("variants") as string || "[]")
  }).select("id").single();

  if (productError) {
    console.error("Error creating product:", productError);
    return { error: productError.message };
  }

  // Insert Images
  const imagesToInsert = [
    { product_id: product.id, image_url: primary_image, is_primary: true },
    ...additional_images.map(url => ({ product_id: product.id, image_url: url.trim(), is_primary: false }))
  ];

  if (imagesToInsert.length > 0) {
    const { error: imageError } = await supabase.from("product_images").insert(imagesToInsert);
    if (imageError) console.error("Error inserting product images:", imageError);
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();

  // Extract common fields
  const name = formData.get("name") as string;
  const brand = formData.get("brand") as string;
  const sku = formData.get("sku") as string;
  const price = parseFloat(formData.get("price") as string);
  const offer_price = formData.get("offer_price") ? parseFloat(formData.get("offer_price") as string) : null;
  const stock = parseInt(formData.get("stock") as string);
  const category_id = parseInt(formData.get("category_id") as string);
  const description = formData.get("description") as string;
  
  // Extract Specs
  const frame_type = formData.get("frame_type") as string;
  const shape = formData.get("shape") as string;
  const material = formData.get("material") as string;
  const gender = formData.get("gender") as string;
  const color = formData.get("color") as string;
  const size = formData.get("size") as string;
  
  // Extract Metadata
  const is_featured = formData.get("is_featured") === "true";
  const is_enabled = formData.get("is_enabled") === "true";

  const { error: productError } = await supabase.from("products").update({
    name,
    sku,
    description,
    price,
    offer_price,
    category_id,
    brand,
    frame_type,
    shape,
    gender,
    material,
    color,
    size,
    stock,
    is_featured,
    is_enabled,
    images_360: JSON.parse(formData.get("images_360") as string || "[]"),
    specifications: JSON.parse(formData.get("specifications") as string || "{}"),
    tags: (formData.get("tags") as string || "").split(",").map(t => t.trim()).filter(Boolean),
    variants: JSON.parse(formData.get("variants") as string || "[]")
  }).eq("id", id);

  if (productError) {
    console.error("Error updating product:", productError);
    return { error: productError.message };
  }

  // Handle images if provided
  const primary_image = formData.get("primary_image") as string;
  const additional_images_str = formData.get("additional_images") as string;

  if (primary_image || additional_images_str) {
      // Reconcile images
      await supabase.from("product_images").delete().eq("product_id", id);
      
      const imagesToInsert = [];
      if (primary_image) imagesToInsert.push({ product_id: id, image_url: primary_image, is_primary: true });
      if (additional_images_str) {
          const additional = additional_images_str.split(",").filter(Boolean).map(url => ({ 
              product_id: id, 
              image_url: url.trim(), 
              is_primary: false 
          }));
          imagesToInsert.push(...additional);
      }
      
      if (imagesToInsert.length > 0) {
          await supabase.from("product_images").insert(imagesToInsert);
      }
  }

  revalidatePath("/admin/products");
  revalidatePath(`/products/${id}`);
  revalidatePath("/");
  
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/products");
}

export async function duplicateProduct(id: string) {
    const supabase = await createClient();
    const { data: product, error: fetchError } = await supabase.from("products").select("*, product_images(*)").eq("id", id).single();

    if (fetchError || !product) {
        return { error: fetchError?.message || "Product not found" };
    }

    const { id: _, created_at: __, product_images, ...newProductData } = product;
    newProductData.name = `${product.name} (Copy)`;

    const { data: newProduct, error: insertError } = await supabase.from("products").insert(newProductData).select("id").single();

    if (insertError) {
        return { error: insertError.message };
    }

    if (product_images && product_images.length > 0) {
        const imagesToInsert = product_images.map((img: any) => ({
            product_id: newProduct.id,
            image_url: img.image_url,
            is_primary: img.is_primary
        }));
        await supabase.from("product_images").insert(imagesToInsert);
    }

    revalidatePath("/admin/products");
}
export async function exportProducts() {
    const supabase = await createClient();
    const { data: products, error } = await supabase
        .from("products")
        .select("*, categories(name)");

    if (error || !products) return { error: error?.message || "No products found" };

    const headers = [
        "id", "name", "brand", "sku", "price", "offer_price", "stock", 
        "category_id", "description", "frame_type", "shape", "material", 
        "gender", "color", "size", "is_featured", "is_enabled"
    ];

    const rows = products.map(p => [
        p.id, p.name, p.brand, p.sku, p.price, p.offer_price || "", p.stock,
        p.category_id, p.description?.replace(/,/g, ";") || "", p.frame_type, p.shape, p.material,
        p.gender, p.color, p.size, p.is_featured, p.is_enabled
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    return { success: true, csv: csvContent };
}

export async function importProducts(csvContent: string) {
    const supabase = await createClient();
    const lines = csvContent.split("\n").filter(l => l.trim() !== "");
    const headers = lines[0].split(",");
    const products = lines.slice(1).map(line => {
        const values = line.split(",");
        const obj: any = {};
        headers.forEach((header, i) => {
            let val: any = values[i];
            if (["price", "offer_price", "stock", "category_id"].includes(header)) {
                val = val ? parseFloat(val) : null;
            } else if (["is_featured", "is_enabled"].includes(header)) {
                val = val === "true";
            }
            obj[header] = val;
        });
        return obj;
    });

    const { error } = await supabase.from("products").upsert(products, { onConflict: "sku" });

    if (error) return { error: error.message };

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
}

export async function toggleProductStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ is_enabled: !currentStatus })
    .eq("id", id);
    
  if (error) {
    console.error("Error toggling product status:", error);
    return { error: error.message };
  }
  
  revalidatePath("/admin/products");
}
