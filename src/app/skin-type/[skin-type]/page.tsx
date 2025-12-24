import { getSkinTypeCategoryData } from "../../../../lib/getSkinTypeCategoryData";
import { cache } from 'react';
import { notFound } from 'next/navigation';

type SkinTypeCategoryPageProps = Promise<{
  skin_type: string;
}>;

const getCachedSkinTypeCategoryData = cache((skin_type: string) => getSkinTypeCategoryData(skin_type));

export default async function SkinTypeCategoryPage({
  params,
}: {
  params: SkinTypeCategoryPageProps;
}) {
  const { skin_type } = await params;

  try {

    const data = await getCachedSkinTypeCategoryData(skin_type);

    if (
      !data ||
      !Array.isArray(data.products) ||
      data.products.length === 0
    ) {
      return notFound();
    }

  } catch (error) {
    console.error("Error fetching data:", error);
    return notFound();
  }
}

