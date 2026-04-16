"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function uploadToSupabase(file: File, bucket: string = "product-images") {
  const supabase = await createAdminClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    console.error("Upload error details:", error);
    if (error.message.includes("row-level security policy")) {
      throw new Error(`STORAGE PERMISSION DENIED: Your Supabase bucket "product-images" is locked. Please run the SQL fix I provided in the dashboard to unlock it.`);
    }
    throw new Error(`Failed to upload ${file.name}: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function createProduct(formData: FormData) {
  const supabase = await createAdminClient();

  const product_type = formData.get("product_type") as string || "frame";
  
  // Extract common fields
  const name = formData.get("name") as string;
  const brand = formData.get("brand") as string;
  const sku = formData.get("sku") as string;
  const price = parseFloat(formData.get("price") as string);
  const discount_price = formData.get("offer_price") ? parseFloat(formData.get("offer_price") as string) : null;
  const stock = parseInt(formData.get("stock") as string);
  const categoryIdRaw = formData.get("category_id");
  const category_id = categoryIdRaw ? parseInt(categoryIdRaw as string) : null;
  const description = formData.get("description") as string;
  
  // Extract Specs
  const frame_type = formData.getAll("frame_style").join(", ");
  const shape = formData.get("shape") as string;
  const material = formData.getAll("material").join(", ");
  const gender = formData.getAll("gender"); 
  const color = formData.get("color") as string;
  const size = formData.get("size") as string;

  const collection = formData.getAll("collection");
  const usage_type = formData.getAll("usage_type");
  
  const colorsListRaw = formData.get("colors_list") as string;
  const sizesListRaw = formData.get("sizes_list") as string;
  const colors = colorsListRaw ? colorsListRaw.split(",").map(c => c.trim()).filter(Boolean) : [];
  const sizes = sizesListRaw ? sizesListRaw.split(",").map(s => s.trim()).filter(Boolean) : [];
  
  // Extract Metadata
  const is_featured = formData.get("is_featured") === "true";

  // Handle Image Uploads
  let primary_image_url = "";
  const primaryFile = formData.get("primary_image_file") as File;
  if (primaryFile && primaryFile.size > 0) {
    primary_image_url = await uploadToSupabase(primaryFile);
  }

  const additionalFiles = formData.getAll("additional_images_files") as File[];
  const additional_image_urls: string[] = [];
  for (const file of additionalFiles) {
    if (file && file.size > 0) {
      const url = await uploadToSupabase(file);
      additional_image_urls.push(url);
    }
  }

  const { data: product, error: productError } = await supabase.from("products").insert({
    name,
    sku,
    description,
    price,
    discount_price,
    category_id,
    brand,
    product_type,
    frame_type,
    shape,
    gender,
    material,
    color,
    size,
    collection,
    colors,
    sizes,
    stock,
    is_featured,
    primary_image: primary_image_url,
    is_enabled: formData.get("is_enabled") !== "false",
    images_360: JSON.parse(formData.get("images_360") as string || "[]"),
    specifications: {
      ...JSON.parse(formData.get("specifications") as string || "{}"),
      usage_type
    },
    tags: (formData.get("tags") as string || "").split(",").map(t => t.trim()).filter(Boolean),
    variants: JSON.parse(formData.get("variants") as string || "[]")
  }).select("id").single();

  if (productError) {
    console.error("Error creating product:", productError);
    redirect(`/admin/products/new?error=${encodeURIComponent(productError.message)}`);
  }

  // Handle compatible lenses
  if (product_type === "frame") {
    const compatibleLenses = formData.getAll("compatible_lenses") as string[];
    if (compatibleLenses.length > 0) {
      const productLensesToInsert = compatibleLenses.map(lensId => ({
        product_id: product.id,
        lens_id: lensId
      }));
      const { error: plError } = await supabase.from("product_lenses").insert(productLensesToInsert);
      if (plError) console.error("Error inserting product lenses:", plError);
    }
  }

  // Insert Images record into product_images table
  const imagesToInsert = [];
  if (primary_image_url) {
    imagesToInsert.push({ product_id: product.id, image_url: primary_image_url, is_primary: true });
  }
  additional_image_urls.forEach(url => {
    imagesToInsert.push({ product_id: product.id, image_url: url, is_primary: false });
  });

  if (imagesToInsert.length > 0) {
    const { error: imageError } = await supabase.from("product_images").insert(imagesToInsert);
    if (imageError) console.error("Error inserting product images:", imageError);
  }

  // Handle Multi-Sector (Junction Table)
  const categoryIds = formData.getAll("category_ids") as string[];
  if (categoryIds.length > 0) {
    const sectorLinks = categoryIds.map(catId => ({
      product_id: product.id,
      category_id: parseInt(catId)
    }));
    const { error: sectorError } = await supabase.from("product_categories").insert(sectorLinks);
    if (sectorError) console.error("Error linking sectors:", sectorError);
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/products/new?success=true");
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createAdminClient();

  const product_type = formData.get("product_type") as string || "frame";

  // Extract common fields
  const name = formData.get("name") as string;
  const brand = formData.get("brand") as string;
  const sku = formData.get("sku") as string;
  const price = parseFloat(formData.get("price") as string);
  const discount_price = formData.get("offer_price") ? parseFloat(formData.get("offer_price") as string) : null;
  const stock = parseInt(formData.get("stock") as string);
  const categoryIdRaw = formData.get("category_id");
  const category_id = categoryIdRaw ? parseInt(categoryIdRaw as string) : null;
  const description = formData.get("description") as string;
  
  // Extract Specs
  const frame_type = formData.getAll("frame_style").join(", ");
  const shape = formData.get("shape") as string;
  const material = formData.getAll("material").join(", ");
  const gender = formData.getAll("gender"); 
  const color = formData.get("color") as string;
  const size = formData.get("size") as string;

  const collection = formData.getAll("collection");
  const usage_type = formData.getAll("usage_type");
  
  const colorsListRaw = formData.get("colors_list") as string;
  const sizesListRaw = formData.get("sizes_list") as string;
  const colors = colorsListRaw ? colorsListRaw.split(",").map(c => c.trim()).filter(Boolean) : [];
  const sizes = sizesListRaw ? sizesListRaw.split(",").map(s => s.trim()).filter(Boolean) : [];
  
  // Extract Metadata
  const is_featured = formData.get("is_featured") === "true";
  const is_enabled = formData.get("is_enabled") !== "false";

  const updatePayload: any = {
    name,
    sku,
    description,
    price,
    discount_price,
    category_id,
    brand,
    product_type,
    frame_type,
    shape,
    gender,
    material,
    color,
    size,
    collection,
    colors,
    sizes,
    stock,
    is_featured,
    is_enabled,
    images_360: JSON.parse(formData.get("images_360") as string || "[]"),
    specifications: {
      ...JSON.parse(formData.get("specifications") as string || "{}"),
      usage_type
    },
    tags: (formData.get("tags") as string || "").split(",").map(t => t.trim()).filter(Boolean),
    variants: JSON.parse(formData.get("variants") as string || "[]")
  };

  // Handle image updates if new files provided
  const primaryFile = formData.get("primary_image_file") as File;
  const additionalFiles = formData.getAll("additional_images_files") as File[];
  let primary_image_url = "";

  if (primaryFile && primaryFile.size > 0) {
    primary_image_url = await uploadToSupabase(primaryFile);
    updatePayload.primary_image = primary_image_url;
  }

  const { error: productError } = await supabase.from("products").update(updatePayload).eq("id", id);
  if (productError) {
      console.error("Error updating product:", productError);
      redirect(`/admin/products/${id}/edit?error=${encodeURIComponent(productError.message)}`);
  }

  // Handle compatible lenses update
  if (product_type === "frame") {
    // Delete existing
    await supabase.from("product_lenses").delete().eq("product_id", id);
    // Insert new
    const compatibleLenses = formData.getAll("compatible_lenses") as string[];
    if (compatibleLenses.length > 0) {
      const productLensesToInsert = compatibleLenses.map(lensId => ({
        product_id: id,
        lens_id: lensId
      }));
      await supabase.from("product_lenses").insert(productLensesToInsert);
    }
  }

  if ((primaryFile && primaryFile.size > 0) || additionalFiles.some(f => f && f.size > 0)) {
      const imagesToInsert = [];
      
      if (primaryFile && primaryFile.size > 0) {
        // Delete old primary
        await supabase.from("product_images").delete().eq("product_id", id).eq("is_primary", true);
        imagesToInsert.push({ product_id: id, image_url: primary_image_url, is_primary: true });
      }

      for (const file of additionalFiles) {
        if (file && file.size > 0) {
          const url = await uploadToSupabase(file);
          imagesToInsert.push({ product_id: id, image_url: url, is_primary: false });
        }
      }
      
      if (imagesToInsert.length > 0) {
          await supabase.from("product_images").insert(imagesToInsert);
      }
  }

  // Handle Multi-Sector Update
  const categoryIds = formData.getAll("category_ids") as string[];
  if (categoryIds.length > 0) {
    // 1. Clear existing links
    await supabase.from("product_categories").delete().eq("product_id", id);
    // 2. Insert new links
    const sectorLinks = categoryIds.map(catId => ({
      product_id: id,
      category_id: parseInt(catId)
    }));
    const { error: listError } = await supabase.from("product_categories").insert(sectorLinks);
    if (listError) console.error("Error updating sector links:", listError);
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  revalidatePath("/");
  
  redirect(`/admin/products/${id}/edit?success=true`);
}

export async function deleteProduct(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function duplicateProduct(id: string) {
    const supabase = await createAdminClient();
    const { data: product, error: fetchError } = await supabase.from("products").select("*, product_images(*)").eq("id", id).single();
    if (fetchError || !product) return { error: fetchError?.message || "Product not found" };

    const { id: _, created_at: __, product_images, ...newProductData } = product;
    newProductData.name = `${product.name} (Copy)`;
    const { data: newProduct, error: insertError } = await supabase.from("products").insert(newProductData).select("id").single();
    if (insertError) return { error: insertError.message };

    if (product_images && product_images.length > 0) {
        const imagesToInsert = product_images.map((img: any) => ({
            product_id: newProduct.id,
            image_url: img.image_url,
            is_primary: img.is_primary
        }));
        await supabase.from("product_images").insert(imagesToInsert);
    }
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
}

export async function toggleProductStatus(id: string, currentStatus: boolean) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("products").update({ is_enabled: !currentStatus }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

/**
 * CATALOG SYNCHRONIZATION (CSV)
 */

export async function exportProducts() {
    const supabase = await createAdminClient();
    const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    if (!products || products.length === 0) return { success: true, csv: "" };

    // Standard CSV Generation
    const headers = ["name", "brand", "sku", "price", "discount_price", "stock", "product_type", "frame_type", "shape", "material", "color", "size"];
    const csvContent = [
        headers.join(","),
        ...products.map(p => headers.map(h => `"${(p as any)[h] || ''}"`).join(","))
    ].join("\n");

    return { success: true, csv: csvContent };
}

export async function importProducts(csvContent: string) {
    const supabase = await createAdminClient();
    const lines = csvContent.split("\n").filter(line => line.trim());
    if (lines.length < 2) return { error: "Insufficient data protocol." };

    const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ''));
    const data = lines.slice(1).map(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/"/g, ''));
        const obj: any = {};
        headers.forEach((h, i) => {
            obj[h] = values[i];
        });
        return obj;
    });

    for (const item of data) {
        // Upsert logic based on SKU
        const { error } = await supabase.from("products").upsert({
            name: item.name,
            brand: item.brand,
            sku: item.sku,
            price: parseFloat(item.price) || 0,
            discount_price: parseFloat(item.discount_price) || null,
            stock: parseInt(item.stock) || 0,
            product_type: item.product_type || 'frame',
            frame_type: item.frame_type,
            shape: item.shape,
            material: item.material,
            color: item.color,
            size: item.size,
            is_enabled: true
        }, { onConflict: 'sku' });
        
        if (error) console.error(`Sync error for ${item.sku}:`, error);
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
}
