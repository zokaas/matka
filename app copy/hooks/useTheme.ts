import { useLoaderData } from "react-router";

export function useTheme() {
    const { productId } = useLoaderData<{ productId: string }>();
    return productId;
}
