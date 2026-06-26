-- Safe stock decrement: returns TRUE if decremented, FALSE if out of stock.
-- Treats NULL stock_quantity as unlimited (always returns TRUE).
CREATE OR REPLACE FUNCTION public.decrement_inventory_safe(p_id UUID, p_qty INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_stock INT;
BEGIN
  SELECT stock_quantity INTO current_stock
  FROM public.products
  WHERE id = p_id
  FOR UPDATE;

  -- NULL means unlimited stock — always allow
  IF current_stock IS NULL THEN
    RETURN TRUE;
  END IF;

  IF current_stock < p_qty THEN
    RETURN FALSE;
  END IF;

  UPDATE public.products
  SET stock_quantity = stock_quantity - p_qty,
      updated_at = now()
  WHERE id = p_id;

  RETURN TRUE;
END;
$$;

-- Restore stock when order is cancelled
CREATE OR REPLACE FUNCTION public.increment_stock(product_id UUID, quantity INT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.products
  SET stock_quantity = COALESCE(stock_quantity, 0) + quantity,
      updated_at = now()
  WHERE id = product_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.decrement_inventory_safe(UUID, INT) TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_stock(UUID, INT) TO service_role;
