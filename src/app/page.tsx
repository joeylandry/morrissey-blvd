import Site from "@/components/Site";
import { getProducts } from "@/lib/shopify";

export const revalidate = 3600;

export default async function Page() {
  const products = await getProducts();
  return <Site products={products} />;
}
